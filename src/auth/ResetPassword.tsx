import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { resetPassword, verifyResetToken } from '@/api/auth.api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Logo } from './Logo'

const FormSchema = z
  .object({
    current: z.string().min(3, { message: 'Please enter your current password.' }),
    confirm: z.string().min(2, { message: 'Please confirm your password.' }),
    password: z.string().min(3, { message: 'Password must be at least 3 characters.' }),
  })
  .refine((data) => data.password === data.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match.',
  })
  .refine((data) => data.password !== data.current, {
    path: ['password'],
    message: 'New password must be different from current password.',
  })

type FormSchemaType = z.infer<typeof FormSchema>

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState<boolean>(true)
  const [tokenValid, setTokenValid] = useState<boolean>(false)

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      current: '',
      confirm: '',
      password: '',
    },
  })

  useEffect(() => {
    // Extract token from query string
    const params = new URLSearchParams(location.search)
    const t = params.get('token')?.trim() ?? ''
    if (!t) {
      setIsVerifying(false)
      setTokenValid(false)
      toast.error('Invalid reset link. Please request a new one.')
      return
    }
    setToken(t)

    const verify = async () => {
      setIsVerifying(true)
      try {
        const res = await verifyResetToken(t)
        if (res.success && res.user?.username) {
          setUsername(res.user.username)
          setTokenValid(true)
        } else {
          setTokenValid(false)
          toast.error(res.message || 'Invalid or expired reset link.')
        }
      } catch {
        setTokenValid(false)
        toast.error('Failed to verify reset link. Please try again.')
      } finally {
        setIsVerifying(false)
      }
    }

    void verify()
  }, [location.search])

  const onSubmit = async (values: FormSchemaType) => {
    const resetPromise = async () => {
      if (!tokenValid || !token) {
        throw new Error('Invalid or expired reset link.')
      }

      const response = await resetPassword({
        username: username.trim(),
        old_password: values.current,
        new_password: values.password,
        token,
      })

      if (response.success) {
        navigate('/login')
        return 'Password reset successful!'
      } else {
        throw new Error(response.message || 'Reset failed')
      }
    }

    toast.promise(resetPromise(), {
      loading: 'Resetting your password...',
      success: (message) => message,
      error: (err) => err.message || 'An unexpected error occurred.',
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-sm p-8">
        <div className="mb-8 flex flex-col items-center">
          <Logo />
          <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground mt-1 text-center text-sm">
            {isVerifying
              ? 'Verifying your reset link…'
              : tokenValid
                ? 'Please enter your new password.'
                : 'This reset link is invalid or has expired.'}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your current password"
                      autoComplete="current-password"
                      id="current-password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="current"
            />

            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new password" autoComplete="new-password" id="new-password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="password"
            />

            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm your new password" autoComplete="new-password" id="confirm-password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="confirm"
            />

            <div className="space-y-2">
              <Button className="mt-2 w-full" type="submit" disabled={!tokenValid || isVerifying}>
                Reset Password
              </Button>
              <Button onClick={() => navigate(-1)} className="w-full" variant="outline" type="button">
                Back
              </Button>
            </div>
            <p className="text-muted-foreground mt-4 text-center text-xs">
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
                Terms of Service
              </a>{' '}
              apply.
            </p>
          </form>
        </Form>
      </Card>
    </div>
  )
}
