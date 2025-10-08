'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'

import { type AnimationStart, type AnimationVariant, createAnimation } from '@/components/provider/theme-animations'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

interface ThemeToggleAnimationProps {
  variant?: AnimationVariant
  start?: AnimationStart
  url?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  /** Whether to display a dynamic text label (Dark mode / Light mode). */
  showTitle?: boolean
}

export function ThemeToggleButton({
  variant = 'circle-blur',
  start = 'top-left',
  url = '',
  size = 'md',
  className,
  showTitle = false,
}: ThemeToggleAnimationProps) {
  const { theme, setTheme } = useTheme()

  const styleId = 'theme-transition-styles'

  const sizeClasses = {
    sm: {
      button: 'h-8 w-8',
      icon: 'h-[1.1rem] w-[1.1rem]',
    },
    md: {
      button: 'h-9 w-9',
      icon: 'h-[1.2rem] w-[1.2rem]',
    },
    lg: {
      button: 'h-10 w-10',
      icon: 'h-[1.4rem] w-[1.4rem]',
    },
  }

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
  }, [theme, setTheme, variant, start, url, updateStyles])

  const dynamicLabel = theme === 'light' ? 'Dark mode' : 'Light mode'
  const showLabel = showTitle

  return (
    <div className={cn('flex items-center', showLabel ? '' : 'gap-2')}>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleTheme}
              className={cn(
                'relative flex items-center justify-center gap-2 rounded-full transition-colors',
                showLabel ? 'h-9 w-auto rounded-md px-3' : sizeClasses[size].button,
                className,
              )}
              variant="ghost"
              size={showLabel ? 'default' : 'icon'}
              aria-label={showLabel ? undefined : 'Toggle theme'}
              type="button"
            >
              <span className="relative inline-flex items-center justify-center">
                <SunIcon
                  className={cn(
                    'scale-0 rotate-90 transition-transform duration-500 ease-in-out dark:scale-100 dark:rotate-0',
                    sizeClasses[size].icon,
                  )}
                  aria-hidden="true"
                />
                <MoonIcon
                  className={cn(
                    'absolute scale-100 rotate-0 transition-transform duration-500 ease-in-out dark:scale-0 dark:-rotate-90',
                    sizeClasses[size].icon,
                  )}
                  aria-hidden="true"
                />
              </span>
              {showLabel && <span className="text-sm leading-none font-medium">{dynamicLabel}</span>}
              {!showLabel && <span className="sr-only">Toggle theme</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Switch to {theme === 'dark' ? 'light' : 'dark'} mode</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

// Menu-item variant: renders a proper DropdownMenuItem with icon + label matching other menu entries
// Keeps animation behavior consistent with button version
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface ThemeToggleMenuItemProps extends Omit<ThemeToggleAnimationProps, 'size'> {
  iconSize?: number
}

export function ThemeToggleMenuItem({
  variant = 'circle-blur',
  start = 'top-left',
  url = '',
  showTitle = true,
  className,
  iconSize = 16,
}: ThemeToggleMenuItemProps) {
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
  }, [theme, setTheme, variant, start, url, updateStyles])

  const dynamicLabel = theme === 'light' ? 'Dark mode' : 'Light mode'

  return (
    <DropdownMenuItem onClick={toggleTheme} aria-label="Toggle theme" className={cn(className)}>
      <span className="relative inline-flex items-center justify-center" aria-hidden="true" style={{ width: iconSize, height: iconSize }}>
        <SunIcon className={cn('h-4 w-4 scale-0 rotate-90 transition-transform duration-500 ease-in-out dark:scale-100 dark:rotate-0')} />
        <MoonIcon className={cn('absolute h-4 w-4 scale-100 rotate-0 transition-transform duration-500 ease-in-out dark:scale-0 dark:-rotate-90')} />
      </span>
      {showTitle && <span>{dynamicLabel}</span>}
    </DropdownMenuItem>
  )
}
