import { cn } from "@/lib/utils"
import type { SimState, Stages, DecisionState } from "@/lib/sim"

const APP_ROWS = [
  { id: "APP-10021", name: "Demo Customer",          type: "Gold Loan",      amt: "₹3,00,000",  branch: "Koramangala", live: true  },
  { id: "APP-10020", name: "Synthetic — R. Menon",   type: "Business Loan",  amt: "₹12,00,000", branch: "Indiranagar", live: false },
  { id: "APP-10019", name: "Synthetic — S. Kulkarni",type: "Gold Loan",      amt: "₹1,80,000",  branch: "Jayanagar",   live: false },
  { id: "APP-10018", name: "Synthetic — A. Fernandes",type: "Personal Loan", amt: "₹4,50,000",  branch: "Whitefield",  live: false },
]

const STATUS_CHIP: Record<string, string> = {
  "Approved":           "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Rejected":           "border-rose-200 bg-rose-50 text-rose-700",
  "Underwriter review": "border-foreground/20 bg-foreground/5 text-foreground",
  "Documents pending":  "border-amber-200 bg-amber-50 text-amber-700",
  "In progress":        "border-primary/20 bg-primary/10 text-primary",
  "Not started":        "border-border/70 bg-secondary/50 text-muted-foreground",
}

type Props = {
  sim: SimState
  stages: Stages
  decision: DecisionState
  onOpenDetail: () => void
}

export function ApplicationsPage({ sim, stages, decision, onOpenDetail }: Props) {
  const { loaded } = sim
  const liveStatus = decision
    ? decision.action
    : !loaded
      ? "Not started"
      : stages.human === "review"
        ? "Underwriter review"
        : "In progress"

  return (
    <div className="space-y-4">
      <div className="rounded border border-border/70 bg-background/70 p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Applications
          </p>
          <button
            type="button"
            className="rounded border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            New application
          </button>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/70 text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="pb-2 pr-4 font-medium">Application</th>
              <th className="pb-2 pr-4 font-medium">Applicant</th>
              <th className="pb-2 pr-4 font-medium">Loan type</th>
              <th className="pb-2 pr-4 font-medium">Amount</th>
              <th className="pb-2 pr-4 font-medium">Branch</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {APP_ROWS.map(r => {
              const status = r.live ? liveStatus : r.id === "APP-10020" ? "Approved" : r.id === "APP-10019" ? "Rejected" : "Documents pending"
              const chipCls = STATUS_CHIP[status] ?? STATUS_CHIP["In progress"]
              return (
                <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                  <td className="py-2.5 pr-4 font-mono font-medium text-foreground">{r.id}</td>
                  <td className="py-2.5 pr-4 text-foreground/80">{r.name}</td>
                  <td className="py-2.5 pr-4 text-foreground/80">{r.type}</td>
                  <td className="py-2.5 pr-4 font-mono tabular-nums text-foreground">{r.amt}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{r.branch}</td>
                  <td className="py-2.5 pr-4">
                    <span className={cn("rounded border px-1.5 py-0.5 text-[11px]", chipCls)}>
                      {status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    {r.live ? (
                      <button
                        type="button"
                        onClick={() => { if (!loaded) sim.load(); onOpenDetail() }}
                        className="rounded border border-border/70 bg-background px-2 py-0.5 text-[11px] text-muted-foreground transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                      >
                        Open
                      </button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/50">Archived</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
