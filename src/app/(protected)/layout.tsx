import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { UserAvatar } from '@/components/auth/UserAvatar'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 justify-between">
          <h1 className="text-xl font-bold">AI Assistant</h1>
          <UserAvatar />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
