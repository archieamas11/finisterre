import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="bg-background flex min-h-screen items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <AlertTriangle className="text-destructive h-12 w-12" />
        </div>
        <CardTitle className="text-destructive">Oops! Something went wrong</CardTitle>
        <CardDescription>
          We're sorry, but an unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        {!import.meta.env.PROD && (
          <details className="text-left">
            <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm">Error Details</summary>
            <pre className="bg-muted mt-2 max-h-32 overflow-auto rounded p-2 text-xs">{error.message}</pre>
          </details>
        )}
        <Button onClick={resetErrorBoundary} className="w-full">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  </div>
)

export default ErrorFallback
