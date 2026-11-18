import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, GROUND_Y } from "./theme";
import { Stickman } from "./components/Stickman";
import { Jar } from "./components/Objects";
import { ease, Stamp, Tag, usePop } from "./components/ui";
import { Ground, moodAt, Sfx, Svg, usePoseTrack, useWords } from "./scenes";
import type { SceneProps } from "./types";

const short = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`);

// Frame 1: "SAVED BY 30?" — viewer instantly guesses
const AgeHook: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const tGuess = w(p.guessWord, 80), tLow = w(p.lowWord, 110);
  const s = usePop(-30);
  const pulse = 1 + 0.05 * Math.sin(frame / 4);
  const mike = characters.mike;
  const pos = [
    [200, 650, -8],
    [540, 720, 4],
    [880, 650, 8],
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 900, scale: String(s) }}>
        <div style={{ fontSize: 72, color: C.ink, letterSpacing: -2 }}>{p.line1 ?? "HOW MUCH SAVED BY"}</div>
        <div style={{ display: "inline-block", marginTop: 14, background: C.yellow, border: `9px solid ${C.ink}`, borderRadius: 34, padding: "0 50px", fontSize: 230, lineHeight: 1.05, color: C.ink, scale: String(pulse), boxShadow: `0 14px 0 ${C.ink}` }}>
          {p.big ?? `${p.age}?`}
        </div>
      </div>
      <Svg>
        <Ground />
        <Jar x={780} y={GROUND_Y} fill={0.08} label="?" />
        <Stickman x={300} y={GROUND_Y} pose={usePoseTrack([[0, "shrug"], [tLow, "facepalm"]])} color={mike.color} name={mike.name} scale={0.85} mood={moodAt(frame, [[0, "neutral"], [tLow, "shock"]])} />
      </Svg>
      {(p.guesses as string[]).map((g, i) => (
        <React.Fragment key={i}>
          <Tag x={pos[i][0]} y={pos[i][1]} at={tGuess + i * 5} text={g} bg="#fff" color={C.ink} size={Math.min(56, Math.floor(270 / (g.length * 0.62)))} rotate={pos[i][2]} />
          {frame >= tLow + i * 3 && (
            <div style={{ position: "absolute", left: pos[i][0] - 110, top: pos[i][1] - 6, width: 220, height: 14, background: C.red, borderRadius: 7, rotate: `${-10 + i * 6}deg` }} />
          )}
        </React.Fragment>
      ))}
      <Stamp x={540} y={820} at={tLow + 10} text={p.stamp ?? "TOO LOW"} size={96} />
      <Sfx at={0} name="whoosh" />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={tGuess + i * 5} name="pop" volume={0.5} />
      ))}
      <Sfx at={tLow + 10} name="thud" />
    </AbsoluteFill>
  );
};

type Step = { age: number; x: number; word: string };
const AgeLadder: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const steps = p.steps as Step[];
  const times = steps.map((s, i) => w(s.word, 40 + i * 50));
  const maxX = Math.max(...steps.map((s) => s.x));
  const H = 600, bw = 150, gap = 200, x0 = 540 - ((steps.length - 1) * gap) / 2;
  const tSave = times[times.length - 1] + 25;
  const sTitle = usePop(0);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 175, textAlign: "center", fontFamily: FONT, fontWeight: 900, scale: String(sTitle) }}>
        <div style={{ fontSize: 86, color: C.ink, letterSpacing: -2 }}>SAVED BY AGE</div>
        <div style={{ fontSize: 40, color: C.gray, marginTop: 6 }}>EXAMPLE SALARY: ${(p.salary / 1000).toFixed(0)}K / YEAR</div>
      </div>
      <Svg>
        <Ground />
        {steps.map((s, i) => {
          if (frame < times[i]) return null;
          const k = ease(frame, times[i], times[i] + 10, 0, 1);
          const h = (s.x / maxX) * H * k;
          const cx = x0 + i * gap;
          const last = i === steps.length - 1;
          return (
            <g key={i}>
              <rect x={cx - bw / 2} y={GROUND_Y - h} width={bw} height={h} rx={10} fill={last ? C.green : i % 2 ? "#60A5FA" : C.blue} stroke={C.ink} strokeWidth={7} />
              <text x={cx} y={GROUND_Y - h - 66} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={58} fill={C.ink} opacity={k}>
                {s.x}x
              </text>
              <text x={cx} y={GROUND_Y - h - 20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill={last ? C.green : C.blue} opacity={k}>
                {short(s.x * p.salary)}
              </text>
              <rect x={cx - 62} y={GROUND_Y + 22} width={124} height={62} rx={14} fill={C.ink} />
              <text x={cx} y={GROUND_Y + 66} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.yellow}>
                {s.age}
              </text>
            </g>
          );
        })}
      </Svg>
      <Tag x={300} y={460} at={tSave} text="SAVE THIS" bg={C.yellow} color={C.ink} size={58} rotate={-5} />
      {times.map((t, i) => (
        <Sfx key={i} at={t} name={i === times.length - 1 ? "ding" : "pop"} />
      ))}
    </AbsoluteFill>
  );
};

const Behind: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const ch = characters[p.who];
  const tAge = w(p.ageWord, 80), tHas = w(p.hasWord, 115);
  const fill = ease(frame, tHas, tHas + 14, 0, 0.033);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 104, color: C.ink, letterSpacing: -2, scale: String(usePop(0)) }}>ON TRACK?</div>
      <Tag x={540} y={380} at={tAge} text={p.age} bg={C.ink} color={C.yellow} size={60} />
      {frame >= tAge && (
        <div style={{ position: "absolute", left: 90, right: 90, top: 470, fontFamily: FONT, fontWeight: 900 }}>
          <div style={{ fontSize: 46, color: C.ink }}>{p.target}</div>
          <div style={{ marginTop: 12, height: 70, background: "#fff", border: `7px solid ${C.ink}`, borderRadius: 35, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.max(fill * 100, frame >= tHas ? 3 : 0)}%`, background: C.red }} />
          </div>
          <div style={{ fontSize: 46, color: C.red, marginTop: 12, opacity: frame >= tHas ? 1 : 0 }}>{p.has}</div>
        </div>
      )}
      <Svg>
        <Ground />
        <Stickman x={540} y={GROUND_Y} pose={usePoseTrack([[0, "idle"], [tAge, "shrug"], [tHas, "facepalm"]])} color={ch.color} name={ch.name} scale={0.8} mood={moodAt(frame, [[0, "neutral"], [tHas, "sad"]])} />
      </Svg>
      <Sfx at={tAge} name="pop" />
      <Sfx at={tHas} name="thud" />
    </AbsoluteFill>
  );
};

export const SCENES8: Record<string, React.FC<SceneProps>> = {
  ageHook: AgeHook,
  ageLadder: AgeLadder,
  behind: Behind,
};
