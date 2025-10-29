import type { ReactNode } from 'react'
import { BotIcon } from 'lucide-react'

import { PulsatingButton } from '@/components/pulsating-button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Chatbot from '@/pages/public/chatbot/Chatbot'

interface FloatingChatWidgetProps {
  tooltipText?: string
  icon?: React.ComponentType<{ className?: string }>
  content?: ReactNode
  tooltipClassName?: string
  buttonClassName?: string
}

export default function FloatingChatWidget({
  tooltipText = 'Chat with Finisbot!',
  icon: Icon = BotIcon,
  content = <Chatbot />,
  tooltipClassName = '',
  buttonClassName = '',
}: FloatingChatWidgetProps) {
  return (
    <div className="group">
      <div className="fixed right-22 bottom-8 z-30">
        <span
          className={`rounded-full bg-white px-4 py-2 text-[var(--brand-primary)] shadow-lg transition-opacity duration-300 group-hover:opacity-0 ${tooltipClassName}`}
        >
          {tooltipText}
        </span>
      </div>
      <div className="fixed right-4 bottom-4 z-30">
        <Sheet>
          <SheetTrigger asChild>
            <PulsatingButton className={`h-15 w-15 rounded-full bg-[var(--brand-primary)] shadow-lg ${buttonClassName}`}>
              <Icon className="text-white" />
            </PulsatingButton>
          </SheetTrigger>
          <SheetContent forceMount showClose={false} className="rounded-none border-none">
            {content}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
