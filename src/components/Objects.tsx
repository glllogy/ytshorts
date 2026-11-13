import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";

// Side-view car, origin = bottom center of wheels
export const Car: React.FC<{ x: number; y: number; scale?: number; color?: string; old?: boolean; driving?: boolean }> = ({
  x, y, scale = 1, color = C.red, old, driving,
}) => {
  const frame = useCurrentFrame();
  const rot = driving ? frame * 18 : 0;
  const bounce = driving ? Math.sin(frame / 2) * 2 : 0;
  const body = old ? "#8E8A84" : color;
  const wheel = (cx: number) => (
    <g transform={`translate(${cx},-42) rotate(${rot})`}>
      <circle r={42} fill={C.ink} />
      <circle r={18} fill="#ddd" />
      <rect x={-3} y={-18} width={6} height={36} fill={C.ink} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <ellipse cx={0} cy={2} rx={210} ry={14} fill="rgba(0,0,0,0.12)" />
      <g transform={`translate(0,${bounce})`}>
        <path
          d="M-200,-50 L-200,-110 Q-195,-130 -170,-135 L-110,-140 L-60,-200 Q-50,-210 -30,-210 L80,-210 Q100,-210 115,-195 L160,-140 L190,-132 Q205,-125 205,-105 L205,-50 Z"
          fill={body}
          stroke={C.ink}
          strokeWidth={9}
          strokeLinejoin="round"
        />
        <path d="M-90,-140 L-50,-190 L5,-190 L5,-140 Z" fill="#BFE3FF" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
        <path d="M22,-140 L22,-190 L80,-190 L120,-140 Z" fill="#BFE3FF" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
        <circle cx={192} cy={-112} r={9} fill={C.yellow} stroke={C.ink} strokeWidth={4} />
        {old && (
          <>
            <path d="M-150,-95 l20,12 l15,-14 l18,10" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
            <path d="M90,-180 l-14,24 l12,4 l-10,18" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
            <rect x={120} y={-95} width={40} height={14} fill="#6E6A64" />
          </>
        )}
        {wheel(-120)}
        {wheel(120)}
      </g>
      {old &&
        [0, 1, 2].map((i) => {
          const t = ((frame + i * 14) % 42) / 42;
          return (
            <circle key={i} cx={-215 - t * 90} cy={-60 - t * 70} r={14 + t * 26} fill="#777" opacity={0.55 * (1 - t)} />
          );
        })}
    </g>
  );
};

export const Coin: React.FC<{ x: number; y: number; r?: number; spin?: number }> = ({ x, y, r = 34, spin = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${Math.max(0.15, Math.abs(Math.cos(spin)))},1)`}>
    <circle r={r} fill={C.yellow} stroke="#B8860B" strokeWidth={6} />
    <text y={r * 0.38} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={r * 1.1} fill="#B8860B">
      $
    </text>
  </g>
);

export const Bill: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-34} width={140} height={68} rx={8} fill="#7BC67E" stroke="#2E7D32" strokeWidth={5} />
    <circle r={20} fill="#A5D6A7" stroke="#2E7D32" strokeWidth={4} />
    <text y={11} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill="#2E7D32">
      $
    </text>
  </g>
);

// Glass jar, origin = bottom center
export const Jar: React.FC<{ x: number; y: number; fill: number; label?: string }> = ({ x, y, fill, label }) => {
  const h = 300, w = 220;
  const fh = Math.max(0, Math.min(1, fill)) * (h - 30);
  return (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={0} cy={4} rx={130} ry={14} fill="rgba(0,0,0,0.12)" />
      <rect x={-w / 2 + 8} y={-fh - 8} width={w - 16} height={fh} rx={18} fill={C.yellow} opacity={0.9} />
      {Array.from({ length: Math.floor(fh / 26) }).map((_, i) => (
        <line key={i} x1={-w / 2 + 14} x2={w / 2 - 14} y1={-8 - i * 26} y2={-8 - i * 26} stroke="#B8860B" strokeWidth={4} />
      ))}
      <rect x={-w / 2} y={-h} width={w} height={h} rx={28} fill="rgba(190,230,255,0.25)" stroke={C.ink} strokeWidth={9} />
      <rect x={-w / 2 + 20} y={-h - 30} width={w - 40} height={34} rx={8} fill="#ccc" stroke={C.ink} strokeWidth={8} />
      {label && (
        <g transform={`translate(0,${-h / 2})`}>
          <rect x={-90} y={-30} width={180} height={60} rx={10} fill="#fff" stroke={C.ink} strokeWidth={6} />
          <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={C.ink}>
            {label}
          </text>
        </g>
      )}
    </g>
  );
};
