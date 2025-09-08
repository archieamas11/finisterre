type Props = {
  steps: string[]
}

export function DirectionsList({ steps }: Props) {
  if (steps.length === 0) return null
  return (
    <div style={{ position: 'absolute', top: 56, left: 10, zIndex: 2 }} className="bg-background rounded-md border p-3 shadow">
      <div className="text-foreground mb-2 text-sm font-medium">Walking directions</div>
      <ol className="max-h-64 w-72 list-decimal space-y-1 overflow-auto pl-5 text-sm">
        {steps.map((ins, idx) => (
          <li key={idx}>{ins}</li>
        ))}
      </ol>
    </div>
  )
}
