import React from 'react'

interface SectionHeaderProps {
  title: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="bg-border h-px flex-1" />
      <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">{title}</h3>
      <div className="bg-border h-px flex-1" />
    </div>
  )
}

interface InfoItemProps {
  label: string
  value?: string | null
  children?: React.ReactNode
}

export function InfoItem({ label, value, children }: InfoItemProps) {
  return (
    <div>
      <div className="text-muted-foreground mb-1 text-xs">{label}</div>
      <div className="font-medium">
        {value !== undefined && value !== null ? value : '-'}
        {children}
      </div>
    </div>
  )
}
