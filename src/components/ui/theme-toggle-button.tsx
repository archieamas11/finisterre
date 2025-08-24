'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'

import { type AnimationStart, type AnimationVariant, createAnimation } from '@/components/provider/theme-animations'
import { Button } from '@/components/ui/button'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

interface ThemeToggleAnimationProps {
  variant?: AnimationVariant
  start?: AnimationStart
  showLabel?: boolean
  url?: string
}

export function ThemeToggleButton({ variant = 'circle-blur', start = 'top-left', showLabel = false, url = '' }: ThemeToggleAnimationProps) {
  const { theme, setTheme } = useTheme()

  const styleId = 'theme-transition-styles'

  const updateStyles = React.useCallback((css: string, _name: string) => {
    if (typeof window === 'undefined') return

    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = css
  }, [])

  const toggleTheme = React.useCallback(() => {
    const animation = createAnimation(variant, start, url)

    updateStyles(animation.css, animation.name)

    if (typeof window === 'undefined') return

    const switchTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }

    if (!document.startViewTransition) {
      switchTheme()
      return
    }

    document.startViewTransition(switchTheme)
  }, [theme, setTheme])

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button onClick={toggleTheme} className="mr-2 h-8 w-8 rounded-full border" variant="ghost" size="lg" name="Theme Toggle Button">
            <SunIcon className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-transform duration-500 ease-in-out dark:scale-100 dark:rotate-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-transform duration-500 ease-in-out dark:scale-0 dark:-rotate-90" />
            <span className="sr-only">Theme Toggle </span>
            {showLabel && (
              <>
                <span className="absolute -top-10 hidden rounded-full border px-2 group-hover:block"> variant = {variant}</span>
                <span className="absolute -bottom-10 hidden rounded-full border px-2 group-hover:block"> start = {start}</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Switch to {theme === 'dark' ? 'light' : 'dark'} mode</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
