import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Clock, MessageCircle, Phone, PhoneCall, Voicemail } from 'lucide-react'

// Subject options (will be mapped to Select). Can be extended later.
const SUBJECT_OPTIONS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Support' },
  { value: 'billing', label: 'Billing' },
  { value: 'other', label: 'Other' },
]

// Business hours (could be moved to a CMS later)
const BUSINESS_HOURS = [
  { day: 'Monday - Friday', time: '8:00 AM – 5:00 PM' },
  { day: 'Saturday', time: '8:00 AM – 12:00 PM' },
  { day: 'Sunday & Holidays', time: 'By Appointment' },
]

// Contact method entries
const CONTACT_METHODS = [
  { id: 'messenger', label: 'Messenger', value: 'm.me/finisterregardenz', icon: MessageCircle },
  { id: 'viber', label: 'Viber', value: '+63 998 841 1173', icon: PhoneCall },
  { id: 'mobile', label: 'Mobile', value: '+63 917 621 6823', icon: Phone },
  { id: 'landline', label: 'Landline', value: '407 3099 | 254 3065', icon: Voicemail },
]

// Phone regex: allows +, spaces, dashes, parentheses but must contain 7-15 digits total.
const phoneRegex = /^(?=.*\d)[+()\d\s-]{7,20}$/

const formSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  email: z.string().email('Enter a valid email'),
  phone_number: z.string().trim().regex(phoneRegex, 'Enter a valid phone number').optional().or(z.literal('')),
  subject: z.enum(['general', 'support', 'billing', 'other'], { error: 'Select a subject' }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export default function ContactUs() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      subject: undefined,
      message: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const simulatedSubmit = async () => {
      // Simulate latency (e.g., API call)
      await new Promise((res) => setTimeout(res, 800))
      // Replace with real request later
      return values
    }
    try {
      await toast.promise(simulatedSubmit(), {
        loading: 'Sending message...',
        success: 'Message sent! We will get back to you soon.',
        error: 'Failed to send. Please try again.',
      })
      form.reset()
    } catch (error) {
      // error already handled by toast.promise
      console.error('Submit error', error)
    }
  }

  return (
    <section id="contact" className="py-24 sm:py-32" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 id="contact-heading" className="text-4xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-5xl">
            We'd Love to Hear From You
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-800">
            Have questions about our memorial estates or need assistance? Send us a message or reach us through any of the channels below.
          </p>
        </div>
        <div className="flex flex-col items-start justify-center gap-12 md:flex-row md:items-start">
          <div className="w-full">
            <Card className="border-white/50 bg-white/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[var(--brand-primary)]">Send Us a Message</CardTitle>
                <CardDescription className="text-gray-600">Fill out the form below and we'll respond within 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">First name</FormLabel>
                            <FormControl>
                              <Input
                                className="border border-gray-400 text-gray-600"
                                placeholder="Enter your first name"
                                autoComplete="given-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">Last name</FormLabel>
                            <FormControl>
                              <Input
                                className="border border-gray-400 text-gray-600"
                                placeholder="Enter your last name"
                                autoComplete="family-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">Email</FormLabel>
                          <FormControl>
                            <Input
                              className="border border-gray-400 text-gray-600"
                              placeholder="Enter your email"
                              type="email"
                              autoComplete="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">Phone number (optional)</FormLabel>
                          <FormControl>
                            <Input
                              className="border border-gray-400 text-gray-600"
                              placeholder="e.g. +63 912 345 6789"
                              type="tel"
                              inputMode="tel"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">Subject</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full border border-gray-400 text-gray-600">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-white/50 bg-white text-gray-800">
                              {SUBJECT_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-600">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please share how we can help you..."
                              className="resize-none border border-gray-400 text-gray-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
          </div>
          <aside className="flex w-full flex-col gap-6 md:max-w-lg">
            <Card aria-labelledby="business-hours-heading" className="border-white/50 bg-white/50 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-2 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </div>
                <CardTitle id="business-hours-heading" className="text-lg font-bold text-[var(--brand-primary)]">
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <ul className="space-y-3">
                  {BUSINESS_HOURS.map((item) => (
                    <li key={item.day} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm">
                      <span className="font-medium text-gray-700">{item.day}</span>
                      <span className="text-gray-500">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card aria-labelledby="contact-methods-heading" className="border-white/50 bg-white/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle id="contact-methods-heading" className="text-lg font-bold text-[var(--brand-primary)]">
                  Other Ways to Reach Us
                </CardTitle>
                <CardDescription className="text-gray-600">Choose your preferred channel</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-3">
                  {CONTACT_METHODS.map((method) => {
                    const Icon = method.icon
                    const link =
                      method.id === 'messenger'
                        ? `https://${method.value}`
                        : method.id === 'viber'
                          ? `viber://chat?number=${encodeURIComponent(method.value.replace(/[^\d+]/g, ''))}`
                          : method.id === 'mobile'
                            ? `tel:${method.value.replace(/[^\d+]/g, '')}`
                            : method.id === 'landline'
                              ? `tel:${method.value.replace(/[^\d+]/g, '')}`
                              : undefined
                    return (
                      <li key={method.id}>
                        <a
                          href={link}
                          className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 transition-all hover:border-[var(--brand-primary)] hover:shadow-md"
                          target={method.id === 'messenger' ? '_blank' : undefined}
                          rel={method.id === 'messenger' ? 'noopener' : undefined}
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
                  })}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  )
}
