import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { cn } from "@/lib/utils"
import { PipelineView, type SectionKey } from "./pipeline-view"
import type { SimState, Stages, DecisionState } from "@/lib/sim"
import { T } from "@/lib/sim"


const KPI_CARDS = [
  { label: "Files in pipeline",         value: "128",   delta: "+12 today",              tone: "slate", spark: [88, 94, 91, 103, 110, 119, 128] },
  { label: "Average TAT",               value: "58 min",delta: "31 min saved per file",   tone: "green", spark: [204, 168, 132, 114, 88, 71, 58]  },
  { label: "Awaiting human decision",   value: "9",     delta: "3 past SLA",              tone: "amber", spark: [4, 6, 5, 8, 7, 11, 9]            },
  { label: "Flagged for over-exposure", value: "14.6%", delta: "of files this week",      tone: "amber", spark: [11.2, 12.0, 13.4, 12.8, 14.1, 13.9, 14.6] },
]


const FUNNEL = [
  { stage: "Submitted",    n: 128 }, { stage: "Docs complete", n: 116 },
  { stage: "Verified",     n: 111 }, { stage: "Analysed",      n: 108 },
  { stage: "Memo ready",   n: 104 }, { stage: "Decided",       n: 95  },
]


function Spark({ data, color }: { data: number[]; color: string }) {
  const d = data.map((v, i) => ({ i, v }))
  const id = `sp-${color.replace(/[^a-z0-9]/gi, "")}`
  return (
    <div className="h-9 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={d} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${id})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}


const TONE_COLOR: Record<string, string> = {
  slate: "var(--color-primary)",
  green: "#059669",
  amber: "#f59e0b",
  red:   "#e11d48",
}

function StatCard({ label, value, delta, tone, spark }: typeof KPI_CARDS[0]) {
  const color = TONE_COLOR[tone] ?? TONE_COLOR.slate
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
      }}
      className="rounded border border-border/70 bg-background/70 p-3 shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
    >
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-2xl font-semibold tabular-nums text-foreground">{value}</div>
      <div className="text-[11px]" style={{ color }}>{delta}</div>
      {spark && <div className="mt-1"><Spark data={spark} color={color} /></div>}
    </motion.div>
  )
}


type Props = {
  data: any
  sim: SimState
  stages: Stages
  onOpenSection: (view: SectionKey) => void
  decision: DecisionState
}

export function OverviewDashboard({ data, sim, stages, onOpenSection, decision }: Props) {
  const { elapsed: e, loaded, running } = sim

  const pipelineChipLabel =
    decision                        ? "Decided" :
    stages.human === "review"       ? "Awaiting decision" :
    running                         ? "Executing" :
    loaded                          ? "Idle" :
                                      "Not started"

  const pipelineChipCls =
    decision                        ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
    stages.human === "review"       ? "border-foreground/20 bg-foreground/10 text-foreground" :
    running                         ? "border-primary/20 bg-primary/10 text-primary" :
                                      "border-border/70 bg-background text-muted-foreground"

  return (
    <div className="space-y-4">

      {}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border/70 bg-background/70 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Underwriting Control Center</p>
          <p className="text-xs text-muted-foreground">
            One pipeline: collect, verify, analyse in parallel, consolidate, then hand to a human.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={sim.load} disabled={loaded}>
            Load demo application
          </Button>
          <Button size="sm" onClick={sim.start} disabled={running}>
            {e > 0 && e < T.end ? "Resume underwriting" : "Run underwriting"}
          </Button>
          <Button variant="outline" size="sm" onClick={sim.jumpToEnd} disabled={!loaded || e >= T.end}>
            Skip to end
          </Button>
          <Button variant="ghost" size="sm" onClick={sim.reset}>
            Reset
          </Button>
        </div>
      </div>

      {}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {KPI_CARDS.map(k => <StatCard key={k.label} {...k} />)}
      </motion.div>

      {}
      {!loaded ? (
        <div className="rounded border border-dashed border-border/70 bg-background/70 p-10 text-center">
          <p className="text-sm font-semibold text-foreground">No application loaded</p>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            Load the synthetic demo case (APP-10021, Gold Loan, ₹3,00,000) to watch the full
            underwriting pipeline run end to end.
          </p>
          <div className="mt-4 flex justify-center">
            <Button onClick={sim.load}>Load demo application</Button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          className="grid gap-4 lg:grid-cols-[1fr_300px]"
        >

          {}
          <div className="rounded border border-border/70 bg-background/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                Underwriting pipeline
              </p>
              <span className={cn("rounded border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide", pipelineChipCls)}>
                {pipelineChipLabel}
              </span>
            </div>
            <PipelineView
              sim={sim}
              stages={stages}
              decision={decision}
              onNavigate={onOpenSection}
              embedded
            />
          </div>

          {}
          <div className="space-y-4">

            {}
            <div className="rounded border border-border/70 bg-background/70 p-4">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                Needs attention
              </p>
              <ul className="space-y-2.5 text-xs">
                {stages.exposure === "warning" && (
                  <li className="rounded border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-800/60 dark:bg-amber-950/30">
                    <p className="font-medium text-amber-800 dark:text-amber-400">Over-exposure detected</p>
                    <p className="mt-0.5 text-amber-700 dark:text-amber-500">
                      Total outstanding ₹8.4L against ₹6.0L threshold, across 4 lenders.
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenSection("exposure")}
                      className="mt-1.5 text-[11px] font-medium underline underline-offset-2 text-amber-700 dark:text-amber-400"
                    >
                      Open exposure analysis →
                    </button>
                  </li>
                )}
                {stages.fraud !== "waiting" && (
                  <li className="rounded border border-border/70 bg-card/80 p-2.5">
                    <p className="font-medium text-foreground">1 fraud check flagged then cleared</p>
                    <p className="mt-0.5 text-muted-foreground">
                      Tampering check raised a font inconsistency on Form 16.
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenSection("fraud")}
                      className="mt-1.5 text-[11px] font-medium underline underline-offset-2 text-primary"
                    >
                      Open fraud review →
                    </button>
                  </li>
                )}
                {stages.human === "review" && !decision && (
                  <li className="rounded border border-foreground/30 p-2.5">
                    <p className="font-medium text-foreground">Underwriter decision required</p>
                    <p className="mt-0.5 text-muted-foreground">
                      The credit memo is ready. AI recommends REFER at 87% confidence.
                    </p>
                    <Button size="sm" className="mt-2" onClick={() => onOpenSection("memo")}>
                      Review credit memo
                    </Button>
                  </li>
                )}
                {decision && (
                  <li className="rounded border border-emerald-200 bg-emerald-50 p-2.5 dark:border-emerald-800/60 dark:bg-emerald-950/30">
                    <p className="font-medium text-emerald-800 dark:text-emerald-400">
                      Decision recorded — {decision.action}
                    </p>
                    <p className="mt-0.5 text-emerald-700 dark:text-emerald-500">
                      Logged to audit trail at {decision.time}.
                    </p>
                  </li>
                )}
                {stages.human === "waiting" && !decision && stages.copilot !== "done" && (
                  <li className="rounded border border-border/70 p-2.5 text-muted-foreground">
                    Nothing to action yet. Agents are still running.
                  </li>
                )}
              </ul>
            </div>

            {}
            <div className="rounded border border-border/70 bg-background/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Stage throughput
                </p>
                <span className="text-[11px] text-muted-foreground">last 7 days</span>
              </div>
              <div style={{ height: 150 }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={FUNNEL} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
                    <CartesianGrid horizontal={false} stroke="var(--color-border)" />
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="stage"
                      width={82}
                      tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        border: "1px solid var(--color-border)",
                        borderRadius: 4,
                        fontSize: 11,
                        padding: "6px 8px",
                        background: "var(--color-card)",
                        color: "var(--color-foreground)",
                      }}
                      cursor={{ fill: "var(--color-secondary)" }}
                    />
                    <Bar
                      dataKey="n"
                      fill="var(--color-primary)"
                      radius={[0, 3, 3, 0]}
                      barSize={12}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                9-file gap at end = cases awaiting human decision.
              </p>
            </div>

            {}
            <div className="rounded border border-border/70 bg-background/70 p-4">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                Case snapshot
              </p>
              <div className="space-y-0.5">
                {([
                  ["Application",   data.applicant.id],
                  ["Loan type",     data.applicant.type],
                  ["Requested",     data.applicant.amount],
                  ["Tenure",        data.applicant.tenure],
                  ["Fraud risk",    stages.fraud     === "done"    ? "LOW"        : "—"],
                  ["Alt-data score",stages.score     === "done"    ? "731"        : "—"],
                  ["Est. income",   stages.income    === "done"    ? "₹78,500"   : "—"],
                  ["Collateral",    stages.collateral=== "done"    ? "₹3.3L"     : "—"],
                  ["Exposure",      stages.exposure  === "warning" ? "₹8.4L — HIGH" : "—"],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-dashed border-border/70 py-1.5 last:border-0">
                    <span className="text-xs text-muted-foreground">{k}</span>
                    <span className={cn(
                      "font-mono text-xs font-medium tabular-nums",
                      v.includes("HIGH") ? "text-amber-600" :
                      v === "LOW"        ? "text-emerald-600" :
                                           "text-foreground"
                    )}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
