import React from "react";
import { Composition } from "remotion";
import { Short } from "./Short";
import { stories } from "./generated";
import "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {stories.map((s) => (
        <Composition
          key={s.id}
          id={s.id}
          component={Short}
          durationInFrames={s.durationInFrames}
          fps={s.fps}
          width={1080}
          height={1920}
          defaultProps={s}
        />
      ))}
    </>
  );
};
