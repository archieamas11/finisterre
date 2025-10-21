import type { ActivityLog } from '@/api/logs.api'
import React from 'react'

interface PrintableLogDetailsProps {
  log: ActivityLog
}

export const PrintableLogDetails = React.forwardRef<HTMLDivElement, PrintableLogDetailsProps>(({ log }, ref) => {
  const created = new Date(log.created_at)
  const when = isNaN(created.getTime()) ? log.created_at : created.toLocaleString()

  return (
    <div ref={ref} className="hidden print:block">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .print-container {
            font-family: system-ui, -apple-system, sans-serif;
            color: #000;
            line-height: 1.5;
          }

          .print-header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }

          .print-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .print-subtitle {
            font-size: 14px;
            color: #555;
          }

          .print-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }

          .print-section-title {
            font-size: 16px;
            font-weight: bold;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
            margin-bottom: 12px;
            text-transform: uppercase;
          }

          .print-grid {
            display: grid;
            grid-template-columns: 160px 1fr;
            gap: 10px 16px;
            margin-bottom: 10px;
          }

          .print-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
          }

          .print-value {
            font-size: 13px;
            font-weight: 500;
          }

          .print-details {
            border: 1px solid #ddd;
            background: #f9f9f9;
            border-radius: 4px;
            padding: 12px;
            font-size: 12px;
          }

          .print-footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #ddd;
            font-size: 11px;
            color: #666;
            text-align: center;
          }
        }
      `}</style>

      <div className="print-container">
        {/* Header */}
        <div className="print-header">
          <div className="print-title">Activity Log Report</div>
          <div className="print-subtitle">Finisterre Cemetery Management System</div>
          <div className="print-subtitle" style={{ marginTop: '5px', fontSize: '12px' }}>
            Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Summary */}
        <div className="print-section">
          <div className="print-section-title">Log Summary</div>
          <div className="print-grid">
            <div className="print-label">Log ID</div>
            <div className="print-value">{log.log_id}</div>

            <div className="print-label">User</div>
            <div className="print-value">{log.username ?? log.user_id}</div>

            <div className="print-label">Action</div>
            <div className="print-value">{log.action}</div>

            <div className="print-label">Target</div>
            <div className="print-value">{log.target}</div>

            <div className="print-label">When</div>
            <div className="print-value">{when}</div>
          </div>
        </div>

        {/* Details */}
        <div className="print-section">
          <div className="print-section-title">Details</div>
          {log.details ? (
            <pre className="print-details" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'ui-monospace, Menlo, monospace' }}>
              {log.details}
            </pre>
          ) : (
            <div className="print-details" style={{ fontStyle: 'italic', color: '#666' }}>
              No additional details
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="print-footer">
          <div>Log #{log.log_id} • Printed via Quick Print</div>
        </div>
      </div>
    </div>
  )
})

PrintableLogDetails.displayName = 'PrintableLogDetails'

export default PrintableLogDetails
