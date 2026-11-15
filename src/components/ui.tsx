import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import type { Word } from "../types";

// Frame (relative to scene) when a word containing `match` is spoken
export const wordFrame = (words: Word[], match: string, fps: number, fallback = 0, nth = 0) => {
  const m = match.toLowerCase();
  const hits = words.filter((w) => w.text.toLowerCase().includes(m));
  const w = hits[nth];
  return w ? Math.round(w.start * fps) : fallback;
};

export const usePop = (at: number, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness: 180, mass: 0.7 } });
};

export const ease = (frame: number, a: number, b: number, from: number, to: number) =>
  interpolate(frame, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// Pill / tag rendered in HTML space
export const Tag: React.FC<{
  x: number; y: number; at: number; text: string; bg?: string; color?: string; size?: number; rotate?: number;
}> = ({ x, y, at, text, bg = C.ink, color = "#fff", size = 64, rotate = 0 }) => {
  const s = usePop(at);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(s), rotate: `${rotate}deg`,
        background: bg, color, fontFamily: FONT, fontWeight: 900, fontSize: size, padding: `${size * 0.18}px ${size * 0.42}px`,
        borderRadius: size * 0.35, border: `6px solid ${C.ink}`, boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const Title: React.FC<{ text: string; at?: number; y?: number; color?: string; size?: number }> = ({
  text, at = 0, y = 300, color = C.ink, size = 110,
}) => {
  const s = usePop(at, 12);
  return (
    <div
      style={{
        position: "absolute", left: 0, right: 0, top: y, textAlign: "center", scale: String(s),
        fontFamily: FONT, fontWeight: 900, fontSize: size, color, letterSpacing: -2, lineHeight: 1,
      }}
    >
      {text}
    </div>
  );
};

export const Stamp: React.FC<{ x: number; y: number; at: number; text: string; color?: string; size?: number }> = ({ x, y, at, text, color = C.red, size = 110 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const k = ease(frame, at, at + 6, 2.2, 1);
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(k), rotate: "-12deg",
        opacity: ease(frame, at, at + 3, 0, 1), border: `10px solid ${color}`, color, padding: "6px 34px",
        borderRadius: 18, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 4, background: "rgba(255,255,255,0.85)", whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
