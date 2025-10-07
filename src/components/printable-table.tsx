import React from 'react'
import type { Table } from '@tanstack/react-table'

/**
 * A reusable component for printing table data in a formatted report layout.
 *
 * Features:
 * - Automatically excludes action and select columns
 * - Uses column meta labels or custom headers for column names
 * - Prints all table rows (not just current page)
 * - Professional print styling with A4 margins
 * - Row numbers (optional)
 * - Customizable title and subtitle
 *
 * Usage:
 * ```tsx
 * import { PrintableTable } from '@/components/printable-table'
 * import { useReactToPrint } from 'react-to-print'
 * import { useRef } from 'react'
 *
 * const contentRef = useRef<HTMLDivElement>(null)
 * const reactToPrintFn = useReactToPrint({ contentRef })
 *
 * // In your component JSX:
 * <PrintableTable
 *   ref={contentRef}
 *   table={table}
 *   title="Customer Records Report"
 *   subtitle="Finisterre Cemetery Management System"
 *   customHeaders={{
 *     full_name: 'Full Name',
 *     contact_info: 'Contact Information',
 *   }}
 * />
 *
 * // Print button:
 * <Button onClick={reactToPrintFn}>
 *   <PrinterIcon />
 *   Print
 * </Button>
 * ```
 */

interface PrintableTableProps<TData> {
  table: Table<TData>
  title?: string
  subtitle?: string
  showRowNumbers?: boolean
  customHeaders?: Record<string, string>
}

export const PrintableTable = React.forwardRef<HTMLDivElement, PrintableTableProps<any>>(
  ({ table, title = 'Data Report', subtitle, showRowNumbers = true, customHeaders = {} }, ref) => {
    // Get visible columns (excluding actions and select columns)
    const printableColumns = table.getAllColumns().filter((column) => {
      const columnDef = column.columnDef
      return (
        column.getIsVisible() && column.id !== 'select' && column.id !== 'actions' && !columnDef.cell?.toString()?.includes('CustomerActionsCell')
      )
    })

    // Get all filtered and sorted rows from the table (not just the current page)
    const allRows = table.getSortedRowModel().rows

    // Helper function to get cell value for printing
    const getCellValue = (row: any, columnId: string) => {
      const column = table.getColumn(columnId)
      if (!column) return ''

      const columnDef = column.columnDef

      // Use meta.print if available (allows columns to expose a printable string)
      if ('meta' in columnDef && (columnDef as any).meta?.print) {
        const printVal = (columnDef as any).meta.print
        return typeof printVal === 'function' ? printVal(row.original, row.index) : printVal
      }

      // Resolve value using accessorFn/accessorKey/fallback
      let val: any = ''
      if ('accessorFn' in columnDef && columnDef.accessorFn) {
        val = columnDef.accessorFn(row.original, row.index)
      } else if ('accessorKey' in columnDef && columnDef.accessorKey) {
        val = row.original[columnDef.accessorKey as keyof typeof row.original]
      } else {
        val = row.original[columnId as keyof typeof row.original] || ''
      }

      // If value looks like an epoch timestamp (number or numeric string), format to local date/time
      if (typeof val === 'number' && Number.isFinite(val)) {
        // Treat large numbers (> 1e11) as milliseconds, else seconds
        const asMs = val > 1e11 ? val : val * 1000
        const d = new Date(asMs)
        if (!isNaN(d.getTime())) return d.toLocaleString()
      }

      if (typeof val === 'string' && /^\d{10,13}$/.test(val)) {
        const num = Number(val)
        const asMs = num > 1e11 ? num : num * 1000
        const d = new Date(asMs)
        if (!isNaN(d.getTime())) return d.toLocaleString()
      }

      return val
    }

    // Get column header label
    const getColumnLabel = (columnId: string) => {
      const column = table.getColumn(columnId)
      if (!column) return columnId

      const columnDef = column.columnDef

      // Check custom headers first
      if (customHeaders[columnId]) {
        return customHeaders[columnId]
      }

      // Use meta label if available
      if ('meta' in columnDef && columnDef.meta?.label) {
        return columnDef.meta.label
      }

      // Use header string if it's a string
      if (typeof columnDef.header === 'string') {
        return columnDef.header
      }

      // Use column id as fallback
      return columnId.charAt(0).toUpperCase() + columnId.slice(1)
    }

    return (
      <div ref={ref} className="hidden print:block">
        <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body {
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
          }

          .print-container {
            max-width: none;
            margin: 0;
            padding: 0;
          }

          .print-header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }

          .print-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .print-subtitle {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }

          .print-date {
            font-size: 10px;
            color: #666;
          }

          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 10px;
          }

          .print-table th {
            background: #f5f5f5;
            border: 1px solid #ddd;
            padding: 8px 4px;
            text-align: left;
            font-weight: bold;
            font-size: 9px;
            text-transform: uppercase;
          }

          .print-table td {
            border: 1px solid #ddd;
            padding: 6px 4px;
            vertical-align: top;
            word-wrap: break-word;
          }

          .print-table tr:nth-child(even) {
            background: #fafafa;
          }

          .print-table .row-number {
            width: 30px;
            text-align: center;
            font-weight: bold;
            background: #e0e0e0;
          }

          .print-footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 9px;
            color: #666;
            text-align: center;
          }

          .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
            font-style: italic;
          }

          .page-break {
            page-break-before: always;
          }

          /* Ensure table doesn't break awkwardly */
          .print-table,
          .print-table tr,
          .print-table td,
          .print-table th {
            page-break-inside: avoid;
          }
        }
      `}</style>

        <div className="print-container">
          {/* Header */}
          <div className="print-header">
            <div className="print-title">{title}</div>
            {subtitle && <div className="print-subtitle">{subtitle}</div>}
            <div className="print-date">
              Generated on{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="print-date">Total Records: {allRows.length}</div>
          </div>

          {/* Table */}
          {allRows.length > 0 ? (
            <table className="print-table">
              <thead>
                <tr>
                  {showRowNumbers && <th className="row-number">#</th>}
                  {printableColumns.map((column) => (
                    <th key={column.id}>{getColumnLabel(column.id)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allRows.map((row, index) => (
                  <tr key={row.id}>
                    {showRowNumbers && <td className="row-number">{index + 1}</td>}
                    {printableColumns.map((column) => (
                      <td key={column.id}>{String(getCellValue(row, column.id) || '-')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">No data available for printing</div>
          )}

          {/* Footer */}
          <div className="print-footer">
            <div>Report generated from Finisterre Management System</div>
            <div>For official use only</div>
          </div>
        </div>
      </div>
    )
  },
)

PrintableTable.displayName = 'PrintableTable'
