import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, GROUND_Y } from "./theme";
import { POSES, Stickman } from "./components/Stickman";
import { Bill } from "./components/Objects";
import { ease, Tag, Title, usePop } from "./components/ui";
import { Ground, moodAt, Sfx, Svg, usePoseTrack, useWords } from "./scenes";
import type { SceneProps } from "./types";

export const House: React.FC<{ x: number; y: number; color: string; sign?: string; s?: number }> = ({ x, y, color, sign, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={200} ry={14} fill="rgba(0,0,0,0.12)" />
    <rect x={-160} y={-250} width={320} height={250} fill={color} stroke={C.ink} strokeWidth={9} />
    <path d="M-195,-245 L0,-400 L195,-245 Z" fill="#8B5A2B" stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
    <rect x={-35} y={-120} width={70} height={120} fill="#6B4423" stroke={C.ink} strokeWidth={7} />
    <rect x={-130} y={-200} width={70} height={60} fill="#BFE3FF" stroke={C.ink} strokeWidth={7} />
    <rect x={60} y={-200} width={70} height={60} fill="#BFE3FF" stroke={C.ink} strokeWidth={7} />
    {sign && (
      <g transform="translate(110,-40)">
        <line x1={0} y1={40} x2={0} y2={-30} stroke={C.ink} strokeWidth={8} />
        <rect x={-62} y={-80} width={124} height={50} rx={6} fill="#fff" stroke={C.ink} strokeWidth={6} />
        <text y={-45} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={C.ink}>
          {sign}
        </text>
      </g>
    )}
  </g>
);

const Trash: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse cx={0} cy={4} rx={110} ry={12} fill="rgba(0,0,0,0.12)" />
    <path d="M-85,-230 L85,-230 L70,0 L-70,0 Z" fill="#9AA0A6" stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
    <rect x={-100} y={-262} width={200} height={32} rx={8} fill="#7C8288" stroke={C.ink} strokeWidth={8} />
    {[-40, 0, 40].map((dx) => (
      <line key={dx} x1={dx} y1={-200} x2={dx * 0.85} y2={-30} stroke={C.ink} strokeWidth={6} opacity={0.5} />
    ))}
  </g>
);

// Frame 1: the myth + a stickman throwing cash into the trash
const RentHook: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const tMath = w(scene.props.mathWord, 110), tParents = w("parents", 60);
  const pose = usePoseTrack([[0, "pointRight"], [tMath, "shrug"]]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 110, color: C.ink, letterSpacing: -3 }}>{scene.props.line1}</div>
        <div style={{ display: "inline-block", marginTop: 10, background: C.red, color: "#fff", fontSize: 62, padding: "8px 30px", borderRadius: 18, border: `7px solid ${C.ink}`, rotate: "-2deg", whiteSpace: "nowrap" }}>{scene.props.line2}</div>
      </div>
      <Svg>
        <Ground />
        <Trash x={790} y={GROUND_Y} />
        {Array.from({ length: 8 }).map((_, i) => {
          const t = ((frame + i * 9) % 36) / 36;
          if (frame >= tMath) return null;
          const x = interpolate(t, [0, 1], [390, 790]);
          const y = interpolate(t, [0, 1], [820, 900]) - Math.sin(t * Math.PI) * 260;
          return <Bill key={i} x={x} y={y} rot={t * 360} s={0.8} />;
        })}
        <Stickman x={300} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.1} mood={moodAt(frame, [[0, "sad"], [tMath, "neutral"]])} />
      </Svg>
      <Tag x={780} y={470} at={tParents} text="- YOUR PARENTS" bg="#fff" color={C.ink} size={44} rotate={4} />
      <Tag x={600} y={580} at={tMath} text="LET'S DO THE MATH" bg={C.yellow} color={C.ink} size={66} rotate={-3} />
      <Sfx at={0} name="whoosh" />
      <Sfx at={8} name="coin" volume={0.4} />
      <Sfx at={tMath} name="ding" />
    </AbsoluteFill>
  );
};

const TwoHouses: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const tL = p.noIntro ? -30 : w(p.leftWord, 10), tR = p.noIntro ? -30 : w(p.rightWord, 80);
  const tB = p.bubble ? w(p.bubbleWord, 30) : 9999;
  const sL = usePop(tL), sR = usePop(tR), sB = usePop(tB, 10);
  const mikePose = usePoseTrack([[0, "idle"], [tL + 6, "cheer"], [p.bubble ? 0 : 9999, "pointRight"]]);
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <g opacity={Math.min(1, sL * 1.2)}>
          <House x={350} y={GROUND_Y} color="#F7C8C8" sign="OWNED" s={0.72 * Math.max(0.01, sL)} />
        </g>
        <g opacity={Math.min(1, sR * 1.2)}>
          <House x={870} y={GROUND_Y} color="#CDEBD7" sign="RENTED" s={0.72 * Math.max(0.01, sR)} />
        </g>
        <Stickman x={110} y={GROUND_Y} pose={mikePose} color={characters.mike.color} name={characters.mike.name} scale={0.85} mood={p.bubble ? "happy" : "happy"} />
        <Stickman x={635} y={GROUND_Y} pose={p.bubble && frame >= tB ? POSES.shrug : POSES.idle} color={characters.jake.color} name={characters.jake.name} scale={0.85} mood="neutral" />
      </Svg>
      <Tag x={290} y={330} at={tL} text={p.leftTag} bg={C.red} size={52} rotate={-3} />
      <Tag x={800} y={330} at={tR} text={p.rightTag} bg={C.green} size={48} rotate={3} />
      {p.bubble && frame >= tB && (
        <div style={{ position: "absolute", left: 540, top: 470, translate: "-50% -50%", scale: String(sB), background: "#fff", border: `7px solid ${C.ink}`, borderRadius: 40, padding: "18px 34px", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink, whiteSpace: "nowrap", boxShadow: `0 10px 0 ${C.ink}` }}>
          {p.bubble}
          <div style={{ position: "absolute", left: 80, bottom: -38, width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: `38px solid ${C.ink}` }} />
        </div>
      )}
      {!p.noIntro && <Sfx at={tL} name="pop" />}
      {!p.noIntro && <Sfx at={tR} name="pop" />}
      {p.bubble && <Sfx at={tB} name="pop" />}
    </AbsoluteFill>
  );
};

type CostItem = { word: string; label: string; pct: number };
const CostStack: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const items = scene.props.items as CostItem[];
  const times = items.map((it, i) => w(it.word, 50 + i * 90));
  const tTotal = w("3%", times[times.length - 1] + 60) + 12;
  const sTotal = usePop(tTotal);
  return (
    <AbsoluteFill>
      <Title text={scene.props.title} at={0} y={200} size={96} />
      {items.map((it, i) => {
        const y = 380 + i * 150;
        const k = ease(frame, times[i], times[i] + 12, 0, 1);
        if (frame < times[i]) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 70, right: 70, top: y, fontFamily: FONT, fontWeight: 900, opacity: Math.min(1, k * 2) }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 44, color: C.ink }}>
              <span>{it.label}</span>
              <span style={{ color: C.red }}>{it.pct}%</span>
            </div>
            <div style={{ height: 40, marginTop: 10, background: "#fff", border: `6px solid ${C.ink}`, borderRadius: 20, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(it.pct / 3) * 100 * k}%`, background: C.red }} />
            </div>
          </div>
        );
      })}
      {frame >= tTotal && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.ink, color: C.yellow, fontFamily: FONT, fontWeight: 900, fontSize: 84, padding: "10px 44px", borderRadius: 24, scale: String(sTotal), rotate: "-2deg" }}>{scene.props.totalLabel}</div>
        </div>
      )}
      <Svg>
        <Stickman x={160} y={GROUND_Y + 10} pose={POSES.facepalm} color={ch.color} name={ch.name} scale={0.6} mood="sad" />
      </Svg>
      {times.map((t, i) => (
        <Sfx key={i} at={t} name="pop" />
      ))}
      <Sfx at={tTotal} name="thud" />
    </AbsoluteFill>
  );
};

const Bookmark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 40 52" style={{ verticalAlign: "middle" }}>
    <path d="M4,4 L36,4 L36,48 L20,36 L4,48 Z" fill={C.yellow} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

const Formula: React.FC<SceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const parts = p.parts as [string, string, number?][];
  const times = parts.map(([, m, n], i) => w(m, 20 + i * 30, n ?? 0));
  const tRes = w(p.resultWord, times[times.length - 1] + 30);
  const tNote = p.noteWord ? w(p.noteWord, tRes + 30) : tRes + 20;
  const sRes = usePop(tRes, 9), sNote = usePop(tNote);
  const sTitle = usePop(0);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 92, color: C.ink, scale: String(sTitle) }}>
        {p.save && <Bookmark size={70} />} {p.title}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, fontFamily: FONT, fontWeight: 900 }}>
        {parts.map(([label], i) => (
          <PopLine key={i} at={times[i]} text={label} />
        ))}
        <div style={{ width: ease(frame, tRes - 6, tRes, 0, 640), height: 10, background: C.ink, borderRadius: 5, marginTop: 6 }} />
        <div style={{ minHeight: 140 }}>
          {frame >= tRes && (
            <div style={{ background: p.save ? C.yellow : C.red, color: p.save ? C.ink : "#fff", fontSize: 104, padding: "6px 40px", borderRadius: 24, border: `8px solid ${C.ink}`, scale: String(sRes), letterSpacing: -2, whiteSpace: "nowrap" }}>
              {p.result}
            </div>
          )}
        </div>
      </div>
      {frame >= tNote && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center" }}>
          <div style={{ scale: String(sNote), background: p.save ? C.green : C.ink, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 54, padding: "8px 30px", borderRadius: 16, rotate: "2deg" }}>{p.note}</div>
        </div>
      )}
      {times.map((t, i) => (
        <Sfx key={i} at={t} name="pop" />
      ))}
      <Sfx at={tRes} name={p.save ? "ding" : "thud"} />
    </AbsoluteFill>
  );
};

const PopLine: React.FC<{ at: number; text: string }> = ({ at, text }) => {
  const frame = useCurrentFrame();
  const s = usePop(at);
  return (
    <div style={{ fontSize: Math.min(96, Math.floor(900 / (text.length * 0.7))), color: C.ink, scale: String(s), opacity: frame >= at ? 1 : 0, letterSpacing: -2, lineHeight: 1.05, whiteSpace: "nowrap" }}>{text}</div>
  );
};

const Fork: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const ch = characters[p.who];
  const tA = w(p.aWord, 90), tB = w(p.bWord, 180);
  const sA = usePop(tA + 8), sB = usePop(tB + 8);
  const drawA = ease(frame, tA, tA + 10, 0, 1), drawB = ease(frame, tB, tB + 10, 0, 1);
  const Box: React.FC<{ x: number; top: string; res: string; color: string; s: number }> = ({ x, top, res, color, s }) => (
    <div style={{ position: "absolute", left: x, top: 560, translate: "-50% 0", scale: String(s), width: 440, textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
      <div style={{ background: "#fff", border: `7px solid ${C.ink}`, borderRadius: 18, padding: "14px 10px", fontSize: 46, color: C.ink }}>{top}</div>
      <div style={{ marginTop: 18, background: color, border: `7px solid ${C.ink}`, borderRadius: 18, padding: "14px 10px", fontSize: 50, color: "#fff", boxShadow: `0 10px 0 ${C.ink}` }}>{res}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Title text={p.title} at={0} y={200} size={110} color={C.red} />
      <Svg>
        <path d={`M540,350 Q540,${430} ${540 - 270 * drawA},${430 + 110 * drawA}`} fill="none" stroke={C.ink} strokeWidth={10} strokeLinecap="round" opacity={drawA > 0 ? 1 : 0} />
        <path d={`M540,350 Q540,${430} ${540 + 270 * drawB},${430 + 110 * drawB}`} fill="none" stroke={C.ink} strokeWidth={10} strokeLinecap="round" opacity={drawB > 0 ? 1 : 0} />
        <Ground />
        <Stickman x={540} y={GROUND_Y} pose={usePoseTrack([[0, "idle"], [tA, "pointLeft"], [tB, "pointRight"]])} color={ch.color} name={ch.name} scale={0.8} mood={moodAt(frame, [[0, "neutral"], [tA, "happy"], [tB, "shock"]])} />
      </Svg>
      {frame >= tA + 8 && <Box x={270} top={p.a} res={p.aResult} color={C.green} s={sA} />}
      {frame >= tB + 8 && <Box x={810} top={p.b} res={p.bResult} color={C.red} s={sB} />}
      <Sfx at={0} name="thud" />
      <Sfx at={tA + 8} name="ding" />
      <Sfx at={tB + 8} name="thud" />
    </AbsoluteFill>
  );
};

export const SCENES6: Record<string, React.FC<SceneProps>> = {
  rentHook: RentHook,
  twoHouses: TwoHouses,
  costStack: CostStack,
  formula: Formula,
  fork: Fork,
};
