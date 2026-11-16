import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, GROUND_Y } from "./theme";
import { POSES, Stickman } from "./components/Stickman";
import { Bill, Book, Coin, Jar, Moth, Wallet, Ziggurat } from "./components/Objects";
import { ease, money, Stamp, Tag, Title, usePop } from "./components/ui";
import { Ground, moodAt, Sfx, Svg, usePoseTrack, useWords } from "./scenes";
import type { SceneProps } from "./types";

const BookHook: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const { bookTitle, year, title } = scene.props;
  const mike = characters.mike ?? Object.values(characters)[0];
  const tYear = w("100", 4), tBab = w("babylon", 40), tRule = w("rule", 70), tMost = w("most", 95), tWrong = w("wrong", 130);
  const sBook = usePop(0, 9), sZig = usePop(tBab), sMike = usePop(tMost);
  const pose = usePoseTrack([[0, "idle"], [tWrong, "shrug"]]);
  return (
    <AbsoluteFill>
      <Svg>
        <Ziggurat x={540} y={GROUND_Y} scale={1.3 * sZig} opacity={0.9} />
        <Ground />
        <Book x={350} y={800} scale={0.8 * sBook} title={bookTitle} rot={Math.sin(frame / 14) * 3 - 4} />
        {frame >= tMost && (
          <Stickman x={870} y={GROUND_Y} pose={pose} color={mike.color} scale={0.95 * sMike} mood={moodAt(frame, [[0, "neutral"], [tWrong, "shock"]])} />
        )}
      </Svg>
      <Tag x={200} y={500} at={tYear} text={year} bg={C.yellow} color={C.ink} size={70} rotate={8} />
      <Title text={title} at={tRule} y={210} size={104} />
      <Stamp x={790} y={520} at={tWrong} text="WRONG" />
      <Sfx at={0} name="whoosh" />
      <Sfx at={tYear} name="pop" />
      <Sfx at={tRule} name="ding" />
      <Sfx at={tWrong} name="thud" />
    </AbsoluteFill>
  );
};

const Payday: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const L = characters[scene.props.left], R = characters[scene.props.right];
  const tPaid = w("paid", 40);
  const pose = usePoseTrack([[0, "idle"], [tPaid, "cheer"]]);
  return (
    <AbsoluteFill>
      <Title text="PAYDAY" at={0} y={210} color={C.green} />
      <Svg>
        <Ground />
        <Stickman x={300} y={GROUND_Y} pose={pose} color={L.color} name={L.name} scale={1.2} mood="happy" />
        <Stickman x={780} y={GROUND_Y} pose={pose} color={R.color} name={R.name} scale={1.2} mood="happy" />
        {Array.from({ length: 12 }).map((_, i) => {
          const t = frame - tPaid - ((i * 7) % 20);
          if (t < 0) return null;
          const x = ((i * 389) % 1000) + 40;
          return <Bill key={i} x={x} y={-80 + t * 34} rot={t * (i % 2 ? 9 : -8)} s={0.8} />;
        })}
      </Svg>
      <Tag x={300} y={430} at={tPaid} text={scene.props.amount} bg={C.green} size={70} rotate={-4} />
      <Tag x={780} y={430} at={tPaid + 4} text={scene.props.amount} bg={C.green} size={70} rotate={4} />
      <Sfx at={tPaid} name="coin" />
      <Sfx at={tPaid + 4} name="ding" volume={0.5} />
    </AbsoluteFill>
  );
};

type Item = { word: string; label: string; amount: number };
const SpendAll: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const items = scene.props.items as Item[];
  const times = items.map((it, i) => w(it.word, 20 + i * 20));
  const tSave = w("save", 120);
  let val = scene.props.start as number;
  items.forEach((it, i) => (val -= ease(frame, times[i], times[i] + 8, 0, it.amount)));
  const pose = usePoseTrack([[0, "present"], [tSave, "pointUp"]]);
  const sThought = usePop(tSave);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 52, color: C.gray }}>MIKE'S PAYCHECK</div>
        <div style={{ fontSize: 140, color: val <= 0 ? C.red : C.green, letterSpacing: -4 }}>{money(Math.max(0, val))}</div>
      </div>
      <Svg>
        <Ground />
        <Stickman x={240} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.15} mood={moodAt(frame, [[0, "happy"], [tSave, "smug"]])} />
        {items.map((_, i) => {
          const t = frame - times[i];
          if (t < 0 || t > 10) return null;
          return <Bill key={i} x={interpolate(t, [0, 10], [300, 740])} y={interpolate(t, [0, 10], [820, 560 + i * 125])} rot={t * 20} s={0.7} />;
        })}
        {frame >= tSave && (
          <g transform={`translate(230,470) scale(${sThought})`}>
            <circle cx={-60} cy={110} r={12} fill="#fff" stroke={C.ink} strokeWidth={5} />
            <circle cx={-30} cy={70} r={20} fill="#fff" stroke={C.ink} strokeWidth={6} />
            <rect x={-10} y={-40} width={380} height={100} rx={50} fill="#fff" stroke={C.ink} strokeWidth={7} />
            <text x={180} y={25} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.ink}>
              {scene.props.thought}
            </text>
          </g>
        )}
      </Svg>
      {items.map((it, i) => (
        <Tag key={i} x={790} y={560 + i * 125} at={times[i] + 6} text={`${it.label} -$${it.amount.toLocaleString("en-US")}`} bg={C.red} size={44} rotate={i % 2 ? 3 : -3} />
      ))}
      {times.map((t, i) => (
        <Sfx key={i} at={t} name="pop" />
      ))}
      <Sfx at={tSave} name="whoosh" />
    </AbsoluteFill>
  );
};

const EmptyWallet: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const tNothing = w("nothing", 30), tEvery = w("every", 70);
  const open = ease(frame, tNothing - 6, tNothing + 4, 0, 1);
  const mt = frame - tNothing;
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <Wallet x={690} y={900} scale={1.1} open={open} />
        {mt > 0 && <Moth x={690 + Math.sin(mt / 6) * 120 + mt * 2} y={800 - mt * 7} flap={mt / 1.5} />}
        <Stickman x={230} y={GROUND_Y} pose={usePoseTrack([[0, "idle"], [tNothing, "sad"], [tEvery, "facepalm"]])} color={ch.color} name={ch.name} scale={1.15} mood={moodAt(frame, [[0, "neutral"], [tNothing, "sad"]])} />
      </Svg>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 52, color: C.gray }}>LEFT TO SAVE</div>
        <div style={{ fontSize: 170, color: C.red, letterSpacing: -4, scale: String(usePop(tNothing)) }}>$0</div>
      </div>
      <Tag x={690} y={1040} at={tEvery} text="EVERY MONTH" bg={C.ink} size={52} rotate={-3} />
      <Sfx at={tNothing} name="thud" />
      <Sfx at={tEvery} name="pop" />
    </AbsoluteFill>
  );
};

const TenPercent: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const tRule = w("rule", 30), tPart = w("part", 50), tBefore = w("before", 140), tTen = w("10%", 180), t300 = w("$300", 195);
  const sQuote = usePop(tPart, 13);
  const pose = usePoseTrack([[0, "idle"], [tPart, "pointUp"], [tTen, "pointRight"], [t300 + 10, "cheer"]]);
  const N = 10;
  const coinX = (i: number) => 160 + i * 84;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 170, scale: String(sQuote), background: "#F4E4C1", border: `7px solid ${C.ink}`, borderRadius: 20, padding: "26px 30px", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#5E2E14", lineHeight: 1.1, boxShadow: `0 10px 0 ${C.ink}` }}>
        {scene.props.quote}
      </div>
      <Svg>
        <Ground />
        <Jar x={820} y={GROUND_Y} fill={ease(frame, tTen + 16, tTen + 26, 0, 0.18)} label="JAKE" />
        {Array.from({ length: N }).map((_, i) => {
          const appear = tRule + i * 2;
          if (frame < appear) return null;
          const s = Math.min(1, (frame - appear) / 5);
          if (i === 0) {
            const k = ease(frame, tTen, tTen + 18, 0, 1);
            const x = interpolate(k, [0, 1], [coinX(0), 820]);
            const y = interpolate(k, [0, 1], [560, 980]) - Math.sin(k * Math.PI) * 260;
            if (k >= 1) return null;
            return (
              <g key={i}>
                {frame >= tBefore && <circle cx={x} cy={y} r={48} fill="none" stroke={C.green} strokeWidth={8} />}
                <Coin x={x} y={y} r={36 * s} spin={k * 8} />
              </g>
            );
          }
          const dim = ease(frame, tTen + 18, tTen + 26, 1, 0.35);
          return (
            <g key={i} opacity={dim}>
              <Coin x={coinX(i)} y={560} r={36 * s} />
            </g>
          );
        })}
        <Stickman x={230} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={1.1} mood={moodAt(frame, [[0, "neutral"], [tPart, "happy"]])} />
      </Svg>
      <Tag x={820} y={700} at={t300} text={scene.props.tag} bg={C.green} size={60} rotate={-4} />
      {frame >= tBefore && frame < tTen + 18 && (
        <div style={{ position: "absolute", left: coinX(0) - 60, top: 450, width: 120, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.green }}>10%</div>
      )}
      <Sfx at={tPart} name="whoosh" />
      <Sfx at={tRule} name="coin" volume={0.4} />
      <Sfx at={tTen + 18} name="coin" />
      <Sfx at={t300} name="ding" />
    </AbsoluteFill>
  );
};

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1},${y1} Z`;
};

const Pie: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const { big, bigLabel, small, smallLabel } = scene.props;
  const t90 = w(String(big), 20), tBarely = w("barely", 70);
  const sweep = ease(frame, 0, t90 + 6, 0, 1);
  const cx = 600, cy = 640, r = 290;
  const aBig = (big / 100) * Math.PI * 2 * sweep;
  const pop = usePop(t90 + 6);
  const off = 40 * pop;
  const mid = Math.PI * 2 * (1 - small / 200);
  return (
    <AbsoluteFill>
      <Svg>
        <Ground />
        <path d={arc(cx, cy, r, 0, Math.max(0.001, aBig))} fill="#D9D4CC" stroke={C.ink} strokeWidth={8} />
        {frame >= t90 && (
          <path d={arc(cx + Math.sin(mid) * off, cy - Math.cos(mid) * off, r, (big / 100) * Math.PI * 2, Math.PI * 2 - 0.0001)} fill={C.green} stroke={C.ink} strokeWidth={8} />
        )}
        <text x={cx + 30} y={cy + 110} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={C.ink} opacity={sweep}>
          {bigLabel} {big}%
        </text>
        <Stickman x={170} y={GROUND_Y} pose={usePoseTrack([[0, "idle"], [tBarely, "shrug"]])} color={ch.color} name={ch.name} scale={1.0} mood={moodAt(frame, [[0, "happy"], [tBarely, "smug"]])} />
      </Svg>
      <Tag x={cx - 150} y={cy - r - 10} at={t90 + 6} text={`${smallLabel} ${small}%`} bg={C.green} size={56} rotate={-6} />
      <Sfx at={0} name="whoosh" />
      <Sfx at={t90 + 6} name="pop" />
    </AbsoluteFill>
  );
};

const GoldWorks: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const ch = characters[scene.props.who];
  const gw: string[] | undefined = scene.props.genWords;
  const tRule = w(scene.props.titleWord ?? "rule", 6);
  const [tGold, tInv, tE1, tE2] = gw
    ? gw.map((x, i) => w(x, 10 + i * 30))
    : [w("gold", 30), w("invests", 80), w("earnings", 110), w("earning", 140, 1)];
  const gens = [
    { at: tGold, n: 1, y: 560, r: 46, sp: 0 },
    { at: tInv, n: 2, y: 720, r: 38, sp: 280 },
    { at: tE1, n: 4, y: 870, r: 32, sp: 150 },
    { at: tE2, n: 8, y: 1010, r: 26, sp: 82 },
  ];
  const cx = 620;
  const xs = (g: (typeof gens)[number]) => Array.from({ length: g.n }, (_, i) => cx + (i - (g.n - 1) / 2) * g.sp);
  const pose = usePoseTrack([[0, "idle"], [tGold, "pointRight"], [tE2, "cheer"]]);
  return (
    <AbsoluteFill>
      <Title text={scene.props.title} at={tRule} y={200} size={110} />
      <Tag x={540} y={400} at={tGold} text={scene.props.sub} bg={C.yellow} color={C.ink} size={60} rotate={-3} />
      <Svg>
        <Ground />
        {gens.map((g, gi) => {
          if (gi === 0 || frame < g.at) return null;
          const parent = gens[gi - 1];
          const px = xs(parent);
          const k = ease(frame, g.at, g.at + 8, 0, 1);
          return xs(g).map((x, i) => {
            const fx = px[Math.floor(i / 2)];
            return <line key={`${gi}-${i}`} x1={fx} y1={parent.y} x2={fx + (x - fx) * k} y2={parent.y + (g.y - parent.y) * k} stroke={C.green} strokeWidth={6} opacity={0.7} />;
          });
        })}
        {gens.map((g, gi) => {
          if (frame < g.at) return null;
          const k = ease(frame, g.at, g.at + 8, 0, 1);
          const px = gi ? xs(gens[gi - 1]) : [cx];
          const py = gi ? gens[gi - 1].y : g.y;
          return xs(g).map((x, i) => {
            const fx = px[Math.floor(i / 2)];
            return <Coin key={`${gi}-${i}`} x={fx + (x - fx) * k} y={py + (g.y - py) * k} r={g.r * (0.3 + 0.7 * k)} spin={frame / 6 + i} />;
          });
        })}
        <Stickman x={150} y={GROUND_Y} pose={pose} color={ch.color} name={ch.name} scale={0.95} mood="happy" />
      </Svg>
      {gens.map((g, i) => (
        <Sfx key={i} at={g.at} name={i === 3 ? "ding" : "coin"} volume={0.5} />
      ))}
    </AbsoluteFill>
  );
};

type Bar = { who: string; value: number };
const CompareBars: React.FC<SceneProps> = ({ scene, characters }) => {
  const frame = useCurrentFrame();
  const w = useWords(scene);
  const bars = scene.props.bars as Bar[];
  const max = Math.max(...bars.map((b) => b.value));
  const tWait = w("waiting", 20);
  const H = 620, bw = 170;
  const layout = [
    { man: 190, bar: 360 },
    { man: 650, bar: 820 },
  ];
  return (
    <AbsoluteFill>
      {scene.props.title && <Title text={scene.props.title} at={0} y={200} size={100} />}
      <Svg>
        <Ground />
        {bars.map((b, i) => {
          const ch = characters[b.who];
          const h = Math.max(10, ease(frame, 4 + i * 6, 24 + i * 6, 0, (b.value / max) * H));
          const min = Math.min(...bars.map((x) => x.value));
          const isMax = scene.props.lowerWins ? b.value === min : b.value === max;
          const suffix = scene.props.fmt === "mo" ? "/mo" : "";
          return (
            <g key={i}>
              <rect x={layout[i].bar - bw / 2} y={GROUND_Y - h} width={bw} height={h} fill={isMax ? C.green : C.red} stroke={C.ink} strokeWidth={8} />
              <text x={layout[i].bar} y={GROUND_Y - h - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={suffix ? 60 : isMax ? 78 : 70} fill={isMax ? C.green : C.red}>
                {money(ease(frame, 4 + i * 6, 24 + i * 6, 0, b.value))}{suffix}
              </text>
              <Stickman
                x={layout[i].man}
                y={GROUND_Y}
                pose={isMax ? POSES.cheer : frame >= tWait ? POSES.shrug : POSES.idle}
                color={ch.color}
                name={ch.name}
                scale={1.0}
                mood={isMax ? "happy" : "sad"}
              />
            </g>
          );
        })}
      </Svg>
      <Sfx at={4} name="whoosh" />
      <Sfx at={30} name="ding" volume={0.5} />
    </AbsoluteFill>
  );
};

export const SCENES2: Record<string, React.FC<SceneProps>> = {
  bookHook: BookHook,
  payday: Payday,
  spendAll: SpendAll,
  emptyWallet: EmptyWallet,
  tenPercent: TenPercent,
  pie: Pie,
  goldWorks: GoldWorks,
  compareBars: CompareBars,
};
