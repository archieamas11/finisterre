import React from 'react'

export interface SeriesPoint {
  label: string
  value: number
}

export interface PrintableAreaChartProps {
  title: string
  description?: string
  period?: string
  total?: number
  series: Array<SeriesPoint>
}

const PrintableAreaChart = React.forwardRef<HTMLDivElement, PrintableAreaChartProps>(({ title, description, period, total, series }, ref) => {
  const computedTotal = typeof total === 'number' ? total : series.reduce((s, p) => s + (Number.isFinite(p.value) ? p.value : 0), 0)

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
            .section { margin-bottom: 20px; page-break-inside: avoid; }
            .section-head { display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #333; padding-bottom:6px; margin-bottom:12px; }
            .section-title { font-size: 16px; font-weight: 700; text-transform: uppercase; }
            .section-meta { font-size: 12px; color:#555; }
            .grid { display:grid; grid-template-columns: 160px 1fr; gap: 8px 16px; margin-bottom: 10px; }
            .label { font-size: 11px; color:#666; text-transform:uppercase; font-weight:600; }
            .value { font-size: 13px; font-weight:500; }
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

        <div className="section">
          <div className="section-head">
            <div className="section-title">Summary</div>
            {period ? <div className="section-meta">{period}</div> : null}
          </div>
          {description ? <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{description}</div> : null}
          <div className="grid">
            <div className="label">Total</div>
            <div className="value">{computedTotal.toLocaleString()}</div>
            {series.map((s) => (
              <React.Fragment key={s.label}>
                <div className="label">{s.label}</div>
                <div className="value">{(Number.isFinite(s.value) ? s.value : 0).toLocaleString()}</div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="footer">Printed via Quick Print • {title}</div>
      </div>
    </div>
  )
})

PrintableAreaChart.displayName = 'PrintableAreaChart'

export default PrintableAreaChart
