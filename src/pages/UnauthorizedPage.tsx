import { ArrowLeft, Home, Mail, ShieldX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="border-border w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <ShieldX className="text-destructive h-8 w-8" />
          </div>
          <CardTitle className="text-destructive text-2xl font-bold">Unauthorized Access</CardTitle>
          <CardDescription className="text-muted-foreground">You don't have permission to view this page.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            It looks like you're trying to access a page that requires special permissions. Please log in with an authorized account or contact your
            administrator.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>

              <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>

            <Button variant="ghost" onClick={() => navigate('/contact')} className="text-muted-foreground hover:text-foreground w-full">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
