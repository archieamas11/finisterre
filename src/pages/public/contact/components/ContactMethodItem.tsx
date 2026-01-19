import type { ContactMethodItemProps } from '../types'
import { getContactMethodLink } from '../utils'

export function ContactMethodItem({ method }: ContactMethodItemProps) {
  const Icon = method.icon
  const link = getContactMethodLink(method)
  const isExternal = method.id === 'messenger'

  return (
    <li>
      <a
        href={link}
        className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 transition-all hover:border-[var(--brand-primary)] hover:shadow-md"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener' : undefined}
        aria-label={`Contact us via ${method.label}`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{method.label}</span>
          <span className="text-xs text-gray-500">{method.value}</span>
        </div>
      </a>
    </li>
  )
}
