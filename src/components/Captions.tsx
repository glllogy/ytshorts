import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CAPTION_Y, FONT } from "../theme";
import type { SceneData } from "../types";

type W = { text: string; s: number; e: number };

export const Captions: React.FC<{ scenes: SceneData[] }> = ({ scenes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chunks = useMemo(() => {
    const out: W[][] = [];
    for (const sc of scenes) {
      let cur: W[] = [];
      for (const w of sc.words) {
        cur.push({ text: w.text, s: sc.from + w.start * fps, e: sc.from + w.end * fps });
        const len = cur.reduce((a, b) => a + b.text.length, 0);
        if (/[.,?!…]$/.test(w.text) || cur.length >= 3 || len > 14) {
          out.push(cur);
          cur = [];
        }
      }
      if (cur.length) out.push(cur);
    }
    return out;
  }, [scenes, fps]);

  const idx = chunks.findIndex((c, i) => {
    const next = chunks[i + 1];
    return frame >= c[0].s - 2 && (next ? frame < next[0].s - 2 : frame < c[c.length - 1].e + 12);
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const pop = spring({ frame: frame - (chunk[0].s - 2), fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });

  return (
    <div
      style={{
        position: "absolute", left: 60, right: 60, top: CAPTION_Y, display: "flex", flexWrap: "wrap",
        justifyContent: "center", columnGap: 34, scale: String(0.8 + 0.2 * pop),
      }}
    >
      {chunk.map((w, i) => {
        const active = frame >= w.s && frame < (chunk[i + 1]?.s ?? w.e + 12);
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT, fontWeight: 900, fontSize: 92, textTransform: "uppercase", lineHeight: 1.15,
              color: active ? C.yellow : "#fff", WebkitTextStroke: `14px ${C.ink}`, paintOrder: "stroke fill",
              scale: active ? "1.08" : "1", display: "inline-block",
            }}
          >
            {w.text.replace(/[.,]$/, "")}
          </span>
        );
      })}
    </div>
  );
};
