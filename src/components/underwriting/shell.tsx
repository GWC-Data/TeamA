import { Button } from "@/components/ui/button"
import { ContentPanels } from "@/components/underwriting/content-panels"
import { useUnderwriting } from "@/contexts/underwriting-context"
import { underwritingData } from "@/mock/underwriting-data"

export function UnderwritingShell() {
  const { loaded, decision, notification, setNotification, reset } = useUnderwriting()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Agent suite workspace</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              {loaded ? "Live case" : "No case"}
            </span>
            <Button variant="outline" onClick={() => setNotification(!notification)}>
              Notifications {notification ? "on" : "off"}
            </Button>
            <Button onClick={reset}>Reset</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[1.75rem] border border-border/70 bg-card/80 p-4 shadow-[0_24px_100px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-border/70 bg-background/70 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Application overview</p>
              <p className="text-sm text-muted-foreground">{underwritingData.applicant.name} • {underwritingData.applicant.branch} • {underwritingData.applicant.purpose}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">Case {underwritingData.applicant.id}</span>
              {decision ? <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{decision.action}</span> : <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">Pending review</span>}
            </div>
          </div>
          <ContentPanels />
        </section>
      </main>
    </div>
  )
}
