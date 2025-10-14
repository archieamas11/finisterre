import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { loginUser } from '@/api/auth.api'
import { executeRecaptcha, isRecaptchaConfigured } from '@/lib/recaptcha'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormMessage, FormField, FormLabel, FormItem, Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Spinner from '@/components/ui/spinner'
import { useAuthQuery } from '@/hooks/useAuthQuery'
import { cn } from '@/lib/utils'
import { isNativePlatform } from '@/utils/platform.utils'

const FormSchema = z.object({
  remember: z.boolean().optional(),
  password: z.string().min(3, { message: 'Password must be at least 4 characters.' }),
  username: z.string().min(2, { message: 'Property ID must be at least 2 characters.' }),
  honeypot: z.string().optional(),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const { data, isSuccess, setAuthFromToken } = useAuthQuery()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
      remember: false,
      honeypot: '',
    },
  })

  React.useEffect(() => {
    const hasToken = !!localStorage.getItem('token')
    if (hasToken && isSuccess && data?.success) {
      const role = data?.user?.role

      if (isNativePlatform()) {
        navigate('/landing-android', { replace: true })
      } else {
        navigate(role === 'user' ? '/user' : '/admin', { replace: true })
      }
    }
  }, [data, isSuccess, navigate])

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    if (formData.honeypot?.trim()) {
      return
    }

    setIsLoading(true)

    try {
      const recaptchaToken = await getRecaptchaToken()
      const res = await loginUser(formData.username, formData.password, recaptchaToken, formData.honeypot)

      if (res.success) {
        handleSuccessfulLogin(res, formData.username)
      } else {
        handleLoginError(res)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const getRecaptchaToken = async (): Promise<string | undefined> => {
    if (!isRecaptchaConfigured()) return undefined

    try {
      return await executeRecaptcha('login')
    } catch (error) {
      console.warn('reCAPTCHA error:', error)
      return undefined
    }
  }

  const handleSuccessfulLogin = (res: { token?: string; role?: string }, username: string) => {
    if (res.token) localStorage.setItem('token', res.token)
    if (res.role) localStorage.setItem('role', res.role)

    setAuthFromToken()
    toast.success(`Welcome back, ${username}!`)

    const destination = getNavigationDestination(res.role)
    navigate(destination)
  }

  // Helper function to determine navigation destination
  const getNavigationDestination = (role?: string): string => {
    if (isNativePlatform()) {
      return '/landing-android'
    }
    return role === 'user' ? '/user' : '/admin'
  }

  // Helper function to handle login errors
  const handleLoginError = (res: { message?: string }) => {
    form.setValue('password', '')

    const isAuthError = res.message === 'User not found' || res.message === 'Invalid password'

    if (isAuthError) {
      const fieldToError = res.message === 'User not found' ? 'username' : 'password'
      form.setError(fieldToError, {
        type: 'manual',
        message: 'Incorrect Property ID or Password',
      })
      toast.error('Please check your credentials and try again')
    } else {
      toast.error('Something went wrong. Please try again later.')
    }
  }

  return (
    <main className="bg-background flex min-h-screen items-center justify-center" aria-label="Login page">
      <Card className="mx-auto w-full max-w-sm p-8 shadow-lg">
        <div className="mb-2 flex flex-col items-center">
          <Link
            className="mb-4"
            to="/"
            aria-label="Back to home"
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate('/')
              }
            }}
            role="link"
            tabIndex={0}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="border-primary bg-accent relative z-20 rounded-lg border p-2">
              <img src="/favicon.svg" className="h-8 w-8" alt="Home Logo" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Sign in to your account</h1>
          <p className="text-muted-foreground mt-1 text-sm">Welcome back! Please enter your credentials.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Login form" autoComplete="on">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">Property ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your property ID"
                      autoComplete="username"
                      id="username"
                      type="text"
                      {...field}
                      aria-required="true"
                      aria-label="Property ID"
                    />
                  </FormControl>
                  <FormMessage aria-live="polite" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        autoComplete="current-password"
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        {...field}
                        aria-required="true"
                        aria-label="Password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute top-2 right-2 size-6"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={0}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage aria-live="polite" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="flex cursor-pointer items-center gap-2" htmlFor="login-remember">
                    <Checkbox
                      onCheckedChange={field.onChange}
                      checked={field.value}
                      id="login-remember"
                      className="size-4"
                      aria-label="Remember me"
                    />
                    Remember me
                  </FormLabel>
                  <Link className="text-muted-foreground mt-1 block text-xs hover:underline" to="/forgot-password" aria-label="Forgot your password?">
                    Forgot your password?
                  </Link>
                </FormItem>
              )}
            />
            <div className="space-y-2">
              {/* Honeypot field (hidden) */}
              <FormField
                control={form.control}
                name="honeypot"
                render={({ field }) => (
                  <FormItem style={{ position: 'absolute', left: '-9999px' }}>
                    <FormControl>
                      <Input type="text" autoComplete="off" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className={cn('mt-2 flex w-full items-center justify-center gap-2', { 'pointer-events-none opacity-70': isLoading })}
                variant="default"
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                aria-label="Login"
              >
                {isLoading && <Spinner />}
                Login
              </Button>
              <Button onClick={() => navigate(-1)} className="w-full" variant="outline" type="button" aria-label="Back">
                Back
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </main>
  )
}
