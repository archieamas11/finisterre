import * as React from 'react';
import { cn } from '@/lib/utils';
import { type ComponentPropsWithoutRef } from 'react';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  const directionClass = vertical ? 'flex-col animate-marquee-vertical' : 'flex-row animate-marquee';
  const hoverClass = pauseOnHover ? 'group-hover:[animation-play-state:paused]' : '';
  const reverseClass = reverse ? '[animation-direction:reverse]' : '';

  // Clone the content twice for a seamless, continuous loop
  const content = Array.from({ length: repeat }).map((_, idx) => (
    <React.Fragment key={idx}>{children}</React.Fragment>
  ));

  return (
  <div
      {...props}
      className={cn(
    'group relative flex overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
    vertical ? 'flex-col' : 'flex-row',
    className,
      )}
    >
      <div
        className={cn(
          'flex shrink-0 [gap:var(--gap)]',
          directionClass,
          hoverClass,
          reverseClass,
        )}
      >
        {content}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'flex shrink-0 [gap:var(--gap)]',
          directionClass,
          hoverClass,
          reverseClass,
        )}
      >
        {content}
      </div>
    </div>
  );
}
