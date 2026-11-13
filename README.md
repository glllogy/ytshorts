# Money Shorts

Stickman finance stories → YouTube Shorts (1080x1920).

## New video
1. Write `stories/NNN-name.json` (scenes: `type`, `text`, `props`).
2. `python3 scripts/tts.py stories/NNN-name.json` (ElevenLabs voice + word timings)
3. `npx remotion render <id> out/<id>.mp4`

Scene types live in `src/scenes.tsx`. Voice: `voice` field (ElevenLabs voice id).
