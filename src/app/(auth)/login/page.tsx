import { LoginButton } from '@/components/auth/LoginButton'
import { Sparkles } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground mx-auto">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to start chatting with your AI assistant
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
        <LoginButton />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our terms of service.
      </p>
    </div>
  )
}
