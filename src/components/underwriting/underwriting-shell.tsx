import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { SectionKey } from "./pipeline-view"
import type { Stages } from "@/lib/sim"
import {
  Activity,
  ClipboardList,
  GitBranch,
  FileText,
  ShieldCheck,
  BadgeCheck,
  Wallet,
  Gem,
  AlertTriangle,
  FileSignature,
  ScrollText,
  BarChart3,
  RotateCcw,
  Circle,
} from "lucide-react"

type UnderwritingShellProps = {
  children: ReactNode
  currentView: SectionKey
  onChangeView: (view: SectionKey) => void
  onRefresh: () => void
  decision: { action: string; reason: string; by: string; time: string } | null
  stages?: Stages
  notifications?: boolean
  onToggleNotifications?: () => void
}

const NAV_ICON: Record<SectionKey, ReactNode> = {
  dashboard:    <Activity      size={15} />,
  applications: <ClipboardList   size={15} />,
  pipeline:     <GitBranch       size={15} />,
  documents:    <FileText        size={15} />,
  fraud:        <ShieldCheck     size={15} />,
  credit:       <BadgeCheck      size={15} />,
  income:       <Wallet          size={15} />,
  collateral:   <Gem             size={15} />,
  exposure:     <AlertTriangle   size={15} />,
  memo:         <FileSignature   size={15} />,
  audit:        <ScrollText      size={15} />,
  analytics:    <BarChart3       size={15} />,
}

const sections: Array<{ key: SectionKey; label: string; stage?: string }> = [
  { key: "dashboard",    label: "Dashboard"             },
  { key: "applications", label: "Applications"          },
  { key: "pipeline",     label: "Underwriting Pipeline" },
  { key: "documents",    label: "Document Collection",  stage: "docs"       },
  { key: "fraud",        label: "Fraud Detection",      stage: "fraud"      },
  { key: "credit",       label: "Credit Scoring",       stage: "score"      },
  { key: "income",       label: "Income Assessment",    stage: "income"     },
  { key: "collateral",   label: "Collateral Valuation", stage: "collateral" },
  { key: "exposure",     label: "Exposure Check",       stage: "exposure"   },
  { key: "memo",         label: "Credit Memo",          stage: "copilot"    },
  { key: "audit",        label: "Audit Trail"           },
  { key: "analytics",    label: "Analytics"             },
]


const NAV_GROUPS = [
  { label: "Overview",   keys: ["dashboard", "applications", "pipeline"] },
  { label: "Agents",     keys: ["documents", "fraud", "credit", "income", "collateral", "exposure"] },
  { label: "Decision",   keys: ["memo", "audit", "analytics"] },
]

export function UnderwritingShell({
  children,
  currentView,
  onChangeView,
  onRefresh,
  decision,
  stages,
}: UnderwritingShellProps) {
  return (
    <div className="min-h-screen bg-transparent text-foreground">

      {}
      <header className="sticky top-0 z-20 border-b border-border/70 bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

          {}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 overflow-hidden items-center justify-center rounded border border-border bg-black">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-cover scale-110" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-muted-foreground">
                Credit &amp; Underwriting
              </p>
              <h1 className="font-heading text-lg font-semibold leading-none text-foreground">
                Agent Suite
              </h1>
            </div>
          </div>

          {}
          <div className="flex flex-wrap items-center gap-2">
            {}
            <span className="inline-flex h-8 items-center gap-1.5 rounded border border-primary/20 bg-primary/10 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              <Circle size={6} className="fill-primary" />
              {decision ? decision.action : "Pending review"}
            </span>

            {}
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex h-8 items-center gap-1.5 rounded border border-border/70 bg-background px-3 text-sm text-muted-foreground transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              <RotateCcw size={13} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {}
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">

        {}
        <aside className="w-full shrink-0 lg:w-60">
          <div className="rounded border border-border/70 bg-card/80 p-3 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">

            {NAV_GROUPS.map((group, gi) => {
              const groupSections = sections.filter(s => group.keys.includes(s.key))
              return (
                <div key={group.label} className={cn(gi > 0 && "mt-4")}>
                  <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/60">
                    {group.label}
                  </p>
                  <nav className="space-y-0.5">
                    {groupSections.map(section => {
                      const stageDot  = section.stage ? stages?.[section.stage] : null
                      const isActive  = currentView === section.key
                      const isRunning = stageDot === "running"
                      const isDone    = stageDot === "done"
                      const isWarn    = stageDot === "warning"

                      return (
                        <button
                          key={section.key}
                          type="button"
                          onClick={() => onChangeView(section.key)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm transition",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                          )}
                        >
                          {}
                          <span className={cn(
                            "shrink-0 transition-colors",
                            isActive ? "opacity-90" : "opacity-60 group-hover:opacity-80"
                          )}>
                            {NAV_ICON[section.key]}
                          </span>

                          {}
                          <span className="flex-1 truncate text-xs font-medium">{section.label}</span>

                          {}
                          {stageDot && (
                            <span className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full",
                              isDone    ? "bg-emerald-500" :
                              isRunning ? "animate-pulse bg-primary" :
                              isWarn    ? "bg-amber-500" :
                              isActive  ? "bg-primary-foreground/40" : "bg-primary/25"
                            )} />
                          )}
                        </button>
                      )
                    })}
                  </nav>
                </div>
              )
            })}

            {}
            <div className="mt-4 rounded border border-border/70 bg-background/70 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
              The co-pilot prepares the file, but every decision stays with a human.
            </div>
          </div>
        </aside>

        {}
        <main className="min-w-0 flex-1 space-y-4">
          <div className="rounded border border-border/70 bg-card/80 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-border/70 bg-background/70 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Application overview</p>
                <p className="text-sm text-muted-foreground">
                  Document intake, fraud checks, risk analysis, and decision capture in one workspace.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                <FileText size={12} />
                Case APP-10021
              </div>
            </div>
            <div className="mt-4">{children}</div>
          </div>
        </main>

      </div>
    </div>
  )
}
