type GaugeProps = {
  value: number
  max?: number
  size?: number
}

export function Gauge({ value, max = 950 }: GaugeProps) {
  const display = Math.round(value)
  const pct = Math.max(0, Math.min(1, value / max))

  const VW = 220
  const VH = 130
  const cx = 110
  const cy = 118       
  const r = 92
  const sw = 24 
  const circumference = Math.PI * r
  const offset = circumference * (1 - pct)

  const trackD = `M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        style={{ display: "block", overflow: "visible" }}
        aria-label={`Gauge: ${display} out of ${max}`}
      >
        <path
          d={trackD}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path
          d={trackD}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          fontSize="38"
          fontWeight="700"
          fill="var(--color-primary)"
          fontFamily="inherit"
        >
          {display}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fontSize="13"
          fill="var(--color-muted-foreground)"
          fontFamily="inherit"
        >
          {display} / {max}
        </text>
      </svg>
    </div>
  )
}

export default Gauge
