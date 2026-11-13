import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C } from "./theme";
import { SCENES } from "./scenes";
import { Captions } from "./components/Captions";
import type { SceneData, Timeline } from "./types";

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <svg width={1080} height={1920}>
        <circle cx={160 + Math.sin(frame / 60) * 40} cy={420} r={260} fill="#FFE7B8" />
        <circle cx={950 + Math.cos(frame / 70) * 40} cy={1000} r={320} fill="#FFE7B8" />
        <circle cx={540} cy={1650} r={420} fill="#FFEFD0" />
      </svg>
    </AbsoluteFill>
  );
};

// Each scene: whip-zoom in + slow camera push
const SceneShell: React.FC<{ scene: SceneData; children: React.ReactNode }> = ({ scene, children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 8], [1.18, 1], { extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const push = interpolate(frame, [0, scene.durationInFrames], [1, 1.05]);
  const blur = interpolate(frame, [0, 6], [10, 0], { extrapolateRight: "clamp" });
  const shift = interpolate(frame, [0, 8], [60, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ scale: String(enter * push), filter: `blur(${blur}px)`, translate: `${shift}px 0px` }}>
      {children}
    </AbsoluteFill>
  );
};

export const Short: React.FC<Timeline> = (t) => {
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <Background />
      {t.scenes.map((sc, i) => {
        const Comp = SCENES[sc.type];
        return (
          <Sequence key={i} from={sc.from} durationInFrames={sc.durationInFrames} name={`${i + 1}. ${sc.type}`}>
            <SceneShell scene={sc}>{Comp ? <Comp scene={sc} characters={t.characters} /> : null}</SceneShell>
            <Audio src={staticFile(sc.audio)} />
          </Sequence>
        );
      })}
      <Captions scenes={t.scenes} />
    </AbsoluteFill>
  );
};
