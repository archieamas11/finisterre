import React from 'react'
import type { Customer } from '@/api/customer.api'
import { formatDate, ucwords } from '@/lib/format'
import { calculateYearsBuried } from '@/utils/date.utils'

interface PrintableCustomerDetailsProps {
  customer: Customer
}

export const PrintableCustomerDetails = React.forwardRef<HTMLDivElement, PrintableCustomerDetailsProps>(({ customer }, ref) => {
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
            margin-bottom: 25px;
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
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 15px;
          }
          
          .print-field {
            margin-bottom: 10px;
          }
          
          .print-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 3px;
          }
          
          .print-value {
            font-size: 13px;
            font-weight: 500;
          }
          
          .print-property-card {
            border: 1px solid #ddd;
            padding: 12px;
            margin-bottom: 15px;
            border-radius: 4px;
            background: #f9f9f9;
            page-break-inside: avoid;
          }
          
          .print-property-header {
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ccc;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .print-deceased-card {
            border-left: 3px solid #666;
            padding: 8px 12px;
            margin: 10px 0;
            background: #fff;
            page-break-inside: avoid;
          }
          
          .print-deceased-name {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 5px;
          }
          
          .print-deceased-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            font-size: 11px;
            margin-top: 8px;
          }
          
          .print-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
          }
          
          .print-badge-active {
            background: #fef3c7;
            color: #92400e;
            border: 1px solid #fbbf24;
          }
          
          .print-badge-completed {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #10b981;
          }
          
          .print-badge-cancelled {
            background: #ffe4e6;
            color: #9f1239;
            border: 1px solid #fb7185;
          }
          
          .print-footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #ddd;
            font-size: 11px;
            color: #666;
            text-align: center;
          }
          
          .no-data-message {
            text-align: center;
            padding: 20px;
            color: #999;
            font-style: italic;
            border: 1px dashed #ccc;
            border-radius: 4px;
          }
        }
      `}</style>

      <div className="print-container">
        {/* Header */}
        <div className="print-header">
          <div className="print-title">Customer Information Report</div>
          <div className="print-subtitle">Finisterre Cemetery Management System</div>
          <div className="print-subtitle" style={{ marginTop: '5px', fontSize: '12px' }}>
            Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Customer Profile Section */}
        <div className="print-section">
          <div className="print-section-title">Customer Profile</div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#e5e7eb',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              {customer.first_name.charAt(0)}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {customer.first_name}
              {customer.middle_name ? ` ${customer.middle_name}` : ''} {customer.last_name ? ` ${customer.last_name}` : ''}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Customer ID: {customer.customer_id}</div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="print-section">
          <div className="print-section-title">Contact Information</div>
          <div className="print-grid">
            <div className="print-field">
              <div className="print-label">Email Address</div>
              <div className="print-value">{customer.email || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Contact Number</div>
              <div className="print-value">{customer.contact_number || '-'}</div>
            </div>
          </div>
          <div className="print-field">
            <div className="print-label">Address</div>
            <div className="print-value">{customer.address || '-'}</div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="print-section">
          <div className="print-section-title">Personal Details</div>
          <div className="print-grid">
            <div className="print-field">
              <div className="print-label">Birth Date</div>
              <div className="print-value">{formatDate(customer.birth_date ?? undefined) || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Gender</div>
              <div className="print-value">{customer.gender || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Occupation</div>
              <div className="print-value">{customer.occupation || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Religion</div>
              <div className="print-value">{customer.religion || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Citizenship</div>
              <div className="print-value">{customer.citizenship || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Civil Status</div>
              <div className="print-value">{customer.status || '-'}</div>
            </div>
          </div>
        </div>

        {/* Property & Deceased Information */}
        <div className="print-section">
          <div className="print-section-title">Property & Deceased Information</div>
          {Array.isArray(customer.lot_info) && customer.lot_info.length > 0 ? (
            customer.lot_info.map((lot, idx) => {
              const hasGraveLot = lot.block != null && lot.block !== '' && lot.lot_plot_id != null
              const hasNiche = lot.category != null && lot.category !== '' && lot.niche_number != null
              const hasDeceased = Array.isArray(lot.deceased_info) && lot.deceased_info.length > 0

              return (
                <div key={`${lot.plot_id}-${lot.niche_number}-${idx}`} className="print-property-card">
                  <div className="print-property-header">
                    <div>
                      {hasGraveLot && (
                        <div>
                          <strong>Block {lot.block}</strong> - Grave {lot.lot_plot_id}
                        </div>
                      )}
                      {hasNiche && (
                        <div>
                          <strong>
                            {lot.category} {lot.plot_id ?? ''}
                          </strong>{' '}
                          - Niche {lot.niche_number}
                        </div>
                      )}
                    </div>
                    <div>
                      {lot.lot_status && ucwords(lot.lot_status) && (
                        <span
                          className={`print-badge ${
                            ucwords(lot.lot_status) === 'Active'
                              ? 'print-badge-active'
                              : ucwords(lot.lot_status) === 'Completed'
                                ? 'print-badge-completed'
                                : 'print-badge-cancelled'
                          }`}
                        >
                          {ucwords(lot.lot_status)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Deceased Information */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>Deceased Records:</div>
                    {hasDeceased ? (
                      lot.deceased_info.map((deceased, decIdx) => (
                        <div key={`${deceased.deceased_id}-${decIdx}`} className="print-deceased-card">
                          <div className="print-deceased-name">
                            {deceased.dead_fullname}
                            {deceased.status && ucwords(deceased.status) && (
                              <span className="print-badge" style={{ marginLeft: '8px', background: '#f3f4f6', border: '1px solid #d1d5db' }}>
                                {ucwords(deceased.status)}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>Deceased ID: {deceased.deceased_id}</div>
                          <div className="print-deceased-details">
                            <div>
                              <div className="print-label">Death Date</div>
                              <div>{formatDate(deceased.dead_date_death ?? undefined) || '-'}</div>
                            </div>
                            <div>
                              <div className="print-label">Interment Date</div>
                              <div>{formatDate(deceased.dead_interment ?? undefined) || '-'}</div>
                            </div>
                            <div>
                              <div className="print-label">Years Buried</div>
                              <div>{calculateYearsBuried(String(deceased.dead_date_death ?? ''))}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-data-message">No deceased records found for this property</div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="no-data-message">No property information available for this customer</div>
          )}
        </div>

        {/* Record Information */}
        <div className="print-section">
          <div className="print-section-title">Record Information</div>
          <div className="print-grid">
            <div className="print-field">
              <div className="print-label">Record Created</div>
              <div className="print-value">{formatDate(customer.created_at ?? undefined) || '-'}</div>
            </div>
            <div className="print-field">
              <div className="print-label">Last Updated</div>
              <div className="print-value">{formatDate(customer.updated_at ?? undefined) || '-'}</div>
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

PrintableCustomerDetails.displayName = 'PrintableCustomerDetails'
