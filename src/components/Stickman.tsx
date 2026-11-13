import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";

// angle in degrees: 0 = straight down, 90 = screen right, 180 = up, -90 = screen left
export type Pose = {
  la: [number, number]; // left arm  (upper, lower)
  ra: [number, number]; // right arm
  ll: [number, number]; // left leg
  rl: [number, number]; // right leg
  lean: number; // torso lean (deg)
  head: number; // head tilt (deg)
};

export const POSES: Record<string, Pose> = {
  idle: { la: [-16, -6], ra: [16, 6], ll: [-12, -4], rl: [12, 4], lean: 0, head: 0 },
  cheer: { la: [-145, -165], ra: [145, 165], ll: [-16, -8], rl: [16, 8], lean: 0, head: -4 },
  sad: { la: [-5, -2], ra: [5, 2], ll: [-8, -3], rl: [8, 3], lean: 8, head: 18 },
  pointRight: { la: [-16, -6], ra: [100, 95], ll: [-12, -4], rl: [12, 4], lean: -3, head: 6 },
  pointLeft: { la: [-100, -95], ra: [16, 6], ll: [-12, -4], rl: [12, 4], lean: 3, head: -6 },
  pointUp: { la: [-16, -6], ra: [150, 175], ll: [-12, -4], rl: [12, 4], lean: -2, head: -8 },
  present: { la: [-16, -6], ra: [55, 115], ll: [-12, -4], rl: [12, 4], lean: -2, head: 4 },
  shrug: { la: [-55, -150], ra: [55, 150], ll: [-12, -4], rl: [12, 4], lean: 0, head: 10 },
  facepalm: { la: [-16, -6], ra: [-30, -175], ll: [-10, -4], rl: [10, 4], lean: 6, head: 14 },
  wave: { la: [-16, -6], ra: [130, 160], ll: [-12, -4], rl: [12, 4], lean: -2, head: 6 },
};

export type Mood = "happy" | "sad" | "shock" | "neutral" | "smug";

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const mixPose = (a: Pose, b: Pose, k: number): Pose => ({
  la: [lerp(a.la[0], b.la[0], k), lerp(a.la[1], b.la[1], k)],
  ra: [lerp(a.ra[0], b.ra[0], k), lerp(a.ra[1], b.ra[1], k)],
  ll: [lerp(a.ll[0], b.ll[0], k), lerp(a.ll[1], b.ll[1], k)],
  rl: [lerp(a.rl[0], b.rl[0], k), lerp(a.rl[1], b.rl[1], k)],
  lean: lerp(a.lean, b.lean, k),
  head: lerp(a.head, b.head, k),
});

const vec = (deg: number, len: number) => {
  const r = (deg * Math.PI) / 180;
  return [Math.sin(r) * len, Math.cos(r) * len];
};

const UPPER_ARM = 62, FOREARM = 58, THIGH = 72, SHIN = 70, TORSO = 112, HEAD_R = 38;

export const Stickman: React.FC<{
  x: number;
  y: number; // feet y
  scale?: number;
  pose: Pose;
  mood?: Mood;
  color?: string;
  name?: string;
  walking?: boolean;
  waveHand?: boolean;
  flip?: boolean;
}> = ({ x, y, scale = 1, pose, mood = "neutral", color = C.ink, name, walking, waveHand, flip }) => {
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame / 9) * 3;
  let p = pose;
  if (walking) {
    const s = Math.sin(frame / 3.2) * 28;
    p = { ...p, ll: [s, s - 10], rl: [-s, -s - 10], la: [-s * 0.7 - 10, -s * 0.7 - 15], ra: [s * 0.7 + 10, s * 0.7 + 15] };
  }
  if (waveHand) {
    p = { ...p, ra: [p.ra[0], p.ra[1] + Math.sin(frame / 3) * 28] };
  }
  const hip: [number, number] = [0, -(THIGH + SHIN) + (walking ? Math.abs(Math.sin(frame / 3.2)) * -6 : 0)];
  const [tx, ty] = vec(180 + p.lean, TORSO);
  const shoulder: [number, number] = [hip[0] + tx, hip[1] + ty + breathe * 0.3];
  const limb = (from: [number, number], a: [number, number], l1: number, l2: number) => {
    const [x1, y1] = vec(a[0], l1);
    const j: [number, number] = [from[0] + x1, from[1] + y1];
    const [x2, y2] = vec(a[1], l2);
    return `M${from[0]},${from[1]} L${j[0]},${j[1]} L${j[0] + x2},${j[1] + y2}`;
  };
  const headC: [number, number] = [shoulder[0] + vec(180 + p.lean, 1)[0] * 0, shoulder[1] - HEAD_R - 8];
  const mouth = {
    happy: "M-14,8 Q0,24 14,8",
    sad: "M-13,18 Q0,6 13,18",
    shock: "",
    neutral: "M-11,13 L11,13",
    smug: "M-12,12 Q4,20 14,6",
  }[mood];

  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`}>
      {/* shadow */}
      <ellipse cx={0} cy={4} rx={70} ry={12} fill="rgba(0,0,0,0.12)" />
      <g fill="none" stroke={C.ink} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round">
        <path d={limb(hip, p.ll, THIGH, SHIN)} />
        <path d={limb(hip, p.rl, THIGH, SHIN)} />
        <path d={`M${hip[0]},${hip[1]} L${shoulder[0]},${shoulder[1]}`} stroke={color} strokeWidth={26} />
        <path d={limb(shoulder, p.la, UPPER_ARM, FOREARM)} />
        <path d={limb(shoulder, p.ra, UPPER_ARM, FOREARM)} />
      </g>
      <g transform={`translate(${headC[0]},${headC[1]}) rotate(${p.head})`}>
        <circle r={HEAD_R} fill="#fff" stroke={C.ink} strokeWidth={10} />
        <g transform={flip ? "scale(-1,1)" : undefined}>
          <circle cx={-13} cy={-6} r={mood === "shock" ? 6 : 5} fill={C.ink} />
          <circle cx={13} cy={-6} r={mood === "shock" ? 6 : 5} fill={C.ink} />
          {mood === "sad" && (
            <path d="M-22,-18 L-6,-14 M22,-18 L6,-14" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
          )}
          {mood === "shock" ? (
            <ellipse cx={0} cy={14} rx={8} ry={10} fill={C.ink} />
          ) : (
            <path d={mouth} fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
          )}
        </g>
      </g>
      {name && (
        <g transform={`translate(0,${headC[1] - HEAD_R - 52}) scale(${flip ? -1 : 1},1)`}>
          <rect x={-78} y={-30} width={156} height={58} rx={29} fill={color} />
          <text x={0} y={13} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">
            {name}
          </text>
        </g>
      )}
    </g>
  );
};
