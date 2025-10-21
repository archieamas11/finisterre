import type { DeceasedRecords } from '@/types/interment.types'
import React from 'react'

import { formatDate, ucwords } from '@/lib/format'
import { calculateYearsBuried } from '@/utils/date.utils'

interface PrintableDeceasedDetailsProps {
  deceased: DeceasedRecords
}

export const PrintableDeceasedDetails = React.forwardRef<HTMLDivElement, PrintableDeceasedDetailsProps>(({ deceased }, ref) => {
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
          .print-badge-transferred { background: #e0e7ff; color: #3730a3; border: 1px solid #6366f1; }
          .print-badge-cancelled { background: #ffe4e6; color: #9f1239; border: 1px solid #fb7185; }
          .print-footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #ddd; font-size: 11px; color: #666; text-align: center; }
        }
      `}</style>

      <div className="print-container">
        {/* Header */}
        <div className="print-header">
          <div className="print-title">Deceased Information Report</div>
          <div className="print-subtitle">Finisterre Cemetery Management System</div>
          <div className="print-subtitle" style={{ marginTop: '5px', fontSize: '12px' }}>
            Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Identity */}
        <div className="print-section">
          <div className="print-section-title">Identity</div>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{deceased.dead_fullname || deceased.full_name}</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Deceased ID: {deceased.deceased_id}</div>
            {deceased.status && (
              <div style={{ marginTop: '8px' }}>
                <span
                  className={`print-badge ${
                    ucwords(deceased.status) === 'Active'
                      ? 'print-badge-active'
                      : ucwords(deceased.status) === 'Transferred'
                        ? 'print-badge-transferred'
                        : 'print-badge-cancelled'
                  }`}
                >
                  {ucwords(deceased.status)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="print-section">
          <div className="print-section-title">Dates</div>
          <div className="print-grid">
            <div className="print-field">
              <div className="print-label">Birth Date</div>
              <div className="print-value">{formatDate(deceased.dead_birth_date ?? undefined) || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Date of Death</div>
              <div className="print-value">{formatDate(deceased.dead_date_death ?? undefined) || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Interment Date</div>
              <div className="print-value">{formatDate(deceased.dead_interment ?? undefined) || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Years Buried</div>
              <div className="print-value">{calculateYearsBuried(String(deceased.dead_date_death ?? ''))}</div>
            </div>
          </div>
        </div>

        {/* Property */}
        <div className="print-section">
          <div className="print-section-title">Property</div>
          <div className="print-grid">
            <div className="print-field">
              <div className="print-label">Category</div>
              <div className="print-value">{deceased.category || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Block</div>
              <div className="print-value">{deceased.block || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Plot</div>
              <div className="print-value">{deceased.plot_id || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Niche Number</div>
              <div className="print-value">{deceased.niche_number || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Lot ID</div>
              <div className="print-value">{deceased.lot_id || '-'}</div>
            </div>
          </div>
        </div>

        {/* Record Info */}
        <div className="print-section">
          <div className="print-section-title">Record Information</div>
          <div className="print-grid">
            <div className="print-field">
              <div className="print-label">Record Created</div>
              <div className="print-value">{formatDate(deceased.created_at ?? undefined) || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Last Updated</div>
              <div className="print-value">{formatDate(deceased.updated_at ?? undefined) || '-'}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="print-footer">
          <div>This is an official document generated from Finisterre Cemetery Management System</div>
          <div style={{ marginTop: '5px' }}>For inquiries, please contact the cemetery office</div>
        </div>
      </div>
    </div>
  )
})

PrintableDeceasedDetails.displayName = 'PrintableDeceasedDetails'
