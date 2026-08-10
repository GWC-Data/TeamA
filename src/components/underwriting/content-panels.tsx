import { Button } from "@/components/ui/button"
import { useUnderwriting } from "@/contexts/underwriting-context"
import { underwritingData } from "@/mock/underwriting-data"
import type { ReactNode } from "react"

const tabs: Array<{ key: "overview" | "documents" | "fraud" | "credit" | "income" | "collateral" | "memo"; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "documents", label: "Documents" },
  { key: "fraud", label: "Fraud" },
  { key: "credit", label: "Credit" },
  { key: "income", label: "Income" },
  { key: "collateral", label: "Collateral" },
  { key: "memo", label: "Decision" },
]

function Card({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="rounded-[1.25rem] border border-border/70 bg-card/80 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {right}
      </div>
      {children}
    </section>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{children}</span>
}

function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-secondary">
      <div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  )
}

export function ContentPanels() {
  const { view, setView, setDecision } = useUnderwriting()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab.key} type="button" onClick={() => setView(tab.key)} className={`rounded-full border px-3 py-1.5 text-sm transition ${view === tab.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {view === "overview" && (
        <div className="space-y-4">
          <Card title="Application pulse" right={<Badge>Live</Badge>}>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Credit and underwriting workspace</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{underwritingData.applicant.name} • {underwritingData.applicant.type} • {underwritingData.applicant.amount}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">A clean operating surface for document intake, fraud checks, exposure review, and final underwriting decisions.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => setView("documents")}>Review documents</Button>
                  <Button variant="outline" onClick={() => setView("memo")}>Open memo</Button>
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Pipeline progress</span><span className="font-semibold text-foreground">{underwritingData.metrics.progress}%</span></div>
                <div className="mt-3"><Progress value={underwritingData.metrics.progress} /></div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-card/80 p-3"><p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Risk</p><p className="mt-1 text-lg font-semibold text-foreground">{underwritingData.metrics.risk}</p></div>
                  <div className="rounded-xl border border-border/70 bg-card/80 p-3"><p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Decision</p><p className="mt-1 text-lg font-semibold text-foreground">{underwritingData.metrics.decision}</p></div>
                </div>
              </div>
            </div>
          </Card>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Documents"><p className="text-sm text-muted-foreground">{underwritingData.stages.documents} documents received and verified.</p></Card>
            <Card title="Fraud"><p className="text-sm text-muted-foreground">{underwritingData.stages.fraud} review with alternate source support.</p></Card>
            <Card title="Exposure"><p className="text-sm text-muted-foreground">Exposure is {underwritingData.metrics.exposure} and needs senior review.</p></Card>
          </div>
        </div>
      )}

      {view === "documents" && (
        <Card title="Document collection" right={<Badge>{underwritingData.stages.documents}</Badge>}>
          <div className="grid gap-3 md:grid-cols-2">
            {underwritingData.documents.map((document) => (
              <div key={document.key} className="rounded-xl border border-border/70 bg-background/70 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{document.name}</p>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Received</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {view === "fraud" && (
        <Card title="Fraud review" right={<Badge>{underwritingData.stages.fraud}</Badge>}>
          <p className="text-sm leading-7 text-muted-foreground">The document review for {underwritingData.applicant.name} is {underwritingData.stages.fraud} and the values reconcile with bank and payslip evidence.</p>
        </Card>
      )}

      {view === "credit" && (
        <Card title="Credit score" right={<Badge>{underwritingData.stages.credit}</Badge>}>
          <p className="text-sm leading-7 text-muted-foreground">The alternate data layer lifts the applicant score to {underwritingData.stages.credit} and improves confidence for {underwritingData.applicant.segment}.</p>
        </Card>
      )}

      {view === "income" && (
        <Card title="Income assessment" right={<Badge>{underwritingData.stages.income}</Badge>}>
          <p className="text-sm leading-7 text-muted-foreground">Estimated monthly income remains at {underwritingData.metrics.income}; the current EMI load leaves limited headroom for {underwritingData.applicant.purpose}.</p>
        </Card>
      )}

      {view === "collateral" && (
        <Card title="Collateral valuation" right={<Badge>{underwritingData.stages.collateral}</Badge>}>
          <p className="text-sm leading-7 text-muted-foreground">Estimated collateral value is {underwritingData.stages.collateral} for the {underwritingData.applicant.type} request, though the proposed loan-to-value still requires oversight.</p>
        </Card>
      )}

      {view === "memo" && (
        <Card title="Decision memo" right={<Badge>{underwritingData.stages.decision}</Badge>}>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setDecision({ action: "Refer", reason: "Exposure and LTV require senior review", by: "M. Rao", time: "10:01" })}>Record decision</Button>
            <Button variant="outline" onClick={() => setView("overview")}>Back</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
