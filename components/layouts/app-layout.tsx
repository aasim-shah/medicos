'use client'

import { useSession } from 'next-auth/react'
import { useAuthStore, useUIStore } from '@/lib/store'
import { useEffect } from 'react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
  role?: string
}

export function AppLayout({ children, role }: AppLayoutProps) {
  const { data: session } = useSession()
  const { setUser, setTenant } = useAuthStore()
  const { sidebarOpen } = useUIStore()

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name!,
        role: session.user.role as any,
        tenantId: session.user.tenantId,
        permissions: session.user.permissions
      })
      setTenant(session.user.tenant)
    }
  }, [session, setUser, setTenant])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn(
        'transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-16'
      )}>
        <Topbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}