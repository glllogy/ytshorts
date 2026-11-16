import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, GROUND_Y } from "./theme";
import { POSES, Stickman } from "./components/Stickman";
import { ease, money, Stamp, Tag, Title, usePop } from "./components/ui";
import { Ground, moodAt, Sfx, Svg, usePoseTrack, useWords } from "./scenes";
import type { SceneProps } from "./types";

// Frame 1: a credit-card statement with the "minimum due" line
const CardHook: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const tMin = w(p.minWord, 70), tStamp = w(p.stampWord, 200);
  const s = usePop(-30);
  const glow = frame >= tMin ? 0.5 + 0.5 * Math.abs(Math.sin((frame - tMin) / 6)) : 0;
  const mike = characters.mike;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, right: 90, top: 200, scale: String(s), background: "#fff", border: `8px solid ${C.ink}`, borderRadius: 34, boxShadow: `0 14px 0 ${C.ink}`, fontFamily: FONT, fontWeight: 900, color: C.ink, overflow: "hidden" }}>
        <div style={{ background: C.ink, color: "#fff", padding: "26px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 46 }}>CREDIT CARD</span>
          <svg width={110} height={74} viewBox="0 0 110 74">
            <rect x={2} y={2} width={106} height={70} rx={10} fill={C.yellow} />
            <rect x={14} y={22} width={26} height={20} rx={4} fill="#B8860B" />
          </svg>
        </div>
        <div style={{ padding: "26px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 54, margin: "10px 0 24px" }}>
            <span>BALANCE</span>
            <span>{p.balance}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 62, padding: "18px 24px", margin: "0 -24px", borderRadius: 18, background: frame >= tMin ? C.yellow : "#F4F1EA", outline: frame >= tMin ? `${6 + glow * 6}px solid ${C.red}` : "none" }}>
            <span>MINIMUM DUE</span>
            <span style={{ color: C.red }}>{p.min}</span>
          </div>
          <div style={{ fontSize: 30, color: C.gray, marginTop: 22 }}>APR 24% · DUE DATE: THE 15TH</div>
        </div>
      </div>
      <Svg>
        <Ground />
        <Stickman x={540} y={GROUND_Y} pose={usePoseTrack([[0, "idle"], [tMin, "pointUp"], [tStamp, "facepalm"]])} color={mike.color} name={mike.name} scale={0.85} mood={moodAt(frame, [[0, "happy"], [tStamp, "shock"]])} />
      </Svg>
      <Stamp x={540} y={760} at={tStamp} text={p.stamp} size={110} />
      <Sfx at={0} name="whoosh" />
      <Sfx at={tMin} name="pop" />
      <Sfx at={tStamp} name="thud" volume={0.9} />
    </AbsoluteFill>
  );
};

const Duo: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const L = characters[p.left], R = characters[p.right];
  const tL = w(p.leftWord, 100), tR = w(p.rightWord, 160), tSub = w(p.subWord, 60);
  const lPose = usePoseTrack([[0, "idle"], [tL, "shrug"]]);
  const rPose = usePoseTrack([[0, "idle"], [tR, "pointUp"]]);
  return (
    <AbsoluteFill>
      <Title text={p.title} at={-30} y={175} size={110} />
      <Svg>
        <Ground />
        <Stickman x={290} y={GROUND_Y} pose={lPose} color={L.color} name={L.name} scale={1.1} mood={moodAt(frame, [[0, "neutral"], [tL, "smug"]])} />
        <Stickman x={790} y={GROUND_Y} pose={rPose} color={R.color} name={R.name} scale={1.1} mood={moodAt(frame, [[0, "neutral"], [tR, "happy"]])} />
      </Svg>
      {frame < tL && <Tag x={290} y={500} at={-30} text={p.both} bg="#fff" color={C.ink} size={46} />}
      {frame < tR && <Tag x={790} y={500} at={-28} text={p.both} bg="#fff" color={C.ink} size={46} />}
      <Tag x={290} y={500} at={tL} text={p.leftTag} bg={C.red} size={58} rotate={-4} />
      <Tag x={790} y={500} at={tR} text={p.rightTag} bg={C.green} size={58} rotate={4} />
      <Tag x={540} y={375} at={tSub} text={p.sub} bg={C.ink} color={C.yellow} size={56} rotate={-2} />
      <Sfx at={tSub} name="pop" />
      <Sfx at={tL} name="thud" />
      <Sfx at={tR} name="ding" />
    </AbsoluteFill>
  );
};

const simulate = (start: number, months: number, pay: (b: number, i: number) => number) => {
  const out = [start];
  let b = start;
  for (let m = 0; m < months; m++) {
    const i = b * 0.02;
    b = Math.max(0, b + i - Math.min(pay(b, i), b + i));
    out.push(b);
  }
  return out;
};

const DebtRace: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const p = scene.props;
  const tFree = w(p.freeWord, 50), tOwe = w(p.oweWord, 100);
  const mikeB = simulate(p.start, p.months, (b, i) => Math.max(25, i + 0.01 * b));
  const jakeB = simulate(p.start, p.months, () => 250);
  const mF = ease(frame, 4, Math.max(10, tFree - 4), 0, p.months);
  const at = (arr: number[]) => {
    const i = Math.floor(mF), k = mF - i;
    return i >= arr.length - 1 ? arr[arr.length - 1] : arr[i] + (arr[i + 1] - arr[i]) * k;
  };
  const mb = at(mikeB), jb = at(jakeB);
  const W = 700;
  const sFree = usePop(tFree), sOwe = usePop(tOwe);
  const Bar: React.FC<{ y: number; name: string; color: string; val: number; pulse?: number }> = ({ y, name, color, val, pulse = 1 }) => (
    <div style={{ position: "absolute", left: 90, right: 90, top: y, fontFamily: FONT, fontWeight: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 48, color: C.ink }}>
        <span style={{ color }}>{name}</span>
        <span style={{ scale: String(pulse), display: "inline-block" }}>{val <= 0.5 ? "$0" : money(val)}</span>
      </div>
      <div style={{ marginTop: 12, height: 64, width: W + 200, maxWidth: "100%", background: "#fff", border: `7px solid ${C.ink}`, borderRadius: 32, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(val / p.start) * 100}%`, background: color }} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.ink, color: C.yellow, fontFamily: FONT, fontWeight: 900, fontSize: 92, padding: "6px 44px", borderRadius: 26 }}>MONTH {Math.round(mF)}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.gray }}>DEBT LEFT</div>
      <Bar y={420} name="MIKE" color={C.red} val={mb} pulse={frame >= tOwe ? 1 + 0.08 * sOwe * Math.abs(Math.sin((frame - tOwe) / 5)) : 1} />
      <Bar y={600} name="JAKE" color={C.green} val={jb} />
      <Svg>
        <Ground />
        <Stickman x={290} y={GROUND_Y} pose={POSES[frame >= tOwe ? "facepalm" : "idle"]} color={characters.mike.color} name="MIKE" scale={0.7} mood={frame >= tOwe ? "sad" : "neutral"} />
        <Stickman x={790} y={GROUND_Y} pose={POSES[frame >= tFree ? "cheer" : "idle"]} color={characters.jake.color} name="JAKE" scale={0.7} mood={frame >= tFree ? "happy" : "neutral"} />
      </Svg>
      {frame >= tFree && (
        <div style={{ position: "absolute", left: 790, top: 790, translate: "-50% -50%", scale: String(sFree), rotate: "-6deg", border: `10px solid ${C.green}`, color: C.green, background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "4px 26px", fontFamily: FONT, fontWeight: 900, fontSize: 64, whiteSpace: "nowrap" }}>DEBT-FREE</div>
      )}
      <Sfx at={0} name="whoosh" />
      <Sfx at={tFree} name="ding" />
      <Sfx at={tOwe} name="thud" />
    </AbsoluteFill>
  );
};

export const SCENES7: Record<string, React.FC<SceneProps>> = {
  cardHook: CardHook,
  duo: Duo,
  debtRace: DebtRace,
};
