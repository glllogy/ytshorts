import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./theme";
import { POSES, Stickman } from "./components/Stickman";
import { Bill, Coin, Jar } from "./components/Objects";

export const CHANNEL = { name: "Stickonomics", tagline: "Money lessons in 60 seconds" };

const Blob: React.FC<{ cx: number; cy: number; r: number; fill?: string }> = ({ cx, cy, r, fill = "#FFE7B8" }) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} />
);

// 800x800 avatar (YouTube crops to a circle)
export const Avatar: React.FC = () => (
  <AbsoluteFill style={{ background: C.yellow }}>
    <svg width={800} height={800}>
      <circle cx={400} cy={400} r={372} fill={C.bg} stroke={C.ink} strokeWidth={18} />
      <g>
        <Stickman x={400} y={740} scale={1.3} pose={POSES.cheer} mood="happy" color="#2E8B57" />
      </g>
      <g transform="translate(400,165)">
        <Coin x={0} y={0} r={74} />
      </g>
    </svg>
  </AbsoluteFill>
);

// 2560x1440 banner; safe area for all devices = central 1546x423
export const Banner: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <svg width={2560} height={1440} style={{ position: "absolute", inset: 0 }}>
      <Blob cx={300} cy={500} r={420} />
      <Blob cx={2250} cy={950} r={460} />
      <Blob cx={1280} cy={1300} r={380} fill="#FFEFD0" />
      {[
        [520, 420, -20], [700, 1080, 15], [1900, 400, 25], [2050, 1060, -10], [380, 900, 8], [2400, 560, -18],
      ].map(([x, y, r], i) => (
        <Bill key={i} x={x} y={y} rot={r} s={1.1} />
      ))}
      {[[400, 640], [2380, 820], [450, 1150], [2120, 330]].map(([x, y], i) => (
        <Coin key={i} x={x} y={y} r={40} />
      ))}
      <line x1={0} x2={2560} y1={935} y2={935} stroke={C.ink} strokeWidth={6} opacity={0.15} />
      <Stickman x={600} y={930} scale={0.75} pose={POSES.shrug} mood="sad" color={C.red} name="MIKE" />
      <Jar x={2150} y={930} fill={0.8} />
      <Stickman x={1960} y={930} scale={0.75} pose={POSES.pointRight} mood="happy" color="#2E8B57" name="JAKE" />
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 545, textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
      <div style={{ fontSize: 150, color: C.ink, letterSpacing: -4, lineHeight: 1 }}>
        STICK<span style={{ color: "#2E8B57" }}>ONOMICS</span>
      </div>
      <div style={{ display: "inline-block", marginTop: 26, background: C.yellow, border: `7px solid ${C.ink}`, borderRadius: 20, padding: "8px 34px", fontSize: 56, color: C.ink, rotate: "-2deg" }}>
        {CHANNEL.tagline.toUpperCase()}
      </div>
    </div>
  </AbsoluteFill>
);
