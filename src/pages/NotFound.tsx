import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <main
      role="main"
      aria-labelledby="not-found-heading"
      className={cn('flex min-h-screen flex-col items-center justify-center px-4 py-10', 'bg-background')}
    >
      <Card className={cn('w-full max-w-md shadow-sm')}>
        <CardHeader className="flex flex-col items-center gap-4 text-center">
          <div className="bg-destructive/10 text-destructive mx-auto flex h-14 w-14 items-center justify-center rounded-full">
            <AlertTriangle aria-hidden="true" className="h-7 w-7" />
          </div>
          <CardTitle id="not-found-heading" className="text-balance">
            404 – Page Not Found
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-muted-foreground list-inside list-disc text-left text-xs">
            <li>Check the URL for typos.</li>
            <li>Use the navigation menu to find what you need.</li>
            <li>Return to the homepage below.</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="default" className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Go Home
            </Link>
          </Button>
          {/* TODO: Add support link */}
          {/* <Button asChild variant="outline" className="gap-2" title="Contact support" aria-label="Contact support">
            <Link to="/support">Support</Link>
          </Button> */}
        </CardFooter>
      </Card>
      <p className="text-muted-foreground mt-6 text-xs">Error code: 404</p>
    </main>
  )
}
