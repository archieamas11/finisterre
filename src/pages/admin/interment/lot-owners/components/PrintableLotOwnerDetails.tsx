import React from 'react'
import type { LotOwners } from '@/types/interment.types'
import { formatDate, ucwords } from '@/lib/format'

interface PrintableLotOwnerDetailsProps {
  lotOwner: LotOwners
}

export const PrintableLotOwnerDetails = React.forwardRef<HTMLDivElement, PrintableLotOwnerDetailsProps>(({ lotOwner }, ref) => {
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
          .print-section { margin-bottom: 25px; page-break-inside: avoid; }
          .print-section-title { font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 12px; text-transform: uppercase; }
          .print-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px; }
          .print-field { margin-bottom: 10px; }
          .print-label { font-size: 11px; color: #666; text-transform: uppercase; font-weight: 600; margin-bottom: 3px; }
          .print-value { font-size: 13px; font-weight: 500; }
          .print-badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 600; }
          .print-badge-active { background: #fef3c7; color: #92400e; border: 1px solid #fbbf24; }
          .print-badge-completed { background: #d1fae5; color: #065f46; border: 1px solid #10b981; }
          .print-badge-cancelled { background: #ffe4e6; color: #9f1239; border: 1px solid #fb7185; }
          .print-footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #ddd; font-size: 11px; color: #666; text-align: center; }
        }
      `}</style>

      <div className="print-container">
        <div className="print-header">
          <div className="print-title">Lot Ownership Report</div>
          <div className="print-subtitle">Finisterre Cemetery Management System</div>
          <div className="print-subtitle" style={{ marginTop: '5px', fontSize: '12px' }}>
            Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Lot Details */}
        <div className="print-section">
          <div className="print-section-title">Lot Details</div>
          <div className="print-grid">
            <div className="print-field">
              <div className="print-label">Lot ID</div>
              <div className="print-value">{lotOwner.lot_id}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Customer ID</div>
              <div className="print-value">{lotOwner.customer_id}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Customer Name</div>
              <div className="print-value">{lotOwner.customer_name || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Category</div>
              <div className="print-value">{lotOwner.category}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Block</div>
              <div className="print-value">{lotOwner.block || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Plot</div>
              <div className="print-value">{lotOwner.plot_id}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Niche Number</div>
              <div className="print-value">{lotOwner.niche_number || '-'}</div>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            {lotOwner.lot_status && (
              <span
                className={`print-badge ${
                  ucwords(lotOwner.lot_status) === 'Active'
                    ? 'print-badge-active'
                    : ucwords(lotOwner.lot_status) === 'Completed'
                      ? 'print-badge-completed'
                      : 'print-badge-cancelled'
                }`}
              >
                {ucwords(lotOwner.lot_status)}
              </span>
            )}
          </div>
        </div>

        {/* Record Info */}
        <div className="print-section">
          <div className="print-section-title">Record Information</div>
          <div className="print-grid">
            <div className="print-field">
              <div className="print-label">Created At</div>
              <div className="print-value">{formatDate(lotOwner.created_at ?? undefined) || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Updated At</div>
              <div className="print-value">{formatDate(lotOwner.updated_at ?? undefined) || '-'}</div>
            </div>
          </div>
        </div>

        <div className="print-footer">
          <div>This is an official document generated from Finisterre Cemetery Management System</div>
          <div style={{ marginTop: '5px' }}>For inquiries, please contact the cemetery office</div>
        </div>
      </div>
    </div>
  )
})

PrintableLotOwnerDetails.displayName = 'PrintableLotOwnerDetails'
