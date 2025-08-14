"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Link } from "react-router-dom";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FAQs() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "clock",
      question: "What are the visiting hours?",
      answer: "Our memorial park is open to visitors daily from 7:00 AM to 7:00 PM. Holiday hours may vary and will be posted at the entrance and on our website.",
    },
    {
      id: "item-2",
      icon: "credit-card",
      question: "What payment options are available for plots and services?",
      answer: "We accept major credit cards, checks, and bank transfers. Flexible payment plans are available for pre-need arrangements. Please contact our office for details.",
    },
    {
      id: "item-3",
      icon: "truck",
      question: "Can I arrange for transportation or funeral processions?",
      answer: "Yes, we can assist with transportation arrangements and coordinate funeral processions within the park. Please speak with our staff for scheduling and guidelines.",
    },
    {
      id: "item-4",
      icon: "globe",
      question: "Do you offer services for different faiths and cultures?",
      answer: "We welcome families of all faiths and backgrounds. Our staff can help accommodate specific cultural or religious traditions for memorial services and burials.",
    },
    {
      id: "item-5",
      icon: "package",
      question: "How do I locate a loved one’s resting place?",
      answer: "You can use our online grave locator tool or visit the main office for assistance. Our staff is available to help you find any plot within the memorial park.",
    },
  ];

  return (
    <section className="bg-muted dark:bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="mt-4 text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="text-muted-foreground mt-4">
                Can't find what you're looking for? Contact our{" "}
                <Link to="#" className="text-primary font-medium hover:underline">
                  customer support team
                </Link>
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="bg-background rounded-lg border px-4 shadow-xs last:border-b">
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon name={item.icon} className="m-auto size-4" />
                      </div>
                      <span className="text-base">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
