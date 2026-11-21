import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, GROUND_Y } from "./theme";
import { Mood, POSES, Stickman } from "./components/Stickman";
import { Bill, Coin } from "./components/Objects";
import { ease, money, Stamp, Tag, Title, usePop } from "./components/ui";
import { House } from "./scenes6";
import { Ground, moodAt, Sfx, Svg, usePoseTrack, useWords } from "./scenes";
import type { SceneProps } from "./types";

const MoneyStack: React.FC<{ x: number; y: number; n?: number; s?: number }> = ({ x, y, n = 8, s = 1.2 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => (
      <Bill key={i} x={x + (i % 2 ? 8 : -8)} y={y - i * 30} rot={i % 3 === 0 ? -4 : 3} s={s} />
    ))}
  </g>
);

// Frame 1 already shows the dilemma: $1M vs 1 cent
const ChoiceHook: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const tPenny = w("penny", 70), tDouble = w("doubles", 85), tWhich = w("which", 150);
  const sL = usePop(-30), sR = usePop(-30), sVs = usePop(-30);
  const pulse = 1 + 0.05 * Math.sin(frame / 3);
  const coinGlow = frame >= tDouble ? 1 + 0.12 * Math.abs(Math.sin((frame - tDouble) / 5)) : 1;
  return (
    <AbsoluteFill>
      <Svg>
        <rect x={0} y={0} width={540} height={1920} fill="#FFE1E1" opacity={0.55} />
        <rect x={540} y={0} width={540} height={1920} fill="#DFF5E6" opacity={0.55} />
        <g transform={`translate(270,880) scale(${sL}) translate(-270,-880)`}>
          <MoneyStack x={270} y={980} n={10} s={1.5} />
        </g>
        <g transform={`translate(810,800) scale(${sR * coinGlow}) translate(-810,-800)`}>
          {p.rightIcon === "house" ? <House x={810} y={930} color="#CDEBD7" s={0.6} /> : <Coin x={810} y={800} r={90} spin={frame >= tPenny ? (frame - tPenny) / 4 : 0} />}
        </g>
      </Svg>
      <div style={{ position: "absolute", left: 0, width: 540, top: 330, textAlign: "center", fontFamily: FONT, fontWeight: 900, scale: String(sL) }}>
        <div style={{ fontSize: Math.min(92, Math.floor(480 / (String(p.left).length * 0.62))), color: C.red, letterSpacing: -3 }}>{p.left}</div>
        <div style={{ fontSize: 46, color: C.ink }}>{p.leftSub}</div>
      </div>
      <div style={{ position: "absolute", left: 540, width: 540, top: 330, textAlign: "center", fontFamily: FONT, fontWeight: 900, scale: String(sR) }}>
        <div style={{ fontSize: Math.min(120, Math.floor(480 / (String(p.right).length * 0.62))), color: C.green, letterSpacing: -3, lineHeight: 0.8 }}>{p.right}</div>
        <div style={{ fontSize: 46, color: C.ink, marginTop: 18 }}>{p.rightSub}</div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 620, translate: "-50% -50%", scale: String(sVs * pulse), background: C.ink, color: C.yellow, fontFamily: FONT, fontWeight: 900, fontSize: 80, width: 170, height: 170, borderRadius: 85, display: "flex", alignItems: "center", justifyContent: "center", border: `8px solid ${C.yellow}` }}>
        VS
      </div>
      <Tag x={810} y={1010} at={w(p.badgeWord ?? "30", 115)} text={p.badge ?? "30 DAYS"} bg={C.green} size={56} rotate={-4} />
      <Tag x={540} y={1170} at={tWhich} text={p.question} bg={C.yellow} color={C.ink} size={84} rotate={-2} />
      <Sfx at={0} name="whoosh" volume={0.8} />
      <Sfx at={2} name="thud" />
      <Sfx at={tPenny} name="coin" />
      <Sfx at={tWhich} name="pop" />
    </AbsoluteFill>
  );
};

const Pick: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const R = characters[scene.props.rich], P = characters[scene.props.poor];
  const tGrab = w(scene.props.grabWord ?? "grabs", 8), tJake = w(scene.props.poorWord ?? "jake", 70), tStop = scene.props.laugh ? w("stop", 130) : 99999;
  const mikePose = usePoseTrack([[0, "idle"], [tGrab, "cheer"], [tStop, "pointRight"]]);
  const jakePose = usePoseTrack([[0, "idle"], [tJake, "present"]]);
  const sCoin = usePop(tJake + 8);
  const stackY = ease(frame, tGrab, tGrab + 10, -400, 0);
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <g transform={`translate(0,${stackY})`}>
          <MoneyStack x={150} y={1100} n={9} s={1.0} />
        </g>
        <Stickman x={330} y={GROUND_Y} pose={mikePose} color={R.color} name={R.name} scale={1.15} mood={moodAt(frame, [[0, "neutral"], [tGrab, "happy"]])} />
        <Stickman x={780} y={GROUND_Y} pose={jakePose} color={P.color} name={P.name} scale={1.15} mood={moodAt(frame, [[0, "neutral"], [tJake, "smug"]])} />
        {frame >= tJake + 8 && <Coin x={905} y={820} r={30 * sCoin} spin={frame / 5} />}
      </Svg>
      <Tag x={330} y={430} at={tGrab + 6} text={scene.props.richTag ?? "$1,000,000"} bg={scene.props.richTag ? C.green : C.red} size={62} rotate={-4} />
      <Tag x={780} y={430} at={tJake + 8} text={scene.props.poorTag ?? "1¢"} bg={scene.props.poorTag ? C.blue : C.green} size={scene.props.poorTag ? 56 : 70} rotate={4} />
      {[0, 1, 2].map((i) => (
        <Tag key={i} x={240 + i * 130} y={560 + (i % 2) * 60} at={tStop + i * 5} text={(scene.props.laugh ?? "").split(" ")[i] ?? "HA"} bg={C.yellow} color={C.ink} size={48} rotate={i % 2 ? 8 : -8} />
      ))}
      <Sfx at={tGrab} name="whoosh" />
      <Sfx at={tGrab + 10} name="thud" />
      <Sfx at={tJake + 8} name="coin" />
      <Sfx at={tStop} name="pop" />
    </AbsoluteFill>
  );
};

const penny = (day: number) => 0.01 * Math.pow(2, day - 1);
const fmt = (v: number) => (v < 100 ? "$" + v.toFixed(2) : money(v));

const Doubling: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const mike = characters.mike, jake = characters.jake;
  const tVal = w("$", 30);
  const dayF = ease(frame, 2, Math.max(8, tVal + 6), p.fromDay, p.toDay);
  const day = Math.floor(dayF + 1e-6);
  const jv = penny(dayF);
  const MIKE = 1_000_000;
  const scale = Math.max(MIKE, jv);
  const H = 560, bw = 170;
  const hM = (MIKE / scale) * H, hJ = Math.max(6, (jv / scale) * H);
  const tMood = p.moodWord ? w(p.moodWord, 60) : 0;
  const mikeMood = (frame >= tMood ? p.mike[1] : "happy") as Mood;
  const tStamp = p.stampWord ? w(p.stampWord, 80) : 0;
  const tSays = p.mikeSaysWord ? w(p.mikeSaysWord, 30) : 0;
  const ahead = jv > MIKE;
  const sDay = usePop(0, 9);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.ink, color: C.yellow, fontFamily: FONT, fontWeight: 900, fontSize: 110, padding: "6px 50px", borderRadius: 28, scale: String(sDay), letterSpacing: -2 }}>DAY {day}</div>
      </div>
      <Svg>
        <Ground />
        <rect x={420 - bw / 2} y={GROUND_Y - hM} width={bw} height={hM} fill={C.red} stroke={C.ink} strokeWidth={8} />
        <rect x={880 - bw / 2} y={GROUND_Y - hJ} width={bw} height={hJ} fill={C.green} stroke={C.ink} strokeWidth={8} />
        <text x={420} y={GROUND_Y - hM - 26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={C.red}>$1,000,000</text>
        <text x={ahead ? 820 : 880} y={GROUND_Y - hJ - 26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={ahead ? 62 : 58} fill={C.green}>{fmt(jv)}</text>
        <Stickman x={190} y={GROUND_Y} pose={POSES[p.mike[0]]} color={mike.color} name={mike.name} scale={0.95} mood={mikeMood} />
        <Stickman x={650} y={GROUND_Y} pose={POSES[p.jake[0]]} color={jake.color} name={jake.name} scale={0.95} mood={p.jake[1] as Mood} />
        {p.rain &&
          Array.from({ length: 16 }).map((_, i) => {
            const t = frame - tVal - (i * 5) % 22;
            if (t < 0) return null;
            return <Bill key={i} x={(i * 197) % 1060 + 10} y={-80 + t * 24} rot={t * (i % 2 ? 8 : -7)} />;
          })}
      </Svg>
      {p.mikeSays && <Tag x={150} y={470} at={tSays} text={p.mikeSays} bg={C.yellow} color={C.ink} size={56} rotate={-8} />}
      {p.stamp && <Stamp x={330} y={470} at={tStamp} text={p.stamp} color={C.green} />}
      {Array.from({ length: p.toDay - p.fromDay }).map((_, i) => {
        const at = Math.round(2 + ((i + 1) / (p.toDay - p.fromDay)) * (Math.max(8, tVal + 6) - 2));
        return <Sfx key={i} at={at} name="coin" volume={0.35} />;
      })}
      <Sfx at={0} name="whoosh" volume={0.5} />
      {p.stamp && <Sfx at={tStamp} name="thud" />}
      {p.rain && <Sfx at={tVal} name="ding" volume={0.9} />}
    </AbsoluteFill>
  );
};

export const SCENES3: Record<string, React.FC<SceneProps>> = {
  choiceHook: ChoiceHook,
  pick: Pick,
  doubling: Doubling,
};

void Title;
