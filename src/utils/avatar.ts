// 💡 Helper to generate deterministic DiceBear Adventurer avatar URLs.
// Uses seed to ensure same user gets same avatar. We keep options minimal for caching.
// Docs: https://www.dicebear.com/styles/adventurer
export function dicebearAdventurerUrl(seed: string, size = 64) {
  const safeSeed = encodeURIComponent(seed || 'guest')
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${safeSeed}&size=${size}&backgroundType=gradientLinear&radius=50` // roundish avatar
}

// 💡 Derive up to two-letter initials from a name. Falls back to provided fallback (default 'U').
export function getInitials(name: string | undefined | null, fallback = 'U') {
  if (!name) return fallback
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  if (parts.length === 0) return fallback
  return (
    parts
      .map((p) => p[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 2) || fallback
  )
}
