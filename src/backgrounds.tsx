import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT } from "./theme";

// Background rotates every 3 videos: 1-3 cream, 4-6 grid, 7-9 dots, then repeats.
const Cream: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#FFF6E5" }}>
      <svg width={1080} height={1920}>
        <circle cx={160 + Math.sin(frame / 60) * 40} cy={420} r={260} fill="#FFE7B8" />
        <circle cx={950 + Math.cos(frame / 70) * 40} cy={1000} r={320} fill="#FFE7B8" />
        <circle cx={540} cy={1650} r={420} fill="#FFEFD0" />
      </svg>
    </AbsoluteFill>
  );
};

// Notebook / blueprint grid, slowly drifting, with faint floating $ signs
const Grid: React.FC = () => {
  const frame = useCurrentFrame();
  const step = 72;
  const off = (frame * 0.6) % step;
  return (
    <AbsoluteFill style={{ background: "#EEF5FF" }}>
      <svg width={1080} height={1920}>
        <g transform={`translate(${-off},${-off})`}>
          {Array.from({ length: Math.ceil(1080 / step) + 2 }).map((_, i) => (
            <line key={`v${i}`} x1={i * step} x2={i * step} y1={0} y2={2000} stroke="#D3E3F8" strokeWidth={3} />
          ))}
          {Array.from({ length: Math.ceil(1920 / step) + 2 }).map((_, i) => (
            <line key={`h${i}`} x1={0} x2={1200} y1={i * step} y2={i * step} stroke="#D3E3F8" strokeWidth={3} />
          ))}
        </g>
        <rect x={-60} y={300 + Math.sin(frame / 50) * 20} width={360} height={360} rx={80} fill="#DCEAFE" opacity={0.8} transform="rotate(-12 120 480)" />
        <rect x={800} y={900 + Math.cos(frame / 60) * 20} width={380} height={380} rx={90} fill="#DCEAFE" opacity={0.8} transform="rotate(10 990 1090)" />
        {[[140, 1500, 0], [930, 380, 1], [520, 1760, 2], [880, 1560, 3]].map(([x, y, i]) => (
          <text key={i} x={x} y={y - ((frame * 0.8 + i * 90) % 140)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={90} fill="#C6DAF6" opacity={0.9}>
            $
          </text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// Mint with diagonal drifting dot pattern
const Dots: React.FC = () => {
  const frame = useCurrentFrame();
  const step = 64;
  const off = (frame * 0.7) % step;
  return (
    <AbsoluteFill style={{ background: "#ECF8EF" }}>
      <svg width={1080} height={1920}>
        <g transform={`translate(${off},${-off})`}>
          {Array.from({ length: 20 }).flatMap((_, r) =>
            Array.from({ length: 34 }).map((__, c) => (
              <circle key={`${r}-${c}`} cx={r * step - step + (c % 2) * (step / 2)} cy={c * step} r={6} fill="#CFEBD7" />
            )),
          )}
        </g>
        <circle cx={980} cy={360 + Math.sin(frame / 55) * 30} r={240} fill="#D7F0DE" />
        <circle cx={90} cy={1200 + Math.cos(frame / 65) * 30} r={280} fill="#D7F0DE" />
      </svg>
    </AbsoluteFill>
  );
};


// Sunset: warm gradient, soft glow blobs, diagonal light rays, drifting coins
const Sunset: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(170deg, #FFF0DC 0%, #FFE0D2 45%, #FFD3E2 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB4C8" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#FFB4C8" stopOpacity={0} />
          </radialGradient>
        </defs>
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={-600 + i * 300 + ((frame * 0.8) % 300)} y={-200} width={90} height={2600} fill="#FFFFFF" opacity={0.18} transform="rotate(24 540 960)" />
        ))}
        <circle cx={220 + Math.sin(frame / 50) * 40} cy={480} r={420} fill="url(#glowA)" />
        <circle cx={900 + Math.cos(frame / 60) * 40} cy={1250} r={480} fill="url(#glowB)" />
        <circle cx={540} cy={1800} r={520} fill="url(#glowA)" />
        {[[120, 0], [900, 1], [300, 2], [760, 3], [1000, 4]].map(([x, i]) => {
          const y = 2000 - ((frame * (1.2 + (i % 3) * 0.3) + i * 420) % 2200);
          return (
            <g key={i} transform={`translate(${x + Math.sin((frame + i * 40) / 30) * 20},${y})`} opacity={0.35}>
              <circle r={26} fill="#FFD60A" stroke="#E0A800" strokeWidth={4} />
              <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#B8860B">$</text>
            </g>
          );
        })}
      </svg>
      <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(120,40,60,0.18)" }} />
    </AbsoluteFill>
  );
};

const THEMES = [Cream, Grid, Dots];
const NAMED: Record<string, React.FC> = { cream: Cream, grid: Grid, dots: Dots, sunset: Sunset };

export const Background: React.FC<{ seq?: number; theme?: string | null }> = ({ seq = 1, theme }) => {
  const Comp = (theme && NAMED[theme]) || THEMES[Math.floor((seq - 1) / 3) % THEMES.length];
  return <Comp />;
};
