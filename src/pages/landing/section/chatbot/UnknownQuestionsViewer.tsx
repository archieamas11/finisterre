import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UnknownQuestion {
  id: string
  question: string
  count: number
  first_asked: string
  last_asked: string
  confidence: number
  status: string
}

export default function UnknownQuestionsViewer() {
  const API = import.meta.env.VITE_CHATBOT_API_URL

  const { data, isLoading, error } = useQuery({
    queryKey: ['unknown-questions'],
    queryFn: async () => {
      const res = await fetch(`${API}?action=unknown_questions`)
      if (!res.ok) throw new Error('Failed to fetch unknown questions')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-4xl">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading unknown questions...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-4xl">
          <CardContent className="py-8">
            <p className="text-red-500">Error loading unknown questions: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const questions: UnknownQuestion[] = data?.questions || []

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Unknown Questions ({questions.length})</CardTitle>
          <p className="text-sm text-muted-foreground">Questions asked by users that weren't found in the FAQ database</p>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <p className="text-muted-foreground">No unknown questions yet.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{q.question}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          Asked {q.count} time{q.count !== 1 ? 's' : ''}
                        </span>
                        <span>Last asked: {new Date(q.last_asked).toLocaleDateString()}</span>
                        <span>Confidence: {(q.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <Badge variant={q.status === 'pending' ? 'secondary' : 'default'}>{q.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
