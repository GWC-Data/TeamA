import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

type View = "overview" | "documents" | "fraud" | "credit" | "income" | "collateral" | "memo"
type Decision = { action: string; reason: string; by: string; time: string } | null

type UnderwritingContextValue = {
  view: View
  setView: (next: View) => void
  loaded: boolean
  setLoaded: (next: boolean) => void
  running: boolean
  setRunning: (next: boolean) => void
  decision: Decision
  setDecision: (next: Decision) => void
  notification: boolean
  setNotification: (next: boolean) => void
  reset: () => void
}

const UnderwritingContext = createContext<UnderwritingContextValue | undefined>(undefined)

export function UnderwritingProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("overview")
  const [loaded, setLoaded] = useState(true)
  const [running, setRunning] = useState(false)
  const [decision, setDecision] = useState<Decision>(null)
  const [notification, setNotification] = useState(false)

  const reset = () => {
    setLoaded(true)
    setRunning(false)
    setDecision(null)
    setNotification(false)
    setView("overview")
  }

  const value = useMemo<UnderwritingContextValue>(
    () => ({
      view,
      setView,
      loaded,
      setLoaded,
      running,
      setRunning,
      decision,
      setDecision,
      notification,
      setNotification,
      reset,
    }),
    [decision, loaded, notification, running, view]
  )

  return <UnderwritingContext.Provider value={value}>{children}</UnderwritingContext.Provider>
}

export function useUnderwriting() {
  const context = useContext(UnderwritingContext)
  if (!context) {
    throw new Error("useUnderwriting must be used within UnderwritingProvider")
  }
  return context
}
