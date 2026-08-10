import { useState, useEffect, useRef, useMemo } from "react"


export const T = {
  submit: 300,
  docStart: 600,
  docDone: 3600,
  fraudStart: 3800,
  fraudDone: 5700,
  parStart: 5900,
  copilotStart: 10700,
  copilotDone: 12700,
  humanReady: 12900,
  end: 13200,
} as const


export const DOCS_SIM = [
  { key: "pan",      name: "PAN Card",                t: 900,  time: "09:43" },
  { key: "aadhaar",  name: "Aadhaar",                 t: 1400, time: "09:44" },
  { key: "form16",   name: "Form 16",                 t: 1900, time: "09:45" },
  { key: "payslip",  name: "Salary Payslips (3 mo)",  t: 2400, time: "09:46" },
  { key: "bank",     name: "Bank Statement (6 mo)",   t: 2900, time: "09:47" },
  { key: "address",  name: "Address Proof",           t: 3400, time: "09:48" },
]


export const PAR_AGENTS = {
  exposure:   { label: "Exposure Check",         uc: "UC-7", dur: 2200, end: "warning" as const, note: "Over-exposure — ₹8.4L",  view: "exposure"   },
  score:      { label: "Alt-Data Credit Score",  uc: "UC-4", dur: 2900, end: "done"    as const, note: "Score 731 (+49)",         view: "credit"     },
  income:     { label: "Income Estimation",      uc: "UC-5", dur: 3700, end: "done"    as const, note: "₹78,500 / month",         view: "income"     },
  collateral: { label: "Collateral Valuation",   uc: "UC-6", dur: 4600, end: "done"    as const, note: "₹3.3L — in range",        view: "collateral" },
}

export type DecisionState = {
  action: string
  reason: string
  by: string
  time: string
} | null


export function useSim() {
  const [elapsed, setElapsed]   = useState(0)
  const [running, setRunning]   = useState(false)
  const [loaded,  setLoaded]    = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) return
    timer.current = setInterval(() => {
      setElapsed(e => {
        const next = e + 100
        if (next >= T.end) {
          clearInterval(timer.current!)
          setRunning(false)
          return T.end
        }
        return next
      })
    }, 100)
    return () => clearInterval(timer.current!)
  }, [running])

  return {
    elapsed,
    running,
    loaded,
    load:       () => { setLoaded(true); setElapsed(0) },
    start:      () => { if (elapsed >= T.end) setElapsed(0); setLoaded(true); setRunning(true) },
    reset:      () => { clearInterval(timer.current!); setRunning(false); setElapsed(0); setLoaded(false) },
    jumpToEnd:  () => { clearInterval(timer.current!); setRunning(false); setElapsed(T.end) },
  }
}

export type SimState = ReturnType<typeof useSim>


export const progSim = (e: number, start: number, dur: number) =>
  Math.max(0, Math.min(100, ((e - start) / dur) * 100))


export function useStages(e: number, loaded: boolean, decision: DecisionState): Record<string, string> {
  return useMemo(() => {
    const st = (started: number, done: number, endState = "done") => {
      if (!loaded || e < started) return "waiting"
      if (e < done)               return "running"
      return endState
    }
    const par: Record<string, string> = {}
    Object.entries(PAR_AGENTS).forEach(([k, v]) => {
      par[k] = st(T.parStart, T.parStart + v.dur, v.end)
    })
    return {
      submitted: !loaded ? "waiting" : e >= T.submit ? "done" : "running",
      docs:      st(T.docStart,     T.docDone),
      fraud:     st(T.fraudStart,   T.fraudDone),
      ...par,
      copilot:   st(T.copilotStart, T.copilotDone),
      human:     decision ? "done" : !loaded || e < T.humanReady ? "waiting" : "review",
    }
  }, [e, loaded, decision])
}

export type Stages = Record<string, string>
