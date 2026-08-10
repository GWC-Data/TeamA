import { Button } from "@/components/ui/button"

type DecisionPanelProps = {
  data: any
  decision?: { action: string; reason: string; by: string; time: string } | null
  onRecordDecision?: (decision: { action: string; reason: string; by: string; time: string }) => void
  type?: "memo" | "audit"
}

export function DecisionPanel({ data, decision, onRecordDecision, type = "memo" }: DecisionPanelProps) {
  if (type === "audit") {
    return (
      <div className="space-y-3">
        {data.audit.map((entry: any) => (
          <div key={entry.time} className="rounded border border-border/70 bg-background/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{entry.action}</p>
              <span className="text-sm text-muted-foreground">{entry.time}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded border border-border/70 bg-background/70 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">Decision memo</p>
        <h3 className="mt-2 font-heading text-xl text-foreground">Recommendation: Refer</h3>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">The exposure profile is above internal policy tolerance and requires a human underwriter’s review, despite the strong alternative credit signal and solid collateral coverage.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-border/70 bg-card/80 p-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Decision</p>
            <p className="mt-1 text-sm font-semibold text-foreground">Refer</p>
          </div>
          <div className="rounded border border-border/70 bg-card/80 p-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Reason</p>
            <p className="mt-1 text-sm font-semibold text-foreground">Exposure above threshold</p>
          </div>
          <div className="rounded border border-border/70 bg-card/80 p-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Owner</p>
            <p className="mt-1 text-sm font-semibold text-foreground">M. Rao</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => onRecordDecision?.({ action: "Refer", reason: "Exposure above threshold and human oversight needed", by: "M. Rao", time: "10:01" })}>Record decision</Button>
          <Button variant="outline" onClick={() => window.scrollTo({ top: 0 })}>Back to top</Button>
        </div>
      </div>

      {decision && (
        <div className="rounded border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
          <p className="font-semibold">Recorded</p>
          <p className="mt-1">{decision.action} • {decision.reason}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em]">{decision.by} • {decision.time}</p>
        </div>
      )}
    </div>
  )
}
