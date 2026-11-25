export type Word = { text: string; start: number; end: number };

export type SceneData = {
  type: string;
  props: Record<string, any>;
  text: string;
  audio: string;
  from: number;
  durationInFrames: number;
  words: Word[];
};

export type Character = { name: string; color: string };

export type Timeline = {
  id: string;
  seq?: number;
  theme?: string | null;
  title: string;
  fps: number;
  characters: Record<string, Character>;
  durationInFrames: number;
  scenes: SceneData[];
};

export type SceneProps = {
  scene: SceneData;
  characters: Record<string, Character>;
};
