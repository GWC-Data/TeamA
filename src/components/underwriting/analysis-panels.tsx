import { cn } from "@/lib/utils"
import Gauge from "@/components/ui/gauge"
import { useState, useMemo } from "react"
import { T, DOCS_SIM, type SimState, type Stages } from "@/lib/sim"

type AnalysisPanelsProps = {
  type: "documents" | "fraud" | "credit" | "income" | "collateral" | "exposure"
  data: any
  sim?: SimState
  stages?: Stages
}

function SectionCard({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="rounded border border-border/70 bg-background/70 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {right}
      </div>
      {children}
    </section>
  )
}


function DocumentsPanel({ sim }: { sim?: SimState }) {
  const [extra, setExtra] = useState<Array<{ who: string; text: string; time?: string; system?: boolean }>>([])
  const [draft, setDraft] = useState("")

  const e       = sim?.elapsed ?? 0
  const loaded  = sim?.loaded  ?? false

  const received = DOCS_SIM.filter(d => loaded && e >= d.t)
  const count    = received.length

  const script = useMemo(() => {
    const m: Array<{ who: string; text: string; time?: string; system?: boolean }> = []
    if (loaded && e >= T.docStart) {
      m.push({ who: "agent", text: "Hello, this is IIFL's application assistant for APP-10021. To process your gold loan of ₹3,00,000, I need six documents. I'll take them one at a time — partial uploads are fine." })
    }
    received.forEach((d, i) => {
      m.push({ who: "customer", text: `Uploaded ${d.name.toLowerCase()}.`, time: d.time })
      if (i === received.length - 1 && count < 6) {
        const pending = DOCS_SIM.filter(x => e < x.t).map(x => x.name).join(", ")
        m.push({ who: "agent", text: `Received your ${d.name.toLowerCase()}. Still pending: ${pending}.`, time: d.time })
      } else {
        m.push({ who: "agent", text: `Received. ${DOCS_SIM.length - (i + 1)} document(s) to go.`, time: d.time })
      }
    })
    if (loaded && e >= T.docDone) {
      m.push({ who: "agent", text: "All six documents are in. Your file is complete and has moved to verification. You'll hear from us within the hour.", time: "09:49" })
    }
    return m
  }, [e, loaded, count, received])

  const messages = [...script, ...extra]

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      {}
      <SectionCard
        title="Document checklist"
        right={
          <span className="rounded border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
            {count} / 6
          </span>
        }
      >
        <ul className="space-y-1.5">
          {DOCS_SIM.map(d => {
            const got = loaded && e >= d.t
            return (
              <li key={d.key} className={cn(
                "flex items-center justify-between rounded border px-2.5 py-2",
                got ? "border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/30 dark:border-emerald-800/60" : "border-border/70"
              )}>
                <div className="flex items-center gap-2">
                  <span className={cn("font-mono text-xs", got ? "text-emerald-600" : "text-muted-foreground/30")}>
                    {got ? "✓" : "○"}
                  </span>
                  <span className={cn("text-xs", got ? "font-medium text-foreground" : "text-muted-foreground")}>
                    {d.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {got ? d.time : "pending"}
                </span>
              </li>
            )
          })}
        </ul>
        <div className="mt-3 border-t border-border/70 pt-3">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Completion</span>
            <span className="font-mono text-xs font-semibold tabular-nums text-foreground">{count} / 6</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn("h-full rounded-full transition-all duration-200", count === 6 ? "bg-emerald-500" : "bg-primary")}
              style={{ width: `${(count / 6) * 100}%` }}
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setExtra(x => [...x, { who: "agent", text: "Reminder sent on WhatsApp: your file is pending one or more documents.", system: true }])}
            className="rounded border border-border/70 bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          >
            Send reminder
          </button>
          <button
            type="button"
            onClick={() => setExtra(x => [...x, { who: "agent", text: "Escalated to the branch relationship manager for a manual follow-up call.", system: true }])}
            className="rounded border border-border/70 bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          >
            Escalate
          </button>
        </div>
      </SectionCard>

      {}
      <SectionCard title="Conversation" right={<span className="text-[11px] text-muted-foreground">WhatsApp · +91 98XXX 41172</span>}>
        {messages.length === 0 ? (
          <div className="rounded border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
            The document collection agent opens the conversation as soon as an application is submitted.
            Run the simulation from the Dashboard to see it live.
          </div>
        ) : (
          <div className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.who === "customer" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] rounded border px-3 py-2 text-xs",
                  m.system
                    ? "border-border/70 bg-secondary/60 text-muted-foreground italic"
                    : m.who === "customer"
                      ? "border-border/70 bg-secondary text-foreground"
                      : "border-primary/20 bg-primary/10 text-foreground"
                )}>
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {m.system ? "System" : m.who === "customer" ? "Demo Customer" : "Collection agent"}
                    {m.time ? ` · ${m.time}` : ""}
                  </div>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-2 border-t border-border/70 pt-3">
          <input
            className="flex-1 rounded border border-border/70 bg-background px-2.5 py-1.5 text-xs focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
            placeholder="Reply as the customer…"
            value={draft}
            onChange={ev => setDraft(ev.target.value)}
            onKeyDown={ev => {
              if (ev.key === "Enter" && draft.trim()) {
                setExtra(x => [
                  ...x,
                  { who: "customer", text: draft.trim() },
                  { who: "agent", text: "Noted. I'll keep your application pending until the remaining document is received." },
                ])
                setDraft("")
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (!draft.trim()) return
              setExtra(x => [
                ...x,
                { who: "customer", text: draft.trim() },
                { who: "agent", text: "Noted. I'll keep your application pending until the remaining document is received." },
              ])
              setDraft("")
            }}
            className="rounded border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            Send
          </button>
        </div>
      </SectionCard>
    </div>
  )
}


export function AnalysisPanels({ type, data, sim }: AnalysisPanelsProps) {

  if (type === "documents") {
    return <DocumentsPanel sim={sim} />
  }

  if (type === "fraud") {
    return (
      <div className="space-y-4">
        <SectionCard title="Fraud review" right={<span className="rounded border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Low risk</span>}>
          <div className="rounded border border-border/70 bg-card/80 p-3 text-sm text-muted-foreground">
            The review surfaced one formatting anomaly, but the identity and bank evidence reconcile cleanly.
            Fraud risk is classified as <span className="font-semibold text-emerald-600">LOW</span> with 96% confidence.
          </div>
          <div className="mt-3 grid gap-3">
            {data.checks.map((check: any) => (
              <div key={check.name} className="rounded border border-border/70 bg-card/80 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{check.name}</p>
                  <span className={cn(
                    "rounded border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]",
                    check.state === "pass"    ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                    check.state === "flagged" ? "border-amber-200 bg-amber-50 text-amber-700" :
                                               "border-rose-200 bg-rose-50 text-rose-700"
                  )}>
                    {check.state}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{check.detail}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    )
  }

  if (type === "credit") {
    return (
      <SectionCard title="Credit score" right={<span className="rounded border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">731</span>}>
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded border border-border/70 bg-card/80 p-4">
            <p className="text-sm text-muted-foreground">Alt-data score</p>
            <div className="mt-3 flex flex-col items-center gap-2">
              <Gauge value={731} max={950} />
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">+49 vs bureau baseline (682)</p>
          </div>
          <div className="space-y-2">
            {data.scoreFactors.map((factor: any) => (
              <div key={factor.name} className="rounded border border-border/70 bg-card/80 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{factor.name}</p>
                  <span className={cn(
                    "text-sm font-semibold",
                    factor.pts > 0 ? "text-emerald-600" : factor.pts < 0 ? "text-rose-600" : "text-muted-foreground"
                  )}>
                    {factor.pts > 0 ? "+" : ""}{factor.pts}
                  </span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">{factor.src}</p>
                {factor.detail && <p className="mt-1 text-xs text-muted-foreground">{factor.detail}</p>}
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    )
  }

  if (type === "income") {
    return (
      <SectionCard title="Income assessment" right={<span className="rounded border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">₹78,500</span>}>
        <div className="rounded border border-border/70 bg-card/80 p-3 text-sm text-muted-foreground">
          Estimated monthly income is strong, though current EMI load leaves limited headroom. FOIR: <span className="font-semibold text-foreground">49%</span> · Eligible loan amount: <span className="font-semibold text-foreground">₹4.2L</span>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {data.incomeBreakdown.map((item: any) => (
            <div key={item.name} className="rounded border border-border/70 bg-card/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <span className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider rounded border px-1.5 py-0.5",
                  item.counted ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-border/70 text-muted-foreground"
                )}>
                  {item.counted ? "Counted" : "Excluded"}
                </span>
              </div>
              <p className="mt-2 text-xl font-semibold text-foreground">{item.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.pct}% of estimated inflow</p>
            </div>
          ))}
        </div>
      </SectionCard>
    )
  }

  if (type === "collateral") {
    return (
      <SectionCard title="Collateral valuation" right={<span className="rounded border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">₹3.3L</span>}>
        <div className="rounded border border-border/70 bg-card/80 p-3 text-sm text-muted-foreground">
          Latest valuation sits in range — <span className="font-semibold text-foreground">₹3.1L–₹3.5L</span> confidence interval. Branch avg: ₹3.2L.
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {data.collateralItems.map((item: any) => (
            <div key={item.item} className="rounded border border-border/70 bg-card/80 p-3">
              <p className="text-sm font-medium text-foreground">{item.item}</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{item.value}</p>
              {item.weight && (
                <p className="mt-1 text-xs text-muted-foreground">{item.weight} · {item.purity}</p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    )
  }

  
  return (
    <SectionCard title="Exposure review" right={<span className="rounded border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-700">₹8.4L — High</span>}>
      <div className="rounded border border-amber-200 bg-amber-50/60 dark:bg-amber-950/30 p-3 text-sm text-muted-foreground">
        Total exposure <span className="font-semibold text-amber-700">₹8.4L</span> exceeds the internal threshold of <span className="font-semibold text-amber-700">₹6.0L</span> across 4 lenders, 7 active loans. Human review required.
      </div>
      <div className="mt-3 space-y-2">
        {data.exposureRows.map((row: any) => (
          <div key={row.lender} className="rounded border border-border/70 bg-card/80 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{row.lender}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{row.kind}</p>
              </div>
              <span className={cn(
                "rounded border px-1.5 py-0.5 text-[10px] font-medium",
                row.status === "Current" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"
              )}>
                {row.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Outstanding <span className="font-medium text-foreground">{row.outstanding}</span> · EMI <span className="font-medium text-foreground">{row.emi}</span> · {row.pct}% of total
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
