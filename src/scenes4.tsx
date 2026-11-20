import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, GROUND_Y } from "./theme";
import { Stickman } from "./components/Stickman";
import { Bill } from "./components/Objects";
import { ease, money, Stamp, Tag, Title, usePop } from "./components/ui";
import { Ground, moodAt, Sfx, Svg, usePoseTrack, useWords } from "./scenes";
import type { SceneProps } from "./types";

const Check: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M6,21 L16,31 L35,9" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Bag: React.FC<{ x: number; y: number; color: string; label?: string; s?: number }> = ({ x, y, color, label, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-30,-130 Q-30,-170 0,-170 Q30,-170 30,-130" fill="none" stroke={C.ink} strokeWidth={8} />
    <rect x={-60} y={-130} width={120} height={130} rx={10} fill={color} stroke={C.ink} strokeWidth={8} />
    {label && (
      <text y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">
        {label}
      </text>
    )}
  </g>
);

const CartIcon: React.FC<{ x: number; y: number; fill: number }> = ({ x, y, fill }) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M-230,-330 L-190,-330 L-150,-80 L170,-80 L210,-270 L-170,-270" fill="none" stroke={C.ink} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
    <rect x={-160} y={-270 + (1 - fill) * 180} width={360} height={fill * 180} fill="#FFB4B4" opacity={0.8} />
    <circle cx={-120} cy={-35} r={30} fill={C.ink} />
    <circle cx={150} cy={-35} r={30} fill={C.ink} />
  </g>
);

// Frame 1: BLACK FRIDAY + Mike with bags + "SAVED $800"
const BfHook: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const tLoss = w("$1,200", 100);
  const pose = usePoseTrack([[0, "cheer"], [tLoss, "facepalm"]]);
  const sBanner = usePop(-30);
  const shake = frame >= tLoss && frame < tLoss + 10 ? Math.sin(frame * 3) * 12 : 0;
  return (
    <AbsoluteFill style={{ translate: `${shake}px 0px` }}>
      <div style={{ position: "absolute", left: -20, right: -20, top: 150, height: 230, background: C.ink, rotate: "-3deg", display: "flex", alignItems: "center", justifyContent: "center", scale: String(sBanner) }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 116, color: C.yellow, letterSpacing: -3 }}>BLACK FRIDAY</div>
      </div>
      <Svg>
        <Ground />
        {[["-70%", 150, 520, -14], ["-50%", 920, 560, 12], ["-30%", 880, 980, -8], ["-40%", 170, 960, 10]].map(([t, x, y, r], i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${r as number + Math.sin(frame / 8 + i) * 4})`} opacity={0.9}>
            <path d="M-80,-40 L60,-40 L95,0 L60,40 L-80,40 Z" fill={C.red} stroke={C.ink} strokeWidth={6} />
            <circle cx={60} cy={0} r={8} fill="#fff" />
            <text x={-10} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill="#fff">{t}</text>
          </g>
        ))}
        <Bag x={380} y={GROUND_Y} color={C.red} label="SALE" />
        <Bag x={700} y={GROUND_Y} color={C.blue} label="-70%" s={0.9} />
        <Stickman x={540} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.0} mood={moodAt(frame, [[0, "happy"], [tLoss, "shock"]])} />
      </Svg>
      {frame < tLoss && <Tag x={540} y={510} at={-30} text={scene.props.saved} bg={C.green} size={76} rotate={-3} />}
      <Stamp x={560} y={540} at={tLoss} text={scene.props.loss} />
      <Sfx at={0} name="ding" volume={0.7} />
      <Sfx at={tLoss} name="thud" volume={0.9} />
    </AbsoluteFill>
  );
};

type CartItem = { word: string; label: string; off: string };
const Cart: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const items = scene.props.items as CartItem[];
  const times = items.map((it, i) => w(it.word, 10 + i * 60));
  const tHey = w("hey", 170);
  const n = times.filter((t) => frame >= t + 12).length;
  const pose = usePoseTrack([[0, "pointRight"], [tHey, "cheer"]]);
  return (
    <AbsoluteFill>
      <Title text="ADD TO CART" at={0} y={190} size={100} />
      <Svg>
        <Ground />
        <CartIcon x={720} y={GROUND_Y} fill={n / items.length} />
        <Stickman x={200} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.1} mood="happy" />
        {items.map((_, i) => {
          const t = frame - times[i];
          if (t < 0 || t > 12) return null;
          return <rect key={i} x={680 - 50} y={interpolate(t, [0, 12], [380, 860]) - 40} width={100} height={80} rx={10} fill={C.blue} stroke={C.ink} strokeWidth={6} transform={`rotate(${t * 15}, 680, ${interpolate(t, [0, 12], [380, 860])})`} />;
        })}
      </Svg>
      {items.map((it, i) => {
        const y = 400 + i * 115;
        return (
          <React.Fragment key={`r${i}`}>
            <Tag x={490} y={y} at={times[i]} text={it.label} bg="#fff" color={C.ink} size={52} rotate={i % 2 ? 2 : -2} />
            <Tag x={800} y={y} at={times[i] + 4} text={it.off} bg={C.red} size={i === items.length - 1 ? 64 : 52} rotate={i % 2 ? -4 : 4} />
          </React.Fragment>
        );
      })}
      {items.map((_, i) => (
        <Sfx key={i} at={times[i]} name="pop" />
      ))}
      <Sfx at={tHey} name="ding" />
    </AbsoluteFill>
  );
};

const Receipt: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const lines = scene.props.lines as [string, number, number][];
  const tWas = w("$2,000", 50), tSaved = w("saved", 110);
  const unroll = ease(frame, 0, 18, 0, 1);
  const H = 700 * unroll;
  const pose = usePoseTrack([[0, "idle"], [tSaved - 10, "cheer"]]);
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <Stickman x={190} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.0} mood="happy" />
      </Svg>
      <div style={{ position: "absolute", left: 360, width: 620, top: 200, height: H, overflow: "hidden", background: "#fff", border: `6px solid ${C.ink}`, borderTop: "none", boxShadow: "0 12px 0 rgba(0,0,0,0.12)", fontFamily: FONT, fontWeight: 800, color: C.ink, padding: "0 34px", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", fontSize: 44, fontWeight: 900, marginTop: 26 }}>RECEIPT</div>
        <div style={{ borderTop: `4px dashed ${C.ink}`, margin: "16px 0" }} />
        {lines.map(([name, price, orig], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 38, margin: "14px 0" }}>
            <span>{name}</span>
            <span>
              <span style={{ color: C.gray, textDecoration: "line-through", fontSize: 30, marginRight: 14 }}>{money(orig)}</span>
              {money(price)}
            </span>
          </div>
        ))}
        <div style={{ borderTop: `4px dashed ${C.ink}`, margin: "16px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 56, fontWeight: 900 }}>
          <span>TOTAL</span>
          <span>{money(scene.props.total)}</span>
        </div>
        {frame >= tWas && (
          <div style={{ textAlign: "right", fontSize: 38, color: C.gray, textDecoration: "line-through", marginTop: 6 }}>{money(scene.props.was)}</div>
        )}
      </div>
      <Tag x={670} y={1010} at={tSaved} text={scene.props.saved} bg={C.green} size={64} rotate={-4} />
      <Sfx at={0} name="whoosh" />
      <Sfx at={tWas} name="pop" />
      <Sfx at={tSaved} name="ding" />
    </AbsoluteFill>
  );
};

const Flip: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const tAny = w(scene.props.headerWord ?? "any", 30), tStrike = w(scene.props.strikeWord, 60), tTo = w(scene.props.toWord, 100);
  const strike = ease(frame, tStrike, tStrike + 8, 0, 1);
  const sTo = usePop(tTo, 9);
  const pose = usePoseTrack([[0, "shrug"], [tStrike, "sad"], [tTo, "facepalm"]]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 46, color: C.gray }}>{scene.props.header ?? "PLANNED TO BUY:"}</div>
        <div style={{ fontSize: 80, color: C.ink, scale: String(usePop(tAny)) }}>{frame >= tAny ? scene.props.headerValue ?? "NOTHING" : ""}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 450, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.green, opacity: frame >= tTo ? 0.45 : 1 }}>
          {scene.props.from}
          <div style={{ position: "absolute", left: -20, top: "48%", height: 18, width: `${strike * 110}%`, background: C.red, borderRadius: 9, rotate: "-4deg" }} />
        </div>
      </div>
      {frame >= tTo && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.red, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: Math.min(120, Math.floor(860 / (String(scene.props.to).length * 0.7))), whiteSpace: "nowrap", padding: "6px 40px", borderRadius: 24, border: `8px solid ${C.ink}`, rotate: "-3deg", scale: String(sTo) }}>{scene.props.to}</div>
        </div>
      )}
      <Svg>
        <Ground />
        <Stickman x={540} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={0.8} mood={moodAt(frame, [[0, "neutral"], [tStrike, "sad"]])} />
      </Svg>
      <Sfx at={tAny} name="pop" />
      <Sfx at={tStrike} name="whoosh" />
      <Sfx at={tTo} name="thud" volume={0.9} />
    </AbsoluteFill>
  );
};

const Payments: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const { count, amount, missIndex, fee } = scene.props;
  const tFour = w("four", 70), tMiss = w("missed", 115), tFee = w("fees", 155);
  const pose = usePoseTrack([[0, "idle"], [tFour, "present"], [tMiss, "sad"], [tFee, "facepalm"]]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: FONT, fontWeight: 900, scale: String(usePop(0)) }}>
        <div style={{ fontSize: 96, color: C.ink, letterSpacing: -2, lineHeight: 1 }}>BUY NOW</div>
        <div style={{ fontSize: 96, color: C.red, letterSpacing: -2, lineHeight: 1 }}>PAY LATER</div>
      </div>
      {Array.from({ length: count }).map((_, i) => {
        const at = tFour + i * 5;
        const missed = i === missIndex && frame >= tMiss;
        const done = i < missIndex && frame >= tMiss - 20 + i * 6;
        return (
          <PayBox key={i} x={150 + i * 260} at={at} label={`#${i + 1}`} amount={amount} state={missed ? "missed" : done ? "done" : "due"} />
        );
      })}
      <Tag x={150 + missIndex * 260} y={730} at={tFee} text={fee} bg={C.red} size={46} rotate={-5} />
      <Svg>
        <Ground />
        <Stickman x={230} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={0.9} mood={moodAt(frame, [[0, "happy"], [tMiss, "shock"], [tFee, "sad"]])} />
      </Svg>
      <Sfx at={tFour} name="pop" />
      <Sfx at={tMiss} name="thud" />
      <Sfx at={tFee} name="coin" />
    </AbsoluteFill>
  );
};

const PayBox: React.FC<{ x: number; at: number; label: string; amount: string; state: "due" | "done" | "missed" }> = ({ x, at, label, amount, state }) => {
  const s = usePop(at);
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const bg = state === "missed" ? C.red : state === "done" ? "#DFF5E6" : "#fff";
  return (
    <div style={{ position: "absolute", left: x, top: 560, translate: "-50% -50%", scale: String(s), width: 220, height: 200, background: bg, border: `7px solid ${C.ink}`, borderRadius: 22, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: state === "missed" ? "#fff" : C.ink }}>
      <div style={{ fontSize: 34, opacity: 0.7 }}>{label}</div>
      <div style={{ fontSize: 58 }}>{amount}</div>
      <div style={{ fontSize: 40, height: 44, display: "flex", alignItems: "center" }}>{state === "done" ? <Check size={40} color={C.green} /> : state === "missed" ? "MISSED" : ""}</div>
    </div>
  );
};

const ShoppingList: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const tList = w("list", 15), tBoots = w("boots", 90), tPrice = w("$150", 110), tCash = w("cash", 160);
  const sList = usePop(tList);
  const check = ease(frame, tPrice, tPrice + 8, 0, 1);
  const pose = usePoseTrack([[0, "idle"], [tList, "present"], [tCash, "cheer"]]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 470, top: 240, width: 520, rotate: "3deg", scale: String(sList), background: "#FFFDF4", border: `7px solid ${C.ink}`, borderRadius: 14, padding: "26px 34px", fontFamily: FONT, fontWeight: 900, color: C.ink, boxShadow: `0 12px 0 ${C.ink}`, boxSizing: "border-box" }}>
        <div style={{ fontSize: 56, borderBottom: `5px solid ${C.ink}`, paddingBottom: 10 }}>MY LIST</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 24, fontSize: 44, minHeight: 60 }}>
          <div style={{ width: 52, height: 52, border: `6px solid ${C.ink}`, borderRadius: 10, position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", left: 2, top: -20, opacity: check, scale: String(check) }}><Check size={64} color={C.green} /></div>
          </div>
          <span>{frame >= tBoots ? scene.props.item : ""}</span>
        </div>
        <div style={{ textAlign: "right", fontSize: 64, color: C.green, marginTop: 10, minHeight: 76 }}>{frame >= tPrice ? scene.props.price : ""}</div>
        <div style={{ marginTop: 14, fontSize: 30, color: C.gray }}>THAT'S IT.</div>
      </div>
      <Svg>
        <Ground />
        <Stickman x={240} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.15} mood="happy" />
        {frame >= tCash &&
          [0, 1, 2].map((i) => <Bill key={i} x={700 + i * 40} y={ease(frame, tCash + i * 3, tCash + i * 3 + 10, 700, 1000)} rot={-10 + i * 8} />)}
      </Svg>
      <Tag x={740} y={1060} at={tCash} text={scene.props.paid} bg={C.green} size={54} rotate={-3} />
      <Sfx at={tList} name="whoosh" />
      <Sfx at={tPrice} name="pop" />
      <Sfx at={tCash} name="coin" />
    </AbsoluteFill>
  );
};

export const SCENES4: Record<string, React.FC<SceneProps>> = {
  bfHook: BfHook,
  cart: Cart,
  receipt: Receipt,
  flip: Flip,
  payments: Payments,
  shoppingList: ShoppingList,
};
