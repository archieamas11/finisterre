import type { ContactPayload } from '@/api/contact.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { FormValues } from './types'
import { sendContactMessage } from '@/api/contact.api'
import { executeRecaptcha, isRecaptchaConfigured } from '@/lib/recaptcha'
import { BusinessHoursCard } from './components/BusinessHoursCard'
import { ContactForm } from './components/ContactForm'
import { ContactMethodsCard } from './components/ContactMethodsCard'
import { formSchema } from './schema'

export function ContactSection() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      subject: undefined,
      message: '',
      honeypot: '',
    },
  })

  async function onSubmit(values: FormValues) {
    // Honeypot check for bot prevention
    if (values.honeypot?.trim()) {
      return
    }

    try {
      let recaptchaToken: string | undefined

      if (isRecaptchaConfigured()) {
        try {
          recaptchaToken = await executeRecaptcha('contact')
        } catch (error) {
          console.warn('reCAPTCHA execution failed:', error)
        }
      }

      const payload: ContactPayload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number || undefined,
        subject: values.subject,
        message: values.message,
        honeypot: values.honeypot,
        recaptcha_token: recaptchaToken,
      }

      await toast.promise(sendContactMessage(payload), {
        loading: 'Sending message...',
        success: (res) => (res?.success ? 'Message sent! We will get back to you soon.' : res?.message || 'Failed to send'),
        error: (err) => err?.message || 'Failed to send. Please try again.',
      })

      form.reset()
    } catch (error) {
      console.error('Contact form submission error:', error)
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="mt-20">
      <div className="landing-page-wrapper">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 id="contact-heading" className="landing-title">
            We'd Love to Hear From You
          </h2>
          <p className="landing-subtitle">
            Have questions about our memorial estates or need assistance? Send us a message or reach us through any of the channels below.
          </p>
        </div>
        <div className="flex flex-col items-start justify-center gap-12 md:flex-row md:items-start">
          <div className="w-full">
            <ContactForm form={form} onSubmit={onSubmit} />
          </div>
          <aside className="flex w-full flex-col gap-6 md:max-w-lg">
            <BusinessHoursCard />
            <ContactMethodsCard />
          </aside>
        </div>
      </div>
    </section>
  )
}
