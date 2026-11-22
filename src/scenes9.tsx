import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, GROUND_Y } from "./theme";
import { Stickman } from "./components/Stickman";
import { ease, usePop } from "./components/ui";
import { Ground, moodAt, Sfx, Svg, usePoseTrack, useWords } from "./scenes";
import type { SceneProps } from "./types";

export const Sneaker: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={18} rx={250} ry={18} fill="rgba(0,0,0,0.12)" />
    <path d="M-230,0 L-230,-60 Q-225,-120 -150,-140 L-60,-160 Q-20,-230 60,-220 L90,-150 Q150,-100 230,-80 Q260,-70 255,-30 L250,0 Z" fill="#fff" stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
    <path d="M-235,0 L250,0 L246,-30 L-232,-30 Z" fill={C.ink} />
    <path d="M-120,-110 Q-30,-60 60,-120 Q120,-90 200,-70" fill="none" stroke={C.red} strokeWidth={22} strokeLinecap="round" />
    {[0, 1, 2].map((i) => (
      <line key={i} x1={-10 + i * 28} y1={-200 + i * 14} x2={30 + i * 28} y2={-180 + i * 14} stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
    ))}
  </g>
);

const Clock: React.FC<{ x: number; y: number; r: number; frame: number }> = ({ x, y, r, frame }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r} fill="#fff" stroke={C.ink} strokeWidth={10} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.7} stroke={C.red} strokeWidth={10} strokeLinecap="round" transform={`rotate(${frame * 24})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.45} stroke={C.ink} strokeWidth={12} strokeLinecap="round" transform={`rotate(${frame * 2})`} />
    <circle r={10} fill={C.ink} />
  </g>
);

// Frame 1: a product + its price, then the price turns into hours of life
const PriceHook: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const tNot = w(p.notWord, 90), tAns = w(p.answerWord, 180);
  const s = usePop(-30), sAns = usePop(tAns, 9);
  const strike = ease(frame, tNot, tNot + 8, 0, 1);
  const mike = characters.mike;
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <g transform={`translate(540,640) scale(${s}) translate(-540,-640)`}>
          <Sneaker x={540} y={770} s={1.2} rot={-6 + Math.sin(frame / 12) * 2} />
        </g>
        <Stickman x={180} y={GROUND_Y} pose={usePoseTrack([[0, "pointRight"], [tAns, "facepalm"]])} color={mike.color} name={mike.name} scale={0.8} mood={moodAt(frame, [[0, "happy"], [tAns, "shock"]])} />
        {frame >= tAns && <Clock x={870} y={960} r={90} frame={frame} />}
      </Svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", scale: String(s) }}>
        <div style={{ position: "relative", background: C.yellow, border: `9px solid ${C.ink}`, borderRadius: 30, padding: "4px 50px", fontFamily: FONT, fontWeight: 900, fontSize: 160, color: C.ink, rotate: "-4deg", boxShadow: `0 14px 0 ${C.ink}` }}>
          {p.price}
          <div style={{ position: "absolute", left: 20, top: "46%", height: 18, width: `${strike * 90}%`, background: C.red, borderRadius: 9 }} />
        </div>
      </div>
      {frame >= tAns && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center" }}>
          <div style={{ scale: String(sAns), background: C.red, color: "#fff", border: `9px solid ${C.ink}`, borderRadius: 28, padding: "8px 44px", fontFamily: FONT, fontWeight: 900, fontSize: 96, rotate: "3deg", textAlign: "center", lineHeight: 1 }}>
            {p.answer}
            <div style={{ fontSize: 44, marginTop: 6 }}>OF YOUR LIFE</div>
          </div>
        </div>
      )}
      <Sfx at={0} name="whoosh" />
      <Sfx at={tNot} name="pop" />
      <Sfx at={tAns} name="thud" volume={0.9} />
    </AbsoluteFill>
  );
};

export const SCENES9: Record<string, React.FC<SceneProps>> = {
  priceHook: PriceHook,
};
