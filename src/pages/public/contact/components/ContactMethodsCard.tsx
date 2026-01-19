import type { ContactMethod } from '../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CONTACT_METHODS } from '../constants'
import { ContactMethodItem } from './ContactMethodItem'

export function ContactMethodsCard() {
  return (
    <Card aria-labelledby="contact-methods-heading" className="border-white/50 bg-white/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle id="contact-methods-heading" className="text-lg font-bold text-[var(--brand-primary)]">
          Other Ways to Reach Us
        </CardTitle>
        <CardDescription className="text-gray-600">Choose your preferred channel</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="space-y-3">
          {CONTACT_METHODS.map((method: ContactMethod) => (
            <ContactMethodItem key={method.id} method={method} />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
