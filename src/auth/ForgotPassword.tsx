import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { forgotPassword } from '@/api/auth.api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Logo } from './Logo'

const FormSchema = z.object({
  username: z.string().min(3, {
    message: 'Property ID must be at least 3 characters.',
  }),
})

export default function ForgotPassword() {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const verifyPromise = async () => {
      const res = await forgotPassword(data.username)

      if (res.success) {
        return 'Email sent! Please check your inbox for a reset link.'
      } else {
        throw new Error(res.message || 'Failed to process request')
      }
    }

    toast.promise(verifyPromise(), {
      loading: 'Sending reset email...',
      success: (message) => message,
      error: (err) => ({
        message: err.message,
        description: 'Please check your Property ID and try again.',
      }),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-sm p-8">
        <div className="mb-8 flex flex-col items-center">
          <Logo />
          <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
          <p className="text-muted-foreground mt-1 text-center text-sm">Enter your Property ID. If it exists, well email a reset link.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your property ID" autoComplete="username" id="username" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="username"
            />
            <div className="space-y-2">
              <Button className="mt-2 w-full" type="submit">
                Verify
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
