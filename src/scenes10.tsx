import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, GROUND_Y } from "./theme";
import { Stickman } from "./components/Stickman";
import { Bill } from "./components/Objects";
import { ease, Stamp, Tag, usePop } from "./components/ui";
import { Ground, moodAt, Sfx, Svg, usePoseTrack, useWords } from "./scenes";
import type { SceneProps } from "./types";

export const Bank: React.FC<{ x: number; y: number; s?: number; doorOpen?: number; label?: string }> = ({ x, y, s = 1, doorOpen = 1, label = "BANK" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={300} ry={18} fill="rgba(0,0,0,0.12)" />
    <rect x={-270} y={-40} width={540} height={40} fill="#E8E2D6" stroke={C.ink} strokeWidth={8} />
    <rect x={-240} y={-80} width={480} height={40} fill="#F2EDE3" stroke={C.ink} strokeWidth={8} />
    {[-180, -90, 90, 180].map((cx) => (
      <rect key={cx} x={cx - 24} y={-330} width={48} height={250} fill="#fff" stroke={C.ink} strokeWidth={8} />
    ))}
    <rect x={-60} y={-250} width={120} height={170} fill="#3A2A20" stroke={C.ink} strokeWidth={8} />
    <rect x={-60} y={-250} width={120 * (1 - doorOpen * 0.85)} height={170} fill="#8B5A2B" stroke={C.ink} strokeWidth={8} />
    <rect x={-250} y={-370} width={500} height={44} fill="#F2EDE3" stroke={C.ink} strokeWidth={8} />
    <path d="M-270,-370 L0,-500 L270,-370 Z" fill="#F7F3EA" stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
    <text y={-395} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={label.length > 6 ? 30 : 50} fill={C.ink}>
      {label}
    </text>
    <circle cx={0} cy={-445} r={20} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
  </g>
);

// Frame 1: bank + bold claim
const BankHook: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const tEmpty = w(p.emptyWord, 15), tWhat = w(p.whatWord, 70);
  const s = usePop(-30);
  const mike = characters.mike;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: FONT, fontWeight: 900, scale: String(s) }}>
        <div style={{ fontSize: 104, color: C.ink, letterSpacing: -3 }}>{p.line1}</div>
        <div style={{ display: "inline-block", marginTop: 10, background: C.red, color: "#fff", fontSize: 74, padding: "6px 34px", borderRadius: 20, border: `8px solid ${C.ink}`, rotate: "-2deg", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>{p.line2}</div>
      </div>
      <Svg>
        <Ground />
        <Bank x={650} y={GROUND_Y} s={0.95} doorOpen={1} />
        {frame >= tEmpty &&
          Array.from({ length: 6 }).map((_, i) => {
            const t = ((frame - tEmpty + i * 7) % 40) / 40;
            return <Bill key={i} x={interpolate(t, [0, 1], [650, 1150])} y={interpolate(t, [0, 1], [GROUND_Y - 160, 560]) - Math.sin(t * Math.PI) * 120} rot={t * 400} s={0.7} />;
          })}
        <Stickman x={190} y={GROUND_Y} pose={usePoseTrack([[0, "pointRight"], [tEmpty, "facepalm"]])} color={mike.color} name={mike.name} scale={0.9} mood={moodAt(frame, [[0, "neutral"], [tEmpty, "shock"]])} />
      </Svg>
      <Tag x={600} y={590} at={tWhat} text="HERE'S WHAT HAPPENS" bg={C.yellow} color={C.ink} size={46} rotate={4} />
      <Sfx at={0} name="thud" />
      <Sfx at={tEmpty} name="whoosh" />
      <Sfx at={tWhat} name="pop" />
    </AbsoluteFill>
  );
};

type Step = { word: string; label: string; amount: string; color: string; acc?: number };
const LendChain: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const steps = scene.props.steps as Step[];
  const times = steps.map((s, i) => w(s.word, 20 + i * 60, s.word === "deposits" && i > 0 ? 1 : 0));
  let acc = 0;
  steps.forEach((s, i) => {
    if (s.acc && frame >= times[i]) acc = s.acc;
  });
  const pos = steps.map((_, i) => ({ x: i % 2 ? 730 : 350, y: 470 + i * 150 }));
  const lastAcc = times.filter((t, i) => steps[i].acc && frame >= t).slice(-1)[0] ?? 0;
  const accPop = usePop(lastAcc, 9);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 180, textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 46, color: "#7A5A60" }}>MONEY IN ACCOUNTS</div>
        <div style={{ fontSize: 130, color: C.green, letterSpacing: -4, scale: String(acc ? 0.9 + 0.1 * accPop : 1) }}>{acc ? `$${acc.toLocaleString("en-US")}` : "$0"}</div>
      </div>
      <Svg>
        {pos.slice(1).map((p2, i) => {
          if (frame < times[i + 1]) return null;
          const p1 = pos[i];
          const k = ease(frame, times[i + 1] - 6, times[i + 1] + 2, 0, 1);
          return <line key={i} x1={p1.x} y1={p1.y + 40} x2={p1.x + (p2.x - p1.x) * k} y2={p1.y + 40 + (p2.y - p1.y - 40) * k} stroke={C.ink} strokeWidth={8} strokeDasharray="18 14" strokeLinecap="round" />;
        })}
      </Svg>
      {steps.map((s, i) => (
        <ChainCard key={i} x={pos[i].x} y={pos[i].y} at={times[i]} label={s.label} amount={s.amount} color={s.color} />
      ))}
      {times.map((t, i) => (
        <Sfx key={i} at={t} name={steps[i].acc ? "coin" : "pop"} />
      ))}
    </AbsoluteFill>
  );
};

const ChainCard: React.FC<{ x: number; y: number; at: number; label: string; amount: string; color: string }> = ({ x, y, at, label, amount, color }) => {
  const s = usePop(at);
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(s), display: "flex", alignItems: "center", gap: 18, background: "#fff", border: `7px solid ${C.ink}`, borderRadius: 24, padding: "12px 24px", boxShadow: `0 10px 0 ${C.ink}`, fontFamily: FONT, fontWeight: 900, whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 34, color: C.ink }}>{label}</span>
      <span style={{ fontSize: 48, color: "#fff", background: color, borderRadius: 14, padding: "2px 16px" }}>{amount}</span>
    </div>
  );
};

const BankRun: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const tDate = w(p.dateWord, 80), tAmt = w(p.amountWord, 200), tDay = w(p.dayWord, 250), tShut = w(p.shutWord, 320), tOnce = w("once", 50);
  const billions = ease(frame, tAmt - 6, tAmt + 18, 0, 42);
  const runX = (i: number) => {
    const start = -120 - i * 110;
    return Math.min(interpolate(frame, [tOnce, tShut], [start, 640 - i * 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), 640 - i * 70);
  };
  const colors = ["#E5484D", "#2E8B57", "#3B82F6", "#F59E0B", "#8B5CF6", "#6B7280"];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 180, textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 44, color: "#7A5A60" }}>WITHDRAWALS IN ONE DAY</div>
        <div style={{ fontSize: 150, color: C.red, letterSpacing: -4 }}>${billions.toFixed(0)} BILLION</div>
      </div>
      <Svg>
        <Ground />
        <Bank x={850} y={GROUND_Y} s={0.75} doorOpen={frame >= tShut ? 0 : 1} label="SVB" />
        {colors.map((c, i) => (
          <Stickman key={i} x={runX(i)} y={GROUND_Y} pose={{ la: [0, 0], ra: [0, 0], ll: [0, 0], rl: [0, 0], lean: 0, head: 0 }} walking color={c} scale={0.75} mood={frame >= tShut ? "shock" : "neutral"} />
        ))}
      </Svg>
      <Tag x={250} y={650} at={tDate} text={p.date} bg={C.ink} color={C.yellow} size={52} rotate={-3} />
      <Tag x={540} y={455} at={tDay} text="IN A SINGLE DAY" bg={C.yellow} color={C.ink} size={48} rotate={2} />
      <Stamp x={820} y={640} at={tShut} text="CLOSED" size={100} />
      <Sfx at={tOnce} name="whoosh" />
      <Sfx at={tDate} name="pop" />
      <Sfx at={tAmt + 18} name="ding" />
      <Sfx at={tShut} name="thud" volume={0.9} />
    </AbsoluteFill>
  );
};

export const SCENES10: Record<string, React.FC<SceneProps>> = {
  bankHook: BankHook,
  lendChain: LendChain,
  bankRun: BankRun,
};
