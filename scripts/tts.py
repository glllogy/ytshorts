#!/usr/bin/env python3
"""Generate ElevenLabs voiceover + word timings for a story.

Usage: python3 scripts/tts.py stories/001-car-vs-index.json
Writes public/<id>/sNN.mp3 and src/generated/<id>.json, and refreshes src/generated/index.ts.
The API key is injected by the network proxy, so no key is needed here.
"""
import base64, hashlib, json, os, subprocess, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
MODEL = "eleven_multilingual_v2"
GAP = 0.25  # seconds of air after each scene's line


def tts(voice, text, prev_text, next_text):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128"
    body = {
        "text": text,
        "model_id": MODEL,
        "voice_settings": {"stability": 0.4, "similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": True, "speed": 1.08},
    }
    if prev_text:
        body["previous_text"] = prev_text
    if next_text:
        body["next_text"] = next_text
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST",
                                 headers={"Content-Type": "application/json", "xi-api-key": "proxy-injected"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def duration(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path])
    return float(out.strip())


def words_from_alignment(al):
    words, cur, start, end = [], "", None, None
    for ch, s, e in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if ch.isspace():
            if cur:
                words.append({"text": cur, "start": start, "end": end})
            cur, start = "", None
            continue
        if start is None:
            start = s
        cur += ch
        end = e
    if cur:
        words.append({"text": cur, "start": start, "end": end})
    return words


def main(story_path):
    story = json.load(open(story_path))
    sid = story["id"]
    out_dir = os.path.join(ROOT, "public", sid)
    os.makedirs(out_dir, exist_ok=True)
    scenes_out, t = [], 0.0
    texts = [s["text"] for s in story["scenes"]]
    for i, sc in enumerate(story["scenes"]):
        h = hashlib.sha1((story["voice"] + MODEL + sc["text"]).encode()).hexdigest()[:10]
        mp3 = os.path.join(out_dir, f"s{i+1:02d}-{h}.mp3")
        meta = mp3.replace(".mp3", ".json")
        if not os.path.exists(mp3):
            print(f"TTS scene {i+1}: {sc['text'][:50]}...")
            res = tts(story["voice"], sc["text"], texts[i-1] if i else None, texts[i+1] if i + 1 < len(texts) else None)
            open(mp3, "wb").write(base64.b64decode(res["audio_base64"]))
            json.dump(res["alignment"], open(meta, "w"))
        al = json.load(open(meta))
        d = duration(mp3)
        dur_frames = max(round((d + GAP) * FPS), round(1.6 * FPS))
        start_frame = round(t * FPS)
        scenes_out.append({
            "type": sc["type"], "props": sc.get("props", {}), "text": sc["text"],
            "audio": f"{sid}/{os.path.basename(mp3)}",
            "from": start_frame, "durationInFrames": dur_frames,
            "words": words_from_alignment(al),
        })
        t = (start_frame + dur_frames) / FPS
    total = scenes_out[-1]["from"] + scenes_out[-1]["durationInFrames"] + FPS  # 1s tail
    base = os.path.basename(story_path)
    seq = int(base.split("-")[0]) if base.split("-")[0].isdigit() else 1
    gen = {"id": sid, "seq": seq, "title": story.get("title", sid), "fps": FPS, "characters": story.get("characters", {}),
           "durationInFrames": total, "scenes": scenes_out}
    gdir = os.path.join(ROOT, "src", "generated")
    os.makedirs(gdir, exist_ok=True)
    json.dump(gen, open(os.path.join(gdir, f"{sid}.json"), "w"), indent=1)
    # rebuild index
    files = sorted(f for f in os.listdir(gdir) if f.endswith(".json"))
    lines = [f'import s{n} from "./{f}";' for n, f in enumerate(files)]
    lines.append("import type { Timeline } from \"../types\";")
    lines.append("export const stories = [" + ", ".join(f"s{n}" for n in range(len(files))) + "] as unknown as Timeline[];")
    open(os.path.join(gdir, "index.ts"), "w").write("\n".join(lines) + "\n")
    print(f"OK {sid}: {total/FPS:.1f}s, {len(scenes_out)} scenes")


if __name__ == "__main__":
    main(sys.argv[1])
