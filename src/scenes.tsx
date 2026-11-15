import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { C, FONT, GROUND_Y } from "./theme";
import { mixPose, Mood, Pose, POSES, Stickman } from "./components/Stickman";
import { Bill, Car, Coin, Jar, Wallet } from "./components/Objects";
import { SCENES2 } from "./scenes2";
import { SCENES3 } from "./scenes3";
import { SCENES4 } from "./scenes4";
import { SCENES5 } from "./scenes5";
import { ease, money, Stamp, Tag, Title, usePop, wordFrame } from "./components/ui";
import type { SceneProps } from "./types";

// ---------- helpers ----------
export const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 0.6 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={30} layout="none">
    <Audio src={staticFile(`sfx/${name}.mp3`)} volume={volume} />
  </Sequence>
);

export const usePoseTrack = (track: [number, keyof typeof POSES | Pose][]): Pose => {
  const frame = useCurrentFrame();
  const get = (p: keyof typeof POSES | Pose) => (typeof p === "string" ? POSES[p] : p);
  let pose = get(track[0][1]);
  for (let i = 1; i < track.length; i++) {
    const [at, p] = track[i];
    if (frame >= at) pose = mixPose(pose, get(p), ease(frame, at, at + 6, 0, 1));
  }
  return pose;
};

export const moodAt = (frame: number, track: [number, Mood][]): Mood => {
  let m = track[0][1];
  for (const [at, mood] of track) if (frame >= at) m = mood;
  return m;
};

export const useWords = (scene: SceneProps["scene"]) => {
  const { fps } = useVideoConfig();
  return (m: string, fallback = 0, nth = 0) => wordFrame(scene.words, m, fps, fallback, nth);
};

export const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

export const Ground = () => <line x1={-50} x2={1130} y1={GROUND_Y + 6} y2={GROUND_Y + 6} stroke={C.ink} strokeWidth={6} opacity={0.15} />;

// ---------- scenes ----------
const Hook: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const { left, right, title, leftValue, rightValue } = scene.props;
  const L = characters[left], R = characters[right];
  const tRight = w("$91", 70), tLeft = w("used", 110);
  const lPose = usePoseTrack([[0, "wave"], [12, "idle"], [tLeft, "sad"]]);
  const rPose = usePoseTrack([[0, "idle"], [tRight, "cheer"]]);
  const s1 = usePop(2), s2 = usePop(8), sCar = usePop(tLeft);
  return (
    <AbsoluteFill>
      <Title text={title} at={0} y={230} />
      <Svg>
        <Ground />
        <g opacity={s1}>
          <Stickman x={300} y={GROUND_Y} pose={lPose} mood={moodAt(frame, [[0, "happy"], [tLeft, "sad"]])} color={L.color} name={L.name} scale={1.25 * s1} />
        </g>
        <g opacity={s2}>
          <Stickman x={780} y={GROUND_Y} pose={rPose} mood={moodAt(frame, [[0, "happy"], [tRight, "smug"]])} color={R.color} name={R.name} scale={1.25 * s2} />
        </g>
        {frame >= tLeft && <Car x={300} y={GROUND_Y + 40} scale={0.55 * sCar} old />}
      </Svg>
      {frame < tLeft && <Tag x={300} y={430} at={4} text="$4,000/mo" size={50} bg="#fff" color={C.ink} />}
      {frame < tRight && <Tag x={780} y={430} at={10} text="$4,000/mo" size={50} bg="#fff" color={C.ink} />}
      <Tag x={780} y={430} at={tRight} text={rightValue} bg={C.green} size={80} rotate={4} />
      <Tag x={300} y={430} at={tLeft} text={leftValue} bg={C.red} size={60} rotate={-4} />
      <Sfx at={tRight} name="ding" />
      <Sfx at={tLeft} name="thud" />
    </AbsoluteFill>
  );
};

const BuyCar: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const tBuy = w("buys", 50), tPrice = w("$650", 110), tSix = w("six", 150);
  const carX = interpolate(frame, [tBuy, tBuy + 18], [1400, 690], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const pose = usePoseTrack([[0, "idle"], [w("paycheck", 25), "cheer"], [tBuy + 18, "pointRight"]]);
  const billY = ease(frame, 0, 14, -200, 600);
  return (
    <AbsoluteFill>
      <Title text="PAYDAY" at={0} y={230} color={C.green} />
      <Svg>
        <Ground />
        <Car x={carX} y={GROUND_Y} scale={0.95} color={ch.color} driving={frame < tBuy + 18} />
        <Stickman x={250} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.2} mood={moodAt(frame, [[0, "happy"], [tPrice, "shock"], [tPrice + 25, "happy"]])} />
        {frame < tBuy && <Bill x={250} y={billY} rot={frame * 8} s={1.4} />}
      </Svg>
      <Tag x={690} y={560} at={tPrice} text={scene.props.tag} bg={C.red} size={88} rotate={-5} />
      <Tag x={690} y={700} at={tSix} text={scene.props.sub} bg="#fff" color={C.ink} size={56} rotate={3} />
      <Sfx at={0} name="coin" />
      <Sfx at={tBuy} name="whoosh" />
      <Sfx at={tPrice} name="thud" />
      <Sfx at={tSix} name="pop" />
    </AbsoluteFill>
  );
};

const Invest: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const tInstead = w("instead", 45), tBoring = w("boring", 140), tTot = w("totally", tBoring + 20);
  const pose = usePoseTrack([[0, "idle"], [tInstead, "present"], [tBoring, "shrug"], [tTot, "idle"]]);
  const dropEvery = 16;
  const drops = Array.from({ length: 14 }, (_, i) => tInstead + 10 + i * dropEvery);
  const fill = drops.filter((d) => frame > d + 14).length / 16;
  const oldCarOut = ease(frame, tInstead - 6, tInstead + 6, 0, -700);
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <g transform={`translate(${oldCarOut},0)`}>
          <Car x={700} y={GROUND_Y} scale={0.85} old />
        </g>
        {frame >= tInstead && <Jar x={720} y={GROUND_Y} fill={fill} label="INDEX" />}
        {drops.map((d, i) => {
          const t = frame - d;
          if (t < 0 || t > 14) return null;
          return <Coin key={i} x={720 + (i % 2 ? 20 : -20)} y={ease(frame, d, d + 14, 330, 900)} spin={t / 2} />;
        })}
        <Stickman x={300} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.2} mood={moodAt(frame, [[0, "neutral"], [tInstead, "happy"], [tBoring, "neutral"], [tTot, "smug"]])} />
      </Svg>
      <Title text={scene.props.tag} at={tInstead} y={230} color={C.green} />
      <Stamp x={590} y={470} at={tBoring} text={scene.props.stamp} />
      {drops.filter((_, i) => i % 3 === 0).map((d, i) => (
        <Sfx key={i} at={d + 12} name="coin" volume={0.3} />
      ))}
      <Sfx at={tInstead} name="whoosh" />
      <Sfx at={tBoring} name="thud" />
    </AbsoluteFill>
  );
};

const TimeSkip: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { from, to, label } = scene.props;
  const year = Math.round(ease(frame, 4, Math.min(durationInFrames - 8, 40), from, to));
  return (
    <AbsoluteFill style={{ background: C.ink, justifyContent: "center", alignItems: "center" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(540,760)">
          <circle r={250} fill="none" stroke="#333" strokeWidth={20} />
          <line x1={0} y1={0} x2={0} y2={-180} stroke={C.yellow} strokeWidth={16} strokeLinecap="round" transform={`rotate(${frame * 40})`} />
          <line x1={0} y1={0} x2={0} y2={-120} stroke="#fff" strokeWidth={20} strokeLinecap="round" transform={`rotate(${frame * 4})`} />
          <circle r={18} fill="#fff" />
        </g>
      </svg>
      <div style={{ position: "absolute", top: 1060, fontFamily: FONT, fontWeight: 900, fontSize: 200, color: "#fff", letterSpacing: -4 }}>{year}</div>
      <div style={{ position: "absolute", top: 300, fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.yellow, scale: String(usePop(0)) }}>{label}</div>
      <Sfx at={0} name="whoosh" volume={0.8} />
    </AbsoluteFill>
  );
};

const CarResult: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const tWorth = w("worth", 20), tGas = w("gas", 120), tRep = w("repairs", 140);
  const val = ease(frame, tWorth, tWorth + 30, scene.props.from, scene.props.to);
  const pose = usePoseTrack([[0, "idle"], [tWorth + 20, "sad"], [tGas, "facepalm"]]);
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <Car x={680} y={GROUND_Y} scale={0.9} old />
        <Stickman x={250} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.2} mood={moodAt(frame, [[0, "neutral"], [tWorth + 20, "sad"]])} />
      </Svg>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 56, color: C.gray }}>CAR VALUE</div>
        <div style={{ fontSize: 150, color: C.red, letterSpacing: -4 }}>{money(val)}</div>
      </div>
      <Tag x={540} y={640} at={tGas} text="- GAS" bg={C.red} size={60} rotate={-6} />
      <Tag x={800} y={560} at={tRep} text="- REPAIRS" bg={C.red} size={60} rotate={5} />
      <Sfx at={tWorth} name="whoosh" />
      <Sfx at={tWorth + 30} name="thud" />
      <Sfx at={tGas} name="pop" />
      <Sfx at={tRep} name="pop" />
    </AbsoluteFill>
  );
};

const InvestResult: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const { endWord = "$91", rateWord = "8%", startWord, label = "JAKE'S FUND", rateLabel = "~8% / year" } = scene.props;
  const tEnd0 = w(endWord, 60);
  const t8 = w(rateWord, 60), tGrew = startWord ? w(startWord, 110) : Math.max(10, tEnd0 - 20), tEnd = w(endWord, tGrew + 20);
  const val = ease(frame, tGrew - 10, tEnd + 18, 0, scene.props.to);
  const pose = usePoseTrack([[0, "idle"], [t8, "pointUp"], [tEnd + 10, "cheer"]]);
  // growth curve
  const pts = Array.from({ length: 41 }, (_, i) => {
    const x = i / 40;
    return [120 + x * 840, 1000 - (Math.pow(1.08, x * 10) - 1) / (Math.pow(1.08, 10) - 1) * 500] as const;
  });
  const prog = ease(frame, tGrew - 10, tEnd + 18, 0, 1);
  const shown = pts.slice(0, Math.max(2, Math.round(prog * 40) + 1));
  const rain = frame > tEnd + 10;
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <polyline points={shown.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.green} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
        <circle cx={shown[shown.length - 1][0]} cy={shown[shown.length - 1][1]} r={20} fill={C.green} stroke={C.ink} strokeWidth={6} />
        <Stickman x={300} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.2} mood={moodAt(frame, [[0, "smug"], [tEnd, "happy"]])} />
        {rain &&
          Array.from({ length: 14 }).map((_, i) => {
            const t = frame - tEnd - 10 - (i % 5) * 4;
            if (t < 0) return null;
            return <Bill key={i} x={(i * 173) % 1080} y={-80 + t * (16 + (i % 3) * 3)} rot={t * (i % 2 ? 7 : -6)} />;
          })}
      </Svg>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 56, color: C.gray }}>{label}</div>
        <div style={{ fontSize: Math.min(160, Math.floor(1000 / (money(scene.props.to).length * 0.68))), color: C.green, letterSpacing: -4, scale: String(frame > tEnd + 18 ? 1 + 0.06 * Math.sin((frame - tEnd) / 3) : 1) }}>{money(val)}</div>
      </div>
      {rateLabel ? <Tag x={760} y={1060} at={t8} text={rateLabel} bg="#fff" color={C.ink} size={52} /> : null}
      <Sfx at={tGrew - 10} name="whoosh" />
      <Sfx at={tEnd + 18} name="ding" volume={0.8} />
    </AbsoluteFill>
  );
};

const fitSize = (t: string) => Math.min(110, Math.floor(540 / (t.length * 0.66)));

const Breakdown: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const [a, b] = scene.props.parts as { label: string; value: number; color: string }[];
  const tA = w(scene.props.aWord ?? "$60", 15), tB = w(scene.props.bWord ?? "market", 60);
  const total = a.value + b.value;
  const sB = usePop(tB);
  const H = 820, base = GROUND_Y, bx = 640, bw = 280;
  const hA = ease(frame, tA, tA + 15, 0, (a.value / total) * H);
  const hB = ease(frame, tB, tB + 15, 0, (b.value / total) * H);
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <rect x={bx} y={base - hA} width={bw} height={hA} fill={a.color} stroke={C.ink} strokeWidth={8} />
        <rect x={bx} y={base - hA - hB} width={bw} height={hB} fill={b.color} stroke={C.ink} strokeWidth={8} />
      </Svg>
      {frame >= tA && (
        <div style={{ position: "absolute", left: 80, top: base - hA / 2 - 80, width: 520, textAlign: "right", fontFamily: FONT, fontWeight: 900 }}>
          <div style={{ fontSize: 46, color: C.gray }}>{a.label}</div>
          <div style={{ fontSize: fitSize(money(a.value)), color: a.color, letterSpacing: -3 }}>{money(a.value)}</div>
        </div>
      )}
      {frame >= tB && (
        <div style={{ position: "absolute", left: 80, top: base - hA - hB / 2 - 80, width: 520, textAlign: "right", fontFamily: FONT, fontWeight: 900, scale: String(sB) }}>
          <div style={{ fontSize: 46, color: C.gray }}>{b.label}</div>
          <div style={{ fontSize: fitSize("+" + money(b.value)), color: b.color, letterSpacing: -3 }}>{scene.props.noPlus ? "" : "+"}{money(b.value)}</div>
        </div>
      )}
      <Sfx at={tA} name="pop" />
      <Sfx at={tB} name="ding" />
    </AbsoluteFill>
  );
};

const Lesson: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const tPay = w(scene.props.switchWord ?? "pay", 70, scene.props.switchNth ?? 0);
  const line2Size = Math.min(150, Math.floor(820 / (String(scene.props.line2).length * 0.75)));
  const pose = usePoseTrack([[0, "idle"], [tPay, "pointUp"]]);
  const vsOut = ease(frame, tPay - 4, tPay + 4, 1, 0);
  const chars = Object.values(characters);
  const sLine2 = usePop(tPay + 8);
  return (
    <AbsoluteFill>
      {frame < tPay + 4 && scene.props.vs === "curve" && (
        <div style={{ position: "absolute", inset: 0, opacity: vsOut }}>
          <CurveExplainer words={scene.words} />
        </div>
      )}
      {frame < tPay + 4 && scene.props.vs !== "curve" && (
        <div style={{ position: "absolute", inset: 0, opacity: vsOut }}>
          <Svg>
            {scene.props.vs === "wallet" ? <Wallet x={290} y={760} scale={0.8} /> : <Car x={290} y={760} scale={0.55} color={chars[0].color} />}
            <Jar x={790} y={800} fill={0.85} />
            <Stickman x={290} y={GROUND_Y} pose={POSES.idle} color={chars[0].color} name={chars[0].name} />
            <Stickman x={790} y={GROUND_Y} pose={POSES.idle} color={chars[1].color} name={chars[1].name} mood="happy" />
          </Svg>
          <Title text="VS" at={w("different", 30)} y={700} color={C.red} size={140} />
        </div>
      )}
      {frame >= tPay && (
        <>
          <Title text={scene.props.line1} at={tPay} y={220} size={Math.min(120, Math.floor(940 / (String(scene.props.line1).length * 0.72)))} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center" }}>
            <div style={{ background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 24, padding: "10px 50px", fontFamily: FONT, fontWeight: 900, fontSize: line2Size, color: C.ink, rotate: "-3deg", whiteSpace: "nowrap", scale: String(sLine2) }}>
              {scene.props.line2}
            </div>
          </div>
          <Svg>
            <Ground />
            <Stickman x={540} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.25} mood="happy" />
          </Svg>
        </>
      )}
      <Sfx at={tPay} name="whoosh" />
      <Sfx at={tPay + 8} name="thud" />
    </AbsoluteFill>
  );
};

const CurveExplainer: React.FC<{ words: SceneProps["scene"]["words"] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (m: string, f: number) => wordFrame(words, m, fps, f);
  const tSlow = at("slow", 30), tBor = at("boring", 60), tSud = at("sudden", 85);
  const prog = ease(frame, 4, tSud + 10, 0, 1);
  const N = 60;
  const pts = Array.from({ length: Math.max(2, Math.round(prog * N) + 1) }, (_, i) => {
    const x = i / N;
    return [140 + x * 800, 1050 - (Math.pow(2, x * 12) - 1) / (Math.pow(2, 12) - 1) * 700];
  });
  const last = pts[pts.length - 1];
  return (
    <>
      <Title text="COMPOUNDING" at={0} y={220} size={110} color="#2E8B57" />
      <Svg>
        <line x1={140} y1={1050} x2={960} y2={1050} stroke={C.ink} strokeWidth={8} />
        <line x1={140} y1={1050} x2={140} y2={330} stroke={C.ink} strokeWidth={8} />
        <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.green} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last[0]} cy={last[1]} r={22} fill={C.green} stroke={C.ink} strokeWidth={6} />
      </Svg>
      <Tag x={330} y={960} at={tSlow} text="SLOW" bg="#fff" color={C.ink} size={56} />
      <Tag x={620} y={890} at={tBor} text="BORING" bg="#fff" color={C.ink} size={56} rotate={-3} />
      <Tag x={720} y={420} at={tSud} text="SUDDEN!" bg={C.green} size={76} rotate={-6} />
      <Sfx at={tSlow} name="pop" />
      <Sfx at={tBor} name="pop" />
      <Sfx at={tSud} name="ding" />
    </>
  );
};

const Cta: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const ch = characters[scene.props.who];
  const pulse = 1 + 0.06 * Math.sin(frame / 4);
  const press = frame > 30 && frame < 36 ? 0.9 : 1;
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <Stickman x={300} y={GROUND_Y} pose={POSES.wave} waveHand color={ch.color} name={ch.name} scale={1.2} mood="happy" />
      </Svg>
      <div style={{ position: "absolute", left: 680, top: 760, translate: "-50% -50%", scale: String(usePop(4) * pulse * press), background: C.red, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 84, padding: "26px 56px", borderRadius: 60, border: `8px solid ${C.ink}`, boxShadow: `0 12px 0 ${C.ink}` }}>
        {scene.props.button}
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1180, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.gray }}>{scene.props.disclaimer}</div>
      <Sfx at={4} name="pop" />
      <Sfx at={30} name="coin" />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC<SceneProps>> = {
  hook: Hook,
  buyCar: BuyCar,
  invest: Invest,
  timeSkip: TimeSkip,
  carResult: CarResult,
  investResult: InvestResult,
  breakdown: Breakdown,
  lesson: Lesson,
  cta: Cta,
  ...SCENES2,
  ...SCENES3,
  ...SCENES4,
  ...SCENES5,
};
