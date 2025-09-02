import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Eye, EyeOff } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { loginUser } from '@/api/auth.api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormMessage, FormField, FormLabel, FormItem, Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Spinner from '@/components/ui/spinner'
import { useAuthQuery } from '@/hooks/useAuthQuery'
import { cn } from '@/lib/utils'
import { isNativePlatform, isAndroid, isIOS } from '@/utils/platform.utils'

const FormSchema = z.object({
  remember: z.boolean().optional(),
  password: z.string().min(4, { message: 'Password must be at least 4 characters.' }),
  username: z.string().min(2, { message: 'Property ID must be at least 2 characters.' }),
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
    },
  })

  // Redirect if already authenticated
  React.useEffect(() => {
    const hasToken = !!localStorage.getItem('token')
    if (hasToken && isSuccess && data?.success) {
      const admin = !!data?.user?.isAdmin

      if (isNativePlatform()) {
        navigate(isIOS() ? '/landing-ios' : '/landing-android', { replace: true })
      } else {
        navigate(admin ? '/admin' : '/user', { replace: true })
      }
    }
  }, [data, isSuccess, navigate])

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setIsLoading(true)
    try {
      const res = await loginUser(formData.username, formData.password)

      if (res.success) {
        // Save token and role
        localStorage.setItem('token', res.token!)
        localStorage.setItem('isAdmin', res.isAdmin ? '1' : '0')

        // Prime query cache from token to avoid race when redirecting
        setAuthFromToken()

        // Show success toast then navigate
        toast.success(`Welcome back, ${formData.username}!`)

        // Redirect based on platform and user role
        if (isNativePlatform()) {
          if (isAndroid()) {
            navigate('/landing-android')
          } else if (isIOS()) {
            navigate('/landing-ios')
          } else {
            // Fallback for other native platforms
            navigate('/landing-android')
          }
        } else if (res.isAdmin) {
          navigate('/admin')
        } else {
          navigate('/user')
        }
      } else {
        // Set backend error to form state
        form.setValue('password', '')
        if (res.message === 'User not found') {
          form.setError('username', {
            type: 'manual',
            message: 'Incorrect Property ID or Password',
          })
          toast.error('Please check your credentials and try again')
        } else if (res.message === 'Invalid password') {
          form.setError('password', {
            type: 'manual',
            message: 'Incorrect Property ID or Password',
          })
          toast.error('Please check your credentials and try again')
        } else {
          toast.error('Something went wrong. Please try again later.')
        }
      }
    } catch {
      // Network or unexpected errors
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="bg-background flex min-h-screen items-center justify-center" aria-label="Login page">
      <Card className="mx-auto w-full max-w-sm p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center">
          <Link
            className="mb-4"
            to="/"
            aria-label="Back to home"
            onClick={(e) => {
              // ensure touch taps trigger navigation reliably on mobile
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
              <MapPin size={30} />
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
                    <Input placeholder="your property ID" autoComplete="username" id="username" type="text" {...field} aria-required="true" aria-label="Property ID" />
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
                    <Checkbox onCheckedChange={field.onChange} checked={field.value} id="login-remember" className="size-4" aria-label="Remember me" />
                    Remember me
                  </FormLabel>
                  <Link className="text-muted-foreground mt-1 block text-xs hover:underline" to="/forgot-password" aria-label="Forgot your password?">
                    Forgot your password?
                  </Link>
                </FormItem>
              )}
            />
            <div className="space-y-2">
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
