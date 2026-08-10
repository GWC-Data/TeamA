import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from "recharts"


const BEFORE_AFTER = [
  ["Turnaround",         "Days, across multiple branch visits",  "Same day — around 1 hour to approval"],
  ["Document collection","Manual chasing by branch staff",        "Automated follow-up until the set is complete"],
  ["Case file",          "Raw, scattered documents",             "Verified, structured case file"],
  ["Verification",       "Manual, one document at a time",       "Automated cross-document checks"],
  ["Analysis",           "Sequential, one analyst at a time",    "Four analytical agents in parallel"],
  ["Human effort",       "Multiple touchpoints per file",        "One decision point per file"],
]

const TAT_TREND = [
  { w: "W1", manual: 74, agent: 3.4 }, { w: "W2", manual: 74, agent: 2.8 },
  { w: "W3", manual: 74, agent: 2.2 }, { w: "W4", manual: 74, agent: 1.9 },
  { w: "W5", manual: 74, agent: 1.5 }, { w: "W6", manual: 74, agent: 1.2 },
  { w: "W7", manual: 74, agent: 1.0 }, { w: "W8", manual: 74, agent: 0.97 },
]

const HOURS_PER_STEP = [
  { step: "Doc chasing",   manual: 41, agent: 0.2  },
  { step: "Verification",  manual: 18, agent: 0.3  },
  { step: "Analysis",      manual: 9,  agent: 0.1  },
  { step: "Memo writing",  manual: 5,  agent: 0.05 },
  { step: "Human decision",manual: 1,  agent: 0.4  },
]

const KPIS = [
  {
    agent: "Underwriting Co-Pilot",
    items: [
      { k: "TAT per file",                                   v: "58 min",  sub: "target ~1 hour" },
      { k: "% files auto-summarised without manual rework",  v: "84%"      },
      { k: "Underwriter time saved",                         v: "31 min / file" },
      { k: "Approval accuracy vs manual baseline",           v: "+4.2 pts" },
    ],
  },
  {
    agent: "Document Collection",
    items: [
      { k: "Avg days to complete document set",              v: "0.4 days", sub: "baseline 3.1 days" },
      { k: "% files completed without human follow-up",      v: "72%"      },
      { k: "Reminder response rate",                         v: "68%"      },
      { k: "Drop-off rate",                                  v: "9%",       sub: "baseline 21%" },
    ],
  },
  {
    agent: "Fraud Detection",
    items: [
      { k: "Fraud detection rate",                           v: "93%"  },
      { k: "False positive rate",                            v: "6.1%" },
      { k: "Manual verification time saved",                 v: "18 min / file" },
      { k: "Duplicate cases caught",                         v: "37 this month" },
    ],
  },
  {
    agent: "Alt-Data Credit Score",
    items: [
      { k: "Approval rate uplift for thin-file segment",     v: "+11.4%" },
      { k: "Default rate vs bureau-only baseline",           v: "−0.8 pts" },
      { k: "Model AUC",                                      v: "0.79" },
      { k: "Model Gini",                                     v: "0.58" },
    ],
  },
  {
    agent: "Income Estimation",
    items: [
      { k: "Variance vs actual repayment capacity",          v: "±7.2%" },
      { k: "Loan sizing accuracy",                           v: "88%"   },
      { k: "Reduction in income-related rejections",         v: "−23%"  },
    ],
  },
  {
    agent: "Collateral Valuation",
    items: [
      { k: "Valuation turnaround time",                      v: "42 sec", sub: "baseline 25 min" },
      { k: "Variance vs final appraiser value",              v: "±3.1%" },
      { k: "Consistency across branches",                    v: "±2.4% spread" },
    ],
  },
  {
    agent: "Exposure Check",
    items: [
      { k: "% applications flagged for over-exposure",       v: "14.6%"   },
      { k: "Reduction in early-default rate",                v: "−1.9 pts"},
      { k: "False flag rate",                                v: "4.8%"    },
    ],
  },
]

const AXIS = {
  tick: { fontSize: 10, fill: "var(--color-muted-foreground)" },
  axisLine: { stroke: "var(--color-border)" },
  tickLine: false as const,
}

const TIP = {
  contentStyle: {
    border: "1px solid var(--color-border)",
    borderRadius: 4,
    fontSize: 11,
    padding: "6px 8px",
    background: "var(--color-card)",
    color: "var(--color-foreground)",
  },
}


export function AnalyticsPage() {
  return (
    <div className="space-y-4">

      {}
      <div className="rounded border border-border/70 bg-background/70 p-4">
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          Before and after
        </p>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/70 text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="pb-2 pr-4 font-medium">Dimension</th>
              <th className="pb-2 pr-4 font-medium">Today</th>
              <th className="pb-2 font-medium">With the agent suite</th>
            </tr>
          </thead>
          <tbody>
            {BEFORE_AFTER.map(([d, a, b]) => (
              <tr key={d} className="border-b border-border/50 last:border-0">
                <td className="py-2.5 pr-4 font-medium text-foreground">{d}</td>
                <td className="py-2.5 pr-4 text-muted-foreground">{a}</td>
                <td className="py-2.5 text-emerald-700 dark:text-emerald-400">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Time to approval, by week of rollout
            </p>
            <div style={{ height: 190 }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TAT_TREND} margin={{ top: 6, right: 10, bottom: 0, left: -12 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="w" {...AXIS} />
                  <YAxis scale="log" domain={[0.5, 100]} ticks={[1, 10, 100]} {...AXIS}
                    tickFormatter={(v: number) => `${v}h`} />
                  <Tooltip {...TIP} formatter={(v: any, n: any) =>
                    [`${v} hours`, n === "manual" ? "Manual process" : "Agent suite"]} />
                  <ReferenceLine y={1} stroke="#059669" strokeDasharray="4 3"
                    label={{ value: "1 hour target", position: "insideBottomRight", fontSize: 9, fill: "#059669" }} />
                  <Line type="monotone" dataKey="manual" stroke="var(--color-muted-foreground)" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="agent"  stroke="var(--color-primary)"          strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 flex gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-muted-foreground" />Manual process
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-primary" />Agent suite
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Where the hours go, per file
            </p>
            <div style={{ height: 190 }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HOURS_PER_STEP} margin={{ top: 6, right: 8, bottom: 0, left: -14 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="step" {...AXIS} interval={0} angle={-18} textAnchor="end" height={44} />
                  <YAxis {...AXIS} tickFormatter={(v: number) => `${v}h`} />
                  <Tooltip {...TIP} formatter={(v: any, n: any) =>
                    [`${v} hours`, n === "manual" ? "Today" : "Agent suite"]}
                    cursor={{ fill: "var(--color-secondary)" }} />
                  <Bar dataKey="manual" fill="var(--color-muted-foreground)" radius={[3, 3, 0, 0]} barSize={14} isAnimationActive={false} />
                  <Bar dataKey="agent"  fill="#059669"                       radius={[3, 3, 0, 0]} barSize={14} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 flex gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-3 rounded-sm bg-muted-foreground" />Today
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-3 rounded-sm bg-emerald-600" />Agent suite
              </span>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="grid gap-4 lg:grid-cols-2">
        {KPIS.map(g => (
          <div key={g.agent} className="rounded border border-border/70 bg-background/70 p-4">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
              {g.agent}
            </p>
            <ul className="space-y-2.5">
              {g.items.map(i => (
                <li key={i.k} className="flex items-baseline justify-between gap-4 border-b border-dashed border-border/70 pb-2 last:border-0">
                  <div>
                    <div className="text-xs text-foreground/80">{i.k}</div>
                    {"sub" in i && i.sub && <div className="text-[10px] text-muted-foreground">{i.sub}</div>}
                  </div>
                  <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{i.v}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
