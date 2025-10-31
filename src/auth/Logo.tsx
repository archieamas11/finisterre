import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link className="mb-4" to="/">
      <div className="rounded-lg bg-[var(--brand-primary)]/50 p-2">
        <img src="/favicon.svg" className="h-8 w-8" alt="Home Logo" />
      </div>
    </Link>
  )
}
