import { type IconName } from 'lucide-react/dynamic'
import { Link } from 'react-router-dom'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type FAQItem = {
  id: string
  icon: IconName
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    id: 'item-1',
    icon: 'clock',
    question: 'What are the visiting hours?',
    answer:
      'Our memorial park is open to visitors daily from 7:00 AM to 7:00 PM. Holiday hours may vary and will be posted at the entrance and on our website.',
  },
  {
    id: 'item-2',
    icon: 'credit-card',
    question: 'What payment options are available for plots and services?',
    answer:
      'We accept major credit cards, checks, and bank transfers. Flexible payment plans are available for pre-need arrangements. Please contact our office for details.',
  },
  {
    id: 'item-3',
    icon: 'truck',
    question: 'Can I arrange for transportation or funeral processions?',
    answer:
      'Yes, we can assist with transportation arrangements and coordinate funeral processions within the park. Please speak with our staff for scheduling and guidelines.',
  },
  {
    id: 'item-4',
    icon: 'globe',
    question: 'Do you offer services for different faiths and cultures?',
    answer:
      'We welcome families of all faiths and backgrounds. Our staff can help accommodate specific cultural or religious traditions for memorial services and burials.',
  },
  {
    id: 'item-5',
    icon: 'package',
    question: 'How do I locate a loved one’s resting place?',
    answer:
      'You can use our online grave locator tool or visit the main office for assistance. Our staff is available to help you find any plot within the memorial park.',
  },
]

export default function FAQs() {
  return (
    <section id="faqs" aria-labelledby="faqs-heading" className="mt-20">
      <div className="landing-page-wrapper">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-4xl font-bold tracking-tight text-[var(--brand-primary)] lg:text-5xl">Frequently Asked Questions</h2>
            <p className="landing-subtitle mt-4">
              Can’t find the answer you’re looking for? Reach out to our{' '}
              <Link to="#contact" className="font-semibold text-[var(--brand-primary)]">
                customer support
              </Link>
              <span> team.</span>
            </p>
          </div>
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="rounded-lg border-none bg-white/60 shadow-sm">
                  <AccordionTrigger className="flex w-full items-center justify-between p-6 font-medium hover:no-underline">
                    <span className="text-left text-lg text-gray-700">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-base text-gray-500">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
