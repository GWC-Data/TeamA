import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AnalysisPanels } from "./analysis-panels"
import { DecisionPanel } from "./decision-panel"
import { OverviewDashboard } from "./overview-dashboard"
import { UnderwritingShell } from "./underwriting-shell"
import { PipelineView, type SectionKey } from "./pipeline-view"
import { ApplicationsPage } from "./applications-page"
import { AnalyticsPage } from "./analytics-page"
import { useSim, useStages, type DecisionState } from "@/lib/sim"

export function UnderwritingExperience() {
  const [view, setView]           = useState<SectionKey>("dashboard")
  const [decision, setDecision]   = useState<DecisionState>(null)
  const [notifications, setNotifications] = useState(true)

  const sim    = useSim()
  const stages = useStages(sim.elapsed, sim.loaded, decision)

  const data = useMemo(() => ({
    applicant: {
      id:      "APP-10021",
      name:    "Demo Customer",
      pan:     "AXXPD4417K",
      type:    "Gold Loan",
      amount:  "₹3,00,000",
      tenure:  "24 months",
      branch:  "Bengaluru — Koramangala",
      purpose: "Business working capital",
      segment: "Self-employed / informal income",
    },
    documents: [
      { key: "pan",     name: "PAN Card",              status: "Received" },
      { key: "aadhaar", name: "Aadhaar",                status: "Received" },
      { key: "form16",  name: "Form 16",                status: "Received" },
      { key: "payslip", name: "Salary Payslips (3 mo)", status: "Received" },
      { key: "bank",    name: "Bank Statement (6 mo)",  status: "Received" },
      { key: "address", name: "Address Proof",          status: "Received" },
    ],
    metrics: {
      risk:             "Low",
      score:            731,
      creditScoreDelta: "+49 vs bureau",
      income:           "₹78,500",
      exposure:         "₹8.4L",
      collateral:       "₹3.3L",
      progress:         84,
      decision:         decision?.action ?? "Refer",
    },
    checks: [
      { name: "Tampering",           state: "flagged", detail: "Font inconsistency flagged in Form 16 income field." },
      { name: "Expiry",              state: "pass",    detail: "Identity documents valid beyond tenure." },
      { name: "Identity match",      state: "pass",    detail: "PAN, Aadhaar, and bank account resolve to one profile." },
      { name: "Cross-document match",state: "pass",    detail: "Name, DOB and address agree across all 6 documents." },
      { name: "Duplicate check",     state: "pass",    detail: "No other live application on this PAN or mobile number." },
    ],
    scoreFactors: [
      { name: "Bureau repayment history",          src: "Bureau",   pts: 0,   base: true, detail: "36 months, 1 late payment (2024)" },
      { name: "UPI inflow consistency",             src: "UPI",      pts: 22,              detail: "18 months stable merchant collections" },
      { name: "Utility payment regularity",         src: "Utility",  pts: 15,              detail: "24/24 electricity bills paid before due date" },
      { name: "GST filing regularity",              src: "GST",      pts: 11,              detail: "No delayed GSTR-3B in 8 quarters" },
      { name: "Historical repayment with IIFL",     src: "Internal", pts: 9,               detail: "2 gold loans closed, zero DPD" },
      { name: "Multi-lender borrowing velocity",    src: "Bureau",   pts: -8,              detail: "3 new lines opened in last 6 months" },
    ],
    incomeBreakdown: [
      { name: "Business receipts (UPI/QR)", value: "₹46,200", pct: 55, counted: true  },
      { name: "Salary credit",              value: "₹28,000", pct: 34, counted: true  },
      { name: "Non-recurring transfers",    value: "₹9,300",  pct: 11, counted: false },
    ],
    incomeOutflow: [
      { name: "Existing loan EMIs", amt: "₹24,800", pct: 40 },
      { name: "Rent",               amt: "₹15,000", pct: 24 },
      { name: "Cash withdrawals",   amt: "₹18,500", pct: 30 },
      { name: "Utilities",          amt: "₹4,200",  pct: 6  },
    ],
    collateralItems: [
      { item: "Bangles (2)", weight: "31.2 g", purity: "22K", value: "₹1.65L" },
      { item: "Chain",       weight: "18.4 g", purity: "22K", value: "₹0.97L" },
      { item: "Ring (2)",    weight: "12.8 g", purity: "22K", value: "₹0.68L" },
    ],
    exposureRows: [
      { lender: "IIFL Finance",    kind: "Internal", outstanding: "₹1.5L", emi: "₹6,100", pct: 18, status: "Current"             },
      { lender: "HDFC Bank",       kind: "External", outstanding: "₹2.8L", emi: "₹8,400", pct: 33, status: "Current"             },
      { lender: "Bajaj Finserv",   kind: "External", outstanding: "₹2.6L", emi: "₹7,200", pct: 31, status: "Current"             },
      { lender: "App-based NBFC",  kind: "External", outstanding: "₹1.5L", emi: "₹3,100", pct: 18, status: "Opened 41 days ago" },
    ],
    trend: [
      { label: "Apr", score: 610 },
      { label: "May", score: 645 },
      { label: "Jun", score: 681 },
      { label: "Jul", score: 731 },
    ],
    audit: [
      { time: "09:41", agent: "Intake",                 action: "Application submitted",                          status: "OK"   },
      { time: "09:42", agent: "Document Collection",    action: "Document collection started",                    status: "OK"   },
      { time: "09:43", agent: "Document Collection",    action: "PAN Card received",                              status: "OK"   },
      { time: "09:44", agent: "Document Collection",    action: "Aadhaar received",                               status: "OK"   },
      { time: "09:45", agent: "Document Collection",    action: "Form 16 received",                               status: "OK"   },
      { time: "09:46", agent: "Document Collection",    action: "Salary Payslips received",                       status: "OK"   },
      { time: "09:47", agent: "Document Collection",    action: "Bank Statement received",                        status: "OK"   },
      { time: "09:48", agent: "Document Collection",    action: "Address Proof received",                         status: "OK"   },
      { time: "09:49", agent: "Document Collection",    action: "Document set completed — 6/6",                   status: "OK"   },
      { time: "09:49", agent: "Fraud Detection",        action: "Verification loop started",                      status: "OK"   },
      { time: "09:50", agent: "Fraud Detection",        action: "Fraud detection completed — risk LOW",           status: "OK"   },
      { time: "09:50", agent: "Orchestrator",           action: "Parallel analysis dispatched (4 agents)",        status: "OK"   },
      { time: "09:51", agent: "Exposure Check",         action: "Over-exposure flagged — ₹8.4L vs ₹6.0L",        status: "WARN" },
      { time: "09:51", agent: "Alt-Data Score",         action: "Alt-data scoring completed — 731",              status: "OK"   },
      { time: "09:52", agent: "Income Estimation",      action: "Income estimated — ₹78,500 / month",            status: "OK"   },
      { time: "09:53", agent: "Collateral Valuation",   action: "Collateral valued — ₹3.3L (in range)",          status: "OK"   },
      { time: "09:53", agent: "Underwriting Co-Pilot",  action: "Consolidating agent outputs",                    status: "OK"   },
      { time: "09:54", agent: "Underwriting Co-Pilot",  action: "Credit memo generated — REFER (87%)",           status: "OK"   },
      { time: "09:55", agent: "Workflow",               action: "Routed to human underwriter — pipeline paused", status: "HOLD" },
    ],
  }), [decision])

  const go = (v: SectionKey) => {
    setView(v)
    if (typeof window !== "undefined") window.scrollTo({ top: 0 })
  }

  const reset = () => {
    sim.reset()
    setDecision(null)
    setView("dashboard")
  }

  
  const notLoaded = !sim.loaded
  const NoApp = () => (
    <div className="rounded border border-dashed border-border/70 bg-background/70 p-10 text-center">
      <p className="text-sm font-semibold text-foreground">No application loaded</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Load the synthetic demo case first, then this agent's output will appear here.
      </p>
      <div className="mt-4 flex justify-center">
        <Button onClick={() => go("dashboard")}>Go to dashboard</Button>
      </div>
    </div>
  )

  return (
    <UnderwritingShell
      currentView={view}
      onChangeView={go}
      notifications={notifications}
      onToggleNotifications={() => setNotifications(v => !v)}
      onRefresh={reset}
      decision={decision}
      stages={stages}
    >
      <div className="min-h-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {view === "dashboard" && (
              <OverviewDashboard data={data} sim={sim} stages={stages} onOpenSection={go} decision={decision} />
            )}

            {view === "applications" && (
              <ApplicationsPage sim={sim} stages={stages} decision={decision} onOpenDetail={() => go("pipeline")} />
            )}

            {view === "pipeline" && (
              <PipelineView sim={sim} stages={stages} decision={decision} onNavigate={go} />
            )}

            {view === "documents"  && (notLoaded ? <NoApp /> : <AnalysisPanels type="documents"  data={data} sim={sim} />)}
            {view === "fraud"      && (notLoaded ? <NoApp /> : <AnalysisPanels type="fraud"      data={data} sim={sim} />)}
            {view === "credit"     && (notLoaded ? <NoApp /> : <AnalysisPanels type="credit"     data={data} sim={sim} />)}
            {view === "income"     && (notLoaded ? <NoApp /> : <AnalysisPanels type="income"     data={data} sim={sim} />)}
            {view === "collateral" && (notLoaded ? <NoApp /> : <AnalysisPanels type="collateral" data={data} sim={sim} />)}
            {view === "exposure"   && (notLoaded ? <NoApp /> : <AnalysisPanels type="exposure"   data={data} sim={sim} />)}
            {view === "memo"       && (notLoaded ? <NoApp /> : <DecisionPanel data={data} decision={decision} onRecordDecision={setDecision} />)}
            {view === "audit"      && <DecisionPanel type="audit" data={data} />}
            {view === "analytics"  && <AnalyticsPage />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded border border-border/70 bg-card/80 p-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Decision helpers</p>
          <p className="text-sm text-muted-foreground">
            The workflow stays human-led, while the co-pilot surfaces the right evidence and recommendation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => go("memo")}>Review memo</Button>
          <Button variant="outline" onClick={() => go("audit")}>View audit</Button>
        </div>
      </div>
    </UnderwritingShell>
  )
}

export default UnderwritingExperience
