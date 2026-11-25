import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C } from "./theme";
import { SCENES } from "./scenes";
import { Background } from "./backgrounds";
import { Captions } from "./components/Captions";
import type { SceneData, Timeline } from "./types";

// Each scene: whip-zoom in + slow camera push
const SceneShell: React.FC<{ scene: SceneData; children: React.ReactNode; first?: boolean }> = ({ scene, children, first }) => {
  const frame = useCurrentFrame() + (first ? 20 : 0);
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

const Progress: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 14, background: "rgba(27,27,31,0.15)" }}>
      <div style={{ height: "100%", width: `${(frame / total) * 100}%`, background: "linear-gradient(90deg, #FFD60A, #E5484D)" }} />
    </div>
  );
};

export const Short: React.FC<Timeline> = (t) => {
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <Background seq={t.seq} theme={t.theme} />
      {t.scenes.map((sc, i) => {
        const Comp = SCENES[sc.type];
        return (
          <Sequence key={i} from={sc.from} durationInFrames={sc.durationInFrames} name={`${i + 1}. ${sc.type}`}>
            <SceneShell scene={sc} first={i === 0}>{Comp ? <Comp scene={sc} characters={t.characters} /> : null}</SceneShell>
            <Audio src={staticFile(sc.audio)} />
          </Sequence>
        );
      })}
      <Captions scenes={t.scenes} v2={!!t.theme} />
      {t.theme && <Progress total={t.durationInFrames} />}
    </AbsoluteFill>
  );
};
