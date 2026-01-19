import type { ContactFormProps } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { EmailField, HoneypotField, MessageField, NameFields, PhoneField, SubjectField } from './form-fields'

export function ContactForm({ form, onSubmit }: ContactFormProps) {
  return (
    <Card className="border-white/50 bg-white/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[var(--brand-primary)]">Send Us a Message</CardTitle>
        <CardDescription className="text-gray-600">Fill out the form below and we'll respond within 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <NameFields form={form} />
            <EmailField form={form} />
            <PhoneField form={form} />
            <SubjectField form={form} />
            <MessageField form={form} />
            <HoneypotField form={form} />
            <Button
              type="submit"
              className="mt-10 h-12 w-full rounded-lg bg-[var(--brand-primary)] font-semibold text-white hover:bg-[var(--brand-primary)]/90"
            >
              Send Message
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
