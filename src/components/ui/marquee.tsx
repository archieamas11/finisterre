import * as React from 'react'
import { type ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number
}

export function Marquee({ className, reverse = false, pauseOnHover = false, children, vertical = false, repeat = 4, ...props }: MarqueeProps) {
  const directionClass = vertical ? 'flex-col animate-marquee-vertical' : 'flex-row animate-marquee'
  // We still keep the tailwind group-hover utility as a progressive enhancement,
  // but it doesn't always work reliably across some browsers when using pointer
  // devices. We'll also control play state via JS handlers below.
  const hoverClass = pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
  const reverseClass = reverse ? '[animation-direction:reverse]' : ''

  const [isPaused, setIsPaused] = React.useState(false)

  const onPointerEnter = pauseOnHover ? () => setIsPaused(true) : undefined

  const onPointerLeave = pauseOnHover ? () => setIsPaused(false) : undefined

  // Clone the content twice for a seamless, continuous loop
  const content = Array.from({ length: repeat }).map((_, idx) => <React.Fragment key={idx}>{children}</React.Fragment>)

  return (
    <div
      {...props}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={cn('group relative flex overflow-hidden p-2 [--duration:40s] [--gap:1rem]', vertical ? 'flex-col' : 'flex-row', className)}
    >
      <div
        style={isPaused ? { animationPlayState: 'paused' as const } : undefined}
        className={cn('flex shrink-0 [gap:var(--gap)]', directionClass, hoverClass, reverseClass)}
      >
        {content}
      </div>
      <div
        aria-hidden="true"
        style={isPaused ? { animationPlayState: 'paused' as const } : undefined}
        className={cn('flex shrink-0 [gap:var(--gap)]', directionClass, hoverClass, reverseClass)}
      >
        {content}
      </div>
    </div>
  )
}
