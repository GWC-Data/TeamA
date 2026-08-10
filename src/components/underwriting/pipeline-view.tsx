import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { T, PAR_AGENTS, DOCS_SIM, progSim, type SimState, type Stages, type DecisionState } from "@/lib/sim"


const TONE: Record<string, { dot: string; border: string; bar: string }> = {
  done:    { dot: "bg-emerald-500",              border: "border-emerald-200",    bar: "bg-emerald-500"  },
  running: { dot: "bg-primary animate-pulse",    border: "border-primary/40",     bar: "bg-primary"      },
  waiting: { dot: "bg-muted-foreground/30",      border: "border-border/60",      bar: "bg-muted"        },
  warning: { dot: "bg-amber-500",                border: "border-amber-300",      bar: "bg-amber-500"    },
  review:  { dot: "bg-foreground",               border: "border-foreground",     bar: "bg-foreground"   },
}

const STATUS_LABEL: Record<string, string> = {
  done:    "Completed",
  running: "Running",
  waiting: "Waiting",
  warning: "Completed — Warning",
  review:  "Requires human review",
}


function PipelineNode({
  title, sub, status, onClick, uc,
}: {
  title: string; sub: string; status: string; onClick: () => void; uc?: string
}) {
  const t = TONE[status] ?? TONE.waiting
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded border bg-card/80 p-3 text-left transition-shadow hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/50",
        status === "review"  ? "border-foreground ring-1 ring-foreground" :
        status === "warning" ? "border-amber-300" :
        status === "running" ? "border-primary/40" : "border-border/70",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-foreground">{title}</span>
        {uc && <span className="font-mono text-[10px] text-muted-foreground">{uc}</span>}
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className={cn("h-2 w-2 shrink-0 rounded-full", t.dot)} />
        <span className="truncate text-[11px] text-muted-foreground">{sub || STATUS_LABEL[status]}</span>
      </div>
    </button>
  )
}


function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1.5 text-muted-foreground/40">
      <div className="h-4 w-px bg-border" />
      <div className="text-[10px] leading-none">▼</div>
      {label && (
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      )}
    </div>
  )
}


function ProgBar({ pct, status }: { pct: number; status: string }) {
  const t = TONE[status] ?? TONE.waiting
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={cn("h-full rounded-full transition-all duration-200", t.bar)}
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  )
}


export type SectionKey =
  | "dashboard" | "applications" | "pipeline"
  | "documents" | "fraud" | "credit" | "income" | "collateral" | "exposure"
  | "memo" | "audit" | "analytics"

type Props = {
  sim: SimState
  stages: Stages
  decision: DecisionState
  onNavigate: (view: SectionKey) => void
  
  embedded?: boolean
}


export function PipelineView({ sim, stages, decision, onNavigate, embedded = false }: Props) {
  const { elapsed: e, loaded } = sim
  const docsCount = DOCS_SIM.filter(d => loaded && e >= d.t).length
  const allPar    = Object.keys(PAR_AGENTS).every(k =>
    stages[k] === "done" || stages[k] === "warning"
  )

  const subFor: Record<string, string> = {
    submitted: loaded
      ? "APP-10021 · Gold Loan · ₹3,00,000"
      : "No application loaded",
    docs: stages.docs === "done"
      ? `${docsCount} / 6 documents received`
      : stages.docs === "running"
        ? `${docsCount} / 6 received — chasing customer`
        : "Waiting",
    fraud: stages.fraud === "done"
      ? "Fraud risk: LOW · confidence 96%"
      : stages.fraud === "running"
        ? "Running verification loop"
        : "Waiting",
    copilot: stages.copilot === "done"
      ? "Credit memo generated · REFER (87%)"
      : stages.copilot === "running"
        ? "Consolidating six agent outputs"
        : "Waiting for analysis",
    human: decision
      ? `Decision recorded: ${decision.action}`
      : stages.human === "review"
        ? "Awaiting underwriter decision"
        : "Waiting",
  }

  const inner = (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.05 }
        }
      }}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-xl"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
        <PipelineNode
          title="Application submitted"
          sub={subFor.submitted}
          status={stages.submitted}
          onClick={() => onNavigate("applications")}
        />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <Arrow />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
        <PipelineNode
          title="Document Collection"
          uc="UC-2 · State machine"
          sub={subFor.docs}
          status={stages.docs}
          onClick={() => onNavigate("documents")}
        />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <Arrow />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
        <PipelineNode
          title="Fraud Detection"
          uc="UC-3 · Bounded agent loop"
          sub={subFor.fraud}
          status={stages.fraud}
          onClick={() => onNavigate("fraud")}
        />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <Arrow />
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        className={cn(
          "rounded border-2 border-dashed p-3",
          allPar
            ? "border-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/20"
            : loaded && e >= T.parStart
              ? "border-primary/40 bg-primary/5"
              : "border-border/50 bg-secondary/30",
        )}
      >
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Parallel analysis — 4 agents
          </span>
          {allPar ? (
            <span className="text-[11px] font-medium text-emerald-600">✓ All agents complete</span>
          ) : loaded && e >= T.parStart ? (
            <span className="text-[11px] font-medium text-primary">Running simultaneously</span>
          ) : (
            <span className="text-[11px] text-muted-foreground">Waiting</span>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(PAR_AGENTS).map(([k, v]) => {
            const st  = stages[k] ?? "waiting"
            const pct = loaded ? progSim(e, T.parStart, v.dur) : 0
            return (
              <div key={k} className="rounded border border-border/70 bg-card/80 p-2.5">
                <PipelineNode
                  title={v.label}
                  uc={v.uc}
                  status={st}
                  sub={st === "waiting" ? "Waiting" : st === "running" ? "Running…" : v.note}
                  onClick={() => onNavigate(v.view as SectionKey)}
                />
                <div className="mt-2 flex items-center gap-2">
                  <ProgBar pct={pct} status={st} />
                  <span className="w-9 shrink-0 text-right font-mono text-[10px] tabular-nums text-muted-foreground">
                    {Math.round(pct)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <Arrow />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
        <PipelineNode
          title="Underwriting Co-Pilot"
          uc="UC-1 · Graph orchestrator"
          sub={subFor.copilot}
          status={stages.copilot ?? "waiting"}
          onClick={() => onNavigate("memo")}
        />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
        <Arrow label="AI stops here" />
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        className={cn(
          "rounded border-2 p-3",
          decision
            ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
            : stages.human === "review"
              ? "border-foreground bg-card"
              : "border-border/50 bg-secondary/30",
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-foreground px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
            Human
          </span>
          <span className="text-[11px] text-muted-foreground">
            Not an AI step — the underwriter decides
          </span>
        </div>
        <PipelineNode
          title="Human underwriter decision"
          sub={subFor.human}
          status={stages.human ?? "waiting"}
          onClick={() => onNavigate("memo")}
        />
      </motion.div>
    </motion.div>
  )

  if (embedded) return inner

  
  return (
    <div className="space-y-4">
      <div className="rounded border border-border/70 bg-background/70 p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Underwriting Pipeline
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={sim.start}
              disabled={sim.running}
              className="rounded border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {e > 0 && e < T.end ? "Resume underwriting" : "Run underwriting"}
            </button>
            <button
              type="button"
              onClick={sim.jumpToEnd}
              disabled={!loaded || e >= T.end}
              className="rounded border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground disabled:opacity-40"
            >
              Skip to end
            </button>
          </div>
        </div>
        {!loaded ? (
          <div className="rounded border border-dashed border-border/70 p-8 text-center">
            <p className="text-sm font-medium text-foreground">No application loaded</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Load the demo application from the Dashboard to watch the pipeline animate live.
            </p>
            <button
              type="button"
              onClick={sim.load}
              className="mt-4 rounded border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Load demo application
            </button>
          </div>
        ) : inner}
      </div>
    </div>
  )
}
