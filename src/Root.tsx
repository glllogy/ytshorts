import React from "react";
import { Composition, Still } from "remotion";
import { Avatar, Banner } from "./Brand";
import { COVERS, STORIES } from "./Stories";
import { Short } from "./Short";
import { stories } from "./generated";
import "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Still id="avatar" component={Avatar} width={800} height={800} />
      <Still id="banner" component={Banner} width={2560} height={1440} />
      {[...STORIES, ...COVERS].map(([id, Comp]) => (
        <Still key={id} id={`ig-${id}`} component={Comp} width={1080} height={1920} />
      ))}
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
