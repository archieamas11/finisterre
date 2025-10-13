import React from 'react'

export interface PrintableSlice {
  name: string
  value: number
}

export interface PrintablePieChartProps {
  title: string
  description?: string
  data: PrintableSlice[]
  total: number
  legendColors?: Record<string, string>
  metaRight?: string
}

export const PrintablePieChart = React.forwardRef<HTMLDivElement, PrintablePieChartProps>(
  ({ title, description, data, total, legendColors = {}, metaRight }, ref) => {
    const computedTotal = total ?? data.reduce((s, d) => s + d.value, 0)

    return (
      <div ref={ref} className="hidden print:block">
        <style>{`
          @media print {
            @page { size: A4; margin: 20mm; }
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            .print-container { font-family: system-ui, -apple-system, sans-serif; color: #000; line-height: 1.5; }
            .print-header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
            .print-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .print-subtitle { font-size: 14px; color: #555; }
            .print-section { margin-bottom: 22px; page-break-inside: avoid; }
            .section-head { display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #333; padding-bottom:6px; margin-bottom:12px; }
            .section-title { font-size: 16px; font-weight: 700; text-transform: uppercase; }
            .section-meta { font-size: 12px; color:#555; }
            .stats-grid { display:grid; grid-template-columns: 160px 1fr; gap: 8px 16px; margin-bottom: 10px; }
            .label { font-size: 11px; color:#666; text-transform:uppercase; font-weight:600; }
            .value { font-size: 13px; font-weight:500; }
            .legend { display:flex; flex-wrap:wrap; gap:10px 16px; margin-top: 6px; }
            .legend-item { display:flex; align-items:center; gap:8px; font-size: 12px; }
            .legend-dot { display:inline-block; width:12px; height:12px; border-radius:2px; border:1px solid #fff; box-shadow:0 0 0 1px #ddd inset; }
            .details { border:1px solid #ddd; background:#f9f9f9; border-radius:4px; padding:10px; font-size:12px; }
            .footer { margin-top: 28px; padding-top: 14px; border-top: 2px solid #ddd; font-size: 11px; color: #666; text-align: center; }
          }
        `}</style>

        <div className="print-container">
          <div className="print-header">
            <div className="print-title">{title}</div>
            <div className="print-subtitle">Finisterre Cemetery Management System</div>
            <div className="print-subtitle" style={{ marginTop: '5px', fontSize: '12px' }}>
              Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="print-section">
            <div className="section-head">
              <div className="section-title">Distribution Summary</div>
              {metaRight ? <div className="section-meta">{metaRight}</div> : null}
            </div>
            {description ? <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{description}</div> : null}
            <div className="stats-grid">
              <div className="label">Total</div>
              <div className="value">{computedTotal.toLocaleString()}</div>
              {data.map((d) => {
                const pct = computedTotal > 0 ? Math.round((d.value / computedTotal) * 100) : 0
                return (
                  <React.Fragment key={d.name}>
                    <div className="label">{d.name}</div>
                    <div className="value">
                      {d.value.toLocaleString()} ({pct}%)
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
            <div className="legend">
              {data.map((d) => (
                <div className="legend-item" key={`legend-${d.name}`}>
                  <span className="legend-dot" style={{ background: legendColors[d.name] ?? '#ccc' }} />
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="footer">Printed via Quick Print • {title}</div>
        </div>
      </div>
    )
  },
)

PrintablePieChart.displayName = 'PrintablePieChart'

export default PrintablePieChart
