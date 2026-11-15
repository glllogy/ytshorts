import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, GROUND_Y } from "./theme";
import { Stickman } from "./components/Stickman";
import { ease, Stamp, Tag, Title, usePop } from "./components/ui";
import { Ground, moodAt, Sfx, Svg, usePoseTrack, useWords } from "./scenes";
import type { SceneProps } from "./types";

// Frame 1: old man surrounded by rumors. Then the will slides in.
const WillHook: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const rumors = scene.props.rumors as string[];
  const tWill = w("will", 95), tRead = w("read", 85);
  const pose = usePoseTrack([[0, "sad"], [tRead, "idle"], [tWill + 10, "pointRight"]]);
  const docY = ease(frame, tRead, tWill + 6, 1300, 560);
  const docRot = ease(frame, tRead, tWill + 6, 14, -3);
  const pos = [
    [300, 470, -8],
    [800, 560, 6],
    [250, 760, 5],
  ];
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <Stickman x={frame >= tRead ? interpolate(Math.min(frame, tRead + 10), [tRead, tRead + 10], [540, 230]) : 540} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.15} mood={moodAt(frame, [[0, "neutral"], [tWill + 10, "smug"]])} />
      </Svg>
      {rumors.map((r, i) => (
        <div key={i} style={{ opacity: ease(frame, tRead - 4, tRead + 4, 1, 0) }}>
          <Tag x={pos[i][0]} y={pos[i][1]} at={-30 + i * 2} text={r} bg="#fff" color={C.ink} size={54} rotate={pos[i][2] + Math.sin(frame / 7 + i) * 2} />
        </div>
      ))}
      <Title text="THE TOWN SAID:" at={-30} y={240} size={90} />
      {frame >= tRead && (
        <div style={{ position: "absolute", left: 640, top: docY, translate: "-50% -50%", rotate: `${docRot}deg`, width: 540, background: "#FFFDF4", border: `7px solid ${C.ink}`, borderRadius: 12, padding: "30px 36px", boxSizing: "border-box", boxShadow: `0 14px 0 ${C.ink}`, fontFamily: FONT, fontWeight: 900, color: C.ink }}>
          <div style={{ fontSize: 54, textAlign: "center", borderBottom: `5px solid ${C.ink}`, paddingBottom: 12 }}>{scene.props.doc}</div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 14, background: "#D9D4CC", borderRadius: 7, margin: "22px 0", width: `${90 - i * 12}%` }} />
          ))}
          <div style={{ fontSize: 70, color: C.green, textAlign: "center", filter: "blur(9px)" }}>$8,000,000</div>
        </div>
      )}
      <Sfx at={0} name="thud" volume={0.6} />
      <Sfx at={tRead} name="whoosh" />
      <Sfx at={tWill + 6} name="pop" />
    </AbsoluteFill>
  );
};

type Fact = { word: string; label: string };
const FactsList: React.FC<SceneProps> = ({ scene, characters }) => {
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const facts = scene.props.facts as Fact[];
  const times = facts.map((f, i) => w(f.word, 10 + i * 30));
  return (
    <AbsoluteFill>
      <Title text={scene.props.title} at={0} y={210} size={110} />
      <Svg>
        <Ground />
        <Stickman x={220} y={GROUND_Y} pose={usePoseTrack([[0, "idle"]])} walking color={ch.color} name={ch.name} scale={1.05} mood="neutral" />
      </Svg>
      {facts.map((f, i) => (
        <Tag key={i} x={690} y={430 + i * 140} at={times[i]} text={f.label} bg={i % 2 ? C.yellow : "#fff"} color={C.ink} size={f.label.length > 12 ? 46 : 56} rotate={i % 2 ? 3 : -3} />
      ))}
      {times.map((t, i) => (
        <Sfx key={i} at={t} name="pop" />
      ))}
    </AbsoluteFill>
  );
};

const Cert: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <rect x={-150} y={-38} width={300} height={76} rx={6} fill="#F6EFD9" stroke={C.ink} strokeWidth={5} />
    <rect x={-138} y={-28} width={276} height={56} rx={4} fill="none" stroke="#B8860B" strokeWidth={3} />
    <text x={-30} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#5E2E14">
      STOCK
    </text>
    <circle cx={95} cy={0} r={18} fill={C.red} stroke={C.ink} strokeWidth={3} />
  </g>
);

const CertStack: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const tBuy = w(scene.props.buyWord, 35), tHold = w(scene.props.holdWord, 150);
  const N = 11;
  const every = Math.max(4, Math.floor((tHold - tBuy - 10) / N));
  const pose = usePoseTrack([[0, "idle"], [tBuy, "present"], [tHold, "cheer"]]);
  const sTitle = usePop(0);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 110, color: C.ink, scale: String(sTitle) }}>
        {scene.props.title}
      </div>
      <Svg>
        <Ground />
        {Array.from({ length: N }).map((_, i) => {
          const at = tBuy + i * every;
          if (frame < at) return null;
          const k = ease(frame, at, at + 7, 0, 1);
          const targetY = GROUND_Y - 40 - i * 40;
          return <Cert key={i} x={720 + (i % 3 - 1) * 10} y={interpolate(k, [0, 1], [targetY - 300, targetY])} rot={(i % 2 ? 3 : -3) * (1 - k * 0.4)} />;
        })}
        <Stickman x={240} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.1} mood={moodAt(frame, [[0, "neutral"], [tBuy, "happy"], [tHold, "smug"]])} />
      </Svg>
      {frame < tHold && <Tag x={420} y={420} at={tBuy} text="BUY" bg={C.green} size={60} rotate={-5} />}
      {frame < tHold && <Tag x={420} y={530} at={w("boring", 80)} text="BORING" bg="#fff" color={C.ink} size={48} rotate={4} />}
      <Stamp x={540} y={520} at={tHold} text={scene.props.hold} color={C.green} size={88} />
      {Array.from({ length: N }).map((_, i) => (i % 3 === 0 ? <Sfx key={i} at={tBuy + i * every} name="coin" volume={0.35} /> : null))}
      <Sfx at={tHold} name="thud" />
    </AbsoluteFill>
  );
};

export const SCENES5: Record<string, React.FC<SceneProps>> = {
  willHook: WillHook,
  factsList: FactsList,
  certStack: CertStack,
};
