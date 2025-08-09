'use client'

import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      // Auto-login with demo admin credentials
      signIn('credentials', {
        email: 'admin@medicoflow.com',
        password: 'admin123',
        redirect: false
      }).then((result) => {
        if (result?.ok) {
          // Redirect to admin dashboard
          router.push('/admin')
        }
      })
      return
    }

    // Redirect to role-based dashboard
    const userRole = session.user?.role
    if (userRole) {
      router.push(`/${userRole}`)
    } else {
      router.push('/admin') // Default to admin dashboard
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Auto-logging you in...</p>
        <p className="text-sm text-muted-foreground mt-2">Demo Admin User</p>
      </div>
    </div>
  )
}