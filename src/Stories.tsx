import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./theme";
import { POSES, Stickman } from "./components/Stickman";
import { Bill, Car, Coin, Jar, Wallet } from "./components/Objects";

// Instagram stories 1080x1920. Keep content between y=230 and y=1680 (IG UI zones).
const CAT = {
  START: { color: "#2E8B57", label: "START HERE" },
  RULES: { color: C.blue, label: "MONEY RULES" },
  CALC: { color: "#8B5CF6", label: "SAVE THIS" },
  MYTHS: { color: C.red, label: "MYTH vs FACT" },
  QUIZ: { color: "#F59E0B", label: "QUIZ" },
} as const;
type Cat = keyof typeof CAT;

const MIKE = "#E5484D", JAKE = "#2E8B57";

const Frame: React.FC<{ cat: Cat; page?: string; children: React.ReactNode }> = ({ cat, page, children }) => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, fontWeight: 900, color: C.ink }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <circle cx={140} cy={520} r={260} fill="#FFE7B8" />
      <circle cx={980} cy={1200} r={320} fill="#FFE7B8" />
      <circle cx={540} cy={1880} r={420} fill="#FFEFD0" />
    </svg>
    <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: CAT[cat].color, color: "#fff", fontSize: 40, padding: "10px 30px", borderRadius: 40, border: `6px solid ${C.ink}`, letterSpacing: 2 }}>
        {CAT[cat].label}
        {page ? `  ·  ${page}` : ""}
      </div>
    </div>
    {children}
    <div style={{ position: "absolute", bottom: 250, left: 0, right: 0, textAlign: "center", fontSize: 34, color: "#B9A88A", letterSpacing: 4 }}>
      STICK<span style={{ color: "#8FB89C" }}>ONOMICS</span>
    </div>
  </AbsoluteFill>
);

const H: React.FC<{ children: React.ReactNode; top?: number; size?: number; color?: string }> = ({ children, top = 340, size = 100, color = C.ink }) => (
  <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", fontSize: size, lineHeight: 1.02, letterSpacing: -3, color }}>{children}</div>
);

const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; rot?: number }> = ({ children, bg = C.yellow, color = C.ink, size = 64, rot = -2 }) => (
  <span style={{ display: "inline-block", background: bg, color, fontSize: size, padding: `${size * 0.12}px ${size * 0.4}px`, borderRadius: size * 0.3, border: `7px solid ${C.ink}`, rotate: `${rot}deg`, boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>
    {children}
  </span>
);

const Card: React.FC<{ top: number; children: React.ReactNode; bg?: string; h?: number }> = ({ top, children, bg = "#fff", h }) => (
  <div style={{ position: "absolute", top, left: 80, right: 80, height: h, background: bg, border: `7px solid ${C.ink}`, borderRadius: 32, padding: "34px 44px", boxSizing: "border-box", boxShadow: `0 12px 0 ${C.ink}` }}>{children}</div>
);

const Row: React.FC<{ l: React.ReactNode; r: React.ReactNode; color?: string; size?: number }> = ({ l, r, color = C.ink, size = 50 }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: size, margin: "14px 0", color }}>
    <span>{l}</span>
    <span>{r}</span>
  </div>
);

const Fig: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 0 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, top }}>
    {children}
  </svg>
);

// ---------- START ----------
const S01 = () => (
  <Frame cat="START" page="1/2">
    <H top={340}>HI, WE'RE</H>
    <H top={450} size={130}>
      <span style={{ color: MIKE }}>MIKE</span> & <span style={{ color: JAKE }}>JAKE</span>
    </H>
    <Fig>
      <Stickman x={310} y={1150} pose={POSES.shrug} mood="sad" color={MIKE} name="MIKE" scale={1.1} />
      <Stickman x={770} y={1150} pose={POSES.cheer} mood="happy" color={JAKE} name="JAKE" scale={1.1} />
    </Fig>
    <div style={{ position: "absolute", top: 1220, left: 60, right: 60, display: "flex", justifyContent: "space-between", fontSize: 40, textAlign: "center" }}>
      <div style={{ width: 440 }}>
        <Pill bg={MIKE} color="#fff" size={40} rot={-3}>SPENDS IT ALL</Pill>
      </div>
      <div style={{ width: 440 }}>
        <Pill bg={JAKE} color="#fff" size={40} rot={3}>BUILDS WEALTH</Pill>
      </div>
    </div>
    <H top={1400} size={56}>
      SAME SALARY.
      <br />
      VERY DIFFERENT LIVES.
    </H>
  </Frame>
);

const S02 = () => (
  <Frame cat="START" page="2/2">
    <H>WHAT YOU'LL GET HERE</H>
    <Card top={600}>
      {["1 MONEY STORY A DAY", "SIMPLE MATH, NO JARGON", "TRAPS TO AVOID", "RULES YOU CAN USE TODAY"].map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 52, margin: "26px 0" }}>
          <svg width={64} height={64} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
            <rect x={2} y={2} width={36} height={36} rx={8} fill={JAKE} stroke={C.ink} strokeWidth={3} />
            <path d="M10,21 L17,28 L31,12" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t}
        </div>
      ))}
    </Card>
    <div style={{ position: "absolute", top: 1330, left: 0, right: 0, textAlign: "center" }}>
      <Pill size={60}>TURN ON NOTIFICATIONS</Pill>
    </div>
    <H top={1480} size={44} color="#7A6E5A">
      NOT FINANCIAL ADVICE. JUST MONEY STORIES.
    </H>
  </Frame>
);

// ---------- RULES ----------
const S03 = () => (
  <Frame cat="RULES" page="1/3">
    <H>PAY YOURSELF</H>
    <div style={{ position: "absolute", top: 460, left: 0, right: 0, textAlign: "center" }}>
      <Pill size={120}>FIRST</Pill>
    </div>
    <Fig>
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i} opacity={i === 0 ? 1 : 0.35}>
          <Coin x={130 + i * 91} y={800} r={38} />
        </g>
      ))}
      <path d="M130,850 Q160,980 330,1020" fill="none" stroke={JAKE} strokeWidth={10} strokeLinecap="round" />
      <Jar x={420} y={1250} fill={0.3} label="YOU" />
      <Stickman x={800} y={1250} pose={POSES.pointLeft} mood="happy" color={JAKE} name="JAKE" scale={0.95} />
    </Fig>
    <H top={1320} size={52}>
      PAYDAY? MOVE <span style={{ color: JAKE }}>10%</span> TO SAVINGS
      <br />
      BEFORE ANY BILL.
    </H>
    <H top={1510} size={38} color="#7A6E5A">
      "SAVE WHAT'S LEFT" = SAVE NOTHING.
    </H>
  </Frame>
);

const S04 = () => {
  const rows = [
    ["NEEDS", 50, C.blue, "RENT, FOOD, BILLS"],
    ["WANTS", 30, "#F59E0B", "FUN, EATING OUT"],
    ["SAVE", 20, JAKE, "INVEST, PAY DEBT"],
  ] as const;
  return (
    <Frame cat="RULES" page="2/3">
      <H>THE 50 / 30 / 20</H>
      <H top={450} size={56} color="#7A6E5A">
        SIMPLE BUDGET THAT WORKS
      </H>
      <Card top={600}>
        {rows.map(([l, p, col, d], i) => (
          <div key={i} style={{ margin: "18px 0 34px" }}>
            <Row l={l} r={`${p}%`} color={C.ink} size={58} />
            <div style={{ height: 48, background: "#F2EBDD", border: `5px solid ${C.ink}`, borderRadius: 24, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${p * 1.6}%`, background: col }} />
            </div>
            <div style={{ fontSize: 34, color: "#7A6E5A", marginTop: 10 }}>{d}</div>
          </div>
        ))}
      </Card>
      <H top={1410} size={46}>
        EARN $3,000? → $1,500 / $900 / <span style={{ color: JAKE }}>$600</span>
      </H>
    </Frame>
  );
};

const S05 = () => (
  <Frame cat="RULES" page="3/3">
    <H size={88}>EMERGENCY FUND</H>
    <H top={450} size={56} color="#7A6E5A">
      BEFORE YOU INVEST A CENT
    </H>
    <div style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center" }}>
      <Pill size={90} bg={C.blue} color="#fff">
        3–6 MONTHS
      </Pill>
    </div>
    <H top={760} size={48}>
      OF YOUR MONTHLY EXPENSES
    </H>
    <Card top={880}>
      <Row l="SPEND / MONTH" r="$2,000" />
      <Row l="× 3 MONTHS" r="$6,000" color={C.blue} />
      <Row l="× 6 MONTHS" r="$12,000" color={JAKE} />
    </Card>
    <Fig>
      <Wallet x={540} y={1400} scale={0.7} open={0.4} />
    </Fig>
    <H top={1560} size={38} color="#7A6E5A">
      KEEP IT IN A HIGH-YIELD SAVINGS ACCOUNT.
    </H>
  </Frame>
);

// ---------- CALC ----------
const S06 = () => (
  <Frame cat="CALC" page="1/3">
    <H>RULE OF 72</H>
    <H top={450} size={52} color="#7A6E5A">
      HOW FAST DOES MONEY DOUBLE?
    </H>
    <div style={{ position: "absolute", top: 580, left: 0, right: 0, textAlign: "center" }}>
      <Pill size={84}>72 ÷ RETURN = YEARS</Pill>
    </div>
    <Card top={780}>
      <Row l="RETURN / YEAR" r="DOUBLES IN" color="#7A6E5A" size={38} />
      <Row l="4%" r="18 YEARS" />
      <Row l="6%" r="12 YEARS" />
      <Row l="8%" r="9 YEARS" color={JAKE} />
      <Row l="10%" r="~7 YEARS" color={JAKE} />
    </Card>
    <H top={1360} size={44}>
      ALSO WORKS FOR DEBT:
      <br />
      <span style={{ color: MIKE }}>24% CARD = DEBT x2 IN 3 YEARS</span>
    </H>
  </Frame>
);

const S07 = () => (
  <Frame cat="CALC" page="2/3">
    <H>RENT OR BUY?</H>
    <H top={450} size={52} color="#7A6E5A">
      THE 5% RULE
    </H>
    <div style={{ position: "absolute", top: 570, left: 0, right: 0, textAlign: "center", fontSize: 84, lineHeight: 1.15 }}>
      HOME PRICE
      <br />× 5% ÷ 12
    </div>
    <Card top={820}>
      <Row l="HOME" r="$300,000" />
      <Row l="× 5% ÷ 12" r="$1,250/mo" color={MIKE} />
      <div style={{ borderTop: `5px dashed ${C.ink}`, margin: "20px 0" }} />
      <div style={{ fontSize: 44, lineHeight: 1.25 }}>
        RENT <span style={{ color: JAKE }}>BELOW $1,250</span>?
        <br />
        RENTING ISN'T WASTED MONEY.
      </div>
    </Card>
    <H top={1400} size={36} color="#7A6E5A">
      5% = TAX 1% + REPAIRS 1% + INTEREST & LOST RETURNS 3%.
      <br />
      ROUGH RULE OF THUMB.
    </H>
  </Frame>
);

const S08 = () => (
  <Frame cat="CALC" page="3/3">
    <H>SMALL LEAKS</H>
    <H top={450} size={52} color="#7A6E5A">
      WHAT $5 A DAY REALLY COSTS
    </H>
    <Card top={600}>
      <Row l="$5 / DAY" r="$1,825 / YEAR" />
      <Row l="10 YEARS" r="$18,250" color="#7A6E5A" />
      <div style={{ borderTop: `5px dashed ${C.ink}`, margin: "20px 0" }} />
      <div style={{ fontSize: 42, color: "#7A6E5A" }}>INVESTED 30 YEARS AT ~8%:</div>
      <div style={{ fontSize: 110, color: JAKE, letterSpacing: -3 }}>$206,742</div>
    </Card>
    <Fig>
      <Bill x={250} y={1300} rot={-12} s={1.3} />
      <Bill x={540} y={1340} rot={6} s={1.3} />
      <Bill x={830} y={1300} rot={14} s={1.3} />
    </Fig>
    <H top={1440} size={42}>
      NOT "NEVER BUY COFFEE".
      <br />
      JUST KNOW THE PRICE.
    </H>
  </Frame>
);

// ---------- MYTHS ----------
const Myth: React.FC<{ page: string; myth: string; fact: React.ReactNode; fig: React.ReactNode }> = ({ page, myth, fact, fig }) => (
  <Frame cat="MYTHS" page={page}>
    <div style={{ position: "absolute", top: 360, left: 80, right: 80, background: "#FFE1E1", border: `7px solid ${C.ink}`, borderRadius: 30, padding: "30px 40px" }}>
      <div style={{ fontSize: 44, color: MIKE }}>MYTH</div>
      <div style={{ fontSize: 54, lineHeight: 1.08, marginTop: 8, textDecoration: "line-through", textDecorationColor: MIKE, textDecorationThickness: 5 }}>{myth}</div>
    </div>
    <Fig>{fig}</Fig>
    <div style={{ position: "absolute", top: 1170, left: 80, right: 80, background: "#DFF5E6", border: `7px solid ${C.ink}`, borderRadius: 30, padding: "30px 40px", boxShadow: `0 12px 0 ${C.ink}` }}>
      <div style={{ fontSize: 44, color: JAKE }}>FACT</div>
      <div style={{ fontSize: 54, lineHeight: 1.1, marginTop: 8 }}>{fact}</div>
    </div>
  </Frame>
);

const S09 = () => (
  <Myth
    page="1/3"
    myth={`"RENTING IS THROWING MONEY AWAY"`}
    fact={<>OWNERS "THROW AWAY" ~5% OF THE HOME PRICE A YEAR TOO: TAX, REPAIRS, INTEREST.</>}
    fig={<Stickman x={540} y={1100} pose={POSES.shrug} mood="neutral" color={JAKE} name="JAKE" scale={0.95} />}
  />
);
const S10 = () => (
  <Myth
    page="2/3"
    myth={`"I'LL SAVE WHAT'S LEFT"`}
    fact={<>THERE'S NEVER ANYTHING LEFT. SAVE FIRST, SPEND WHAT'S LEFT.</>}
    fig={
      <>
        <Wallet x={720} y={930} scale={0.7} open={1} />
        <Stickman x={300} y={1100} pose={POSES.facepalm} mood="sad" color={MIKE} name="MIKE" scale={0.95} />
      </>
    }
  />
);
const S11 = () => (
  <Myth
    page="3/3"
    myth={`"70% OFF = I SAVED MONEY"`}
    fact={<>NOT ON YOUR LIST? THEN IT'S NOT A DEAL. IT'S SPENDING.</>}
    fig={
      <>
        <Car x={700} y={1100} scale={0.6} color={MIKE} />
        <Stickman x={290} y={1100} pose={POSES.cheer} mood="happy" color={MIKE} name="MIKE" scale={0.95} />
      </>
    }
  />
);

// ---------- QUIZ (leave space for an IG poll sticker) ----------
const S12 = () => (
  <Frame cat="QUIZ" page="1/2">
    <H>WHICH ONE?</H>
    <div style={{ position: "absolute", top: 520, left: 80, width: 430, height: 380, background: "#FFE1E1", border: `7px solid ${C.ink}`, borderRadius: 30, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 66, color: MIKE, letterSpacing: -2 }}>$1,000,000</div>
      <div style={{ fontSize: 40 }}>RIGHT NOW</div>
    </div>
    <div style={{ position: "absolute", top: 520, right: 80, width: 430, height: 380, background: "#DFF5E6", border: `7px solid ${C.ink}`, borderRadius: 30, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 110, color: JAKE }}>1¢</div>
      <div style={{ fontSize: 36, textAlign: "center" }}>DOUBLED DAILY
        <br />
        FOR 30 DAYS</div>
    </div>
    <div style={{ position: "absolute", top: 655, left: 470, width: 140, height: 140, borderRadius: 70, background: C.ink, color: C.yellow, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center", border: `7px solid ${C.yellow}` }}>VS</div>
    <H top={1000} size={48} color="#7A6E5A">
      VOTE BELOW. ANSWER IN NEXT STORY.
    </H>
  </Frame>
);

const S13 = () => (
  <Frame cat="QUIZ" page="2/2">
    <H>THE ANSWER</H>
    <H top={460} size={56} color="#7A6E5A">
      THE PENNY ON DAY 30:
    </H>
    <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center" }}>
      <Pill size={110} bg={JAKE} color="#fff">
        $5,368,709
      </Pill>
    </div>
    <Card top={790}>
      <Row l="DAY 10" r="$5.12" />
      <Row l="DAY 20" r="$5,243" />
      <Row l="DAY 27" r="$671,089" />
      <Row l="DAY 28" r="$1,342,177" color={JAKE} />
      <Row l="DAY 30" r="$5,368,709" color={JAKE} />
    </Card>
    <H top={1440} size={46}>
      COMPOUNDING IS SLOW... THEN SUDDEN.
      <br />
      <span style={{ color: MIKE }}>MOST PEOPLE QUIT ON DAY 20.</span>
    </H>
  </Frame>
);

const S14 = () => (
  <Frame cat="QUIZ">
    <H size={88}>HONEST QUESTION</H>
    <H top={520} size={84}>
      WHAT % OF YOUR PAYCHECK DO YOU SAVE?
    </H>
    <Fig>
      <Jar x={540} y={1180} fill={0.45} label="?" />
    </Fig>
    <H top={1300} size={44} color="#7A6E5A">
      ANSWER WITH THE SLIDER. NO JUDGEMENT.
    </H>
  </Frame>
);

export const STORIES: [string, React.FC][] = [
  ["01-start-hi", S01],
  ["02-start-what", S02],
  ["03-rules-pay-first", S03],
  ["04-rules-50-30-20", S04],
  ["05-rules-emergency", S05],
  ["06-calc-rule-72", S06],
  ["07-calc-5-percent", S07],
  ["08-calc-small-leaks", S08],
  ["09-myth-renting", S09],
  ["10-myth-save-left", S10],
  ["11-myth-sale", S11],
  ["12-quiz-penny", S12],
  ["13-quiz-answer", S13],
  ["14-quiz-save-rate", S14],
];

// ---------- Highlight covers (IG shows the centre circle) ----------
const Cover: React.FC<{ cat: Cat; label: string; children: React.ReactNode }> = ({ cat, label, children }) => (
  <AbsoluteFill style={{ background: CAT[cat].color }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <circle cx={540} cy={960} r={400} fill={C.bg} stroke={C.ink} strokeWidth={22} />
      {children}
    </svg>
    <div style={{ position: "absolute", top: 1420, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 90, color: "#fff", letterSpacing: 4 }}>{label}</div>
  </AbsoluteFill>
);

const BigText: React.FC<{ t: string; y?: number; size?: number; color?: string }> = ({ t, y = 1040, size = 260, color = C.ink }) => (
  <text x={540} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color}>
    {t}
  </text>
);

export const COVERS: [string, React.FC][] = [
  ["cover-start", () => (
    <Cover cat="START" label="START">
      <Stickman x={540} y={1250} pose={POSES.wave} mood="happy" color={JAKE} scale={1.25} />
    </Cover>
  )],
  ["cover-rules", () => (
    <Cover cat="RULES" label="RULES">
      <BigText t="10%" size={230} color={C.blue} />
    </Cover>
  )],
  ["cover-calc", () => (
    <Cover cat="CALC" label="CALC">
      <BigText t="÷ ×" size={280} color="#8B5CF6" y={1060} />
    </Cover>
  )],
  ["cover-myths", () => (
    <Cover cat="MYTHS" label="MYTHS">
      <path d="M380,800 L700,1120 M700,800 L380,1120" stroke={MIKE} strokeWidth={70} strokeLinecap="round" />
    </Cover>
  )],
  ["cover-quiz", () => (
    <Cover cat="QUIZ" label="QUIZ">
      <BigText t="?" size={480} color="#F59E0B" y={1130} />
    </Cover>
  )],
];

