import type { ContactMethod } from './types'

export function getContactMethodLink(method: ContactMethod): string {
  const sanitizedPhone = method.value.replace(/[^\d+]/g, '')

  const linkMap = {
    messenger: `https://${method.value}`,
    viber: `viber://chat?number=${encodeURIComponent(sanitizedPhone)}`,
    mobile: `tel:${sanitizedPhone}`,
    landline: `tel:${sanitizedPhone}`,
  } as const

  return linkMap[method.id as keyof typeof linkMap] || '#'
}
