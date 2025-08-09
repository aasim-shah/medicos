'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUIStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Users,
  UserCheck,
  Stethoscope,
  TestTube,
  Pill,
  Settings,
  LogOut,
  ChevronLeft,
  Home,
  FileText,
  Building
} from 'lucide-react'

const roleMenus = {
  admin: [
    { label: 'Dashboard', href: '/admin', icon: Home },
    { label: 'Staff', href: '/admin/staff', icon: Users },
    { label: 'Departments', href: '/admin/departments', icon: Building },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  reception: [
    { label: 'Dashboard', href: '/reception', icon: Home },
    { label: 'Appointments', href: '/reception/appointments', icon: Calendar },
    { label: 'Patients', href: '/reception/patients', icon: UserCheck },
  ],
  doctor: [
    { label: 'Dashboard', href: '/doctor', icon: Home },
    { label: 'Schedule', href: '/doctor/schedule', icon: Calendar },
    { label: 'Patients', href: '/doctor/patients', icon: Users },
    { label: 'Consultations', href: '/doctor/consultations', icon: Stethoscope },
  ],
  lab: [
    { label: 'Dashboard', href: '/lab', icon: Home },
    { label: 'Orders', href: '/lab/orders', icon: TestTube },
    { label: 'Results', href: '/lab/results', icon: FileText },
  ],
  pharmacy: [
    { label: 'Dashboard', href: '/pharmacy', icon: Home },
    { label: 'Prescriptions', href: '/pharmacy/prescriptions', icon: Pill },
    { label: 'Inventory', href: '/pharmacy/inventory', icon: FileText },
  ],
  patient: [
    { label: 'Dashboard', href: '/patient', icon: Home },
    { label: 'Appointments', href: '/patient/appointments', icon: Calendar },
    { label: 'History', href: '/patient/history', icon: FileText },
    { label: 'Documents', href: '/patient/documents', icon: FileText },
  ]
}

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  if (!session?.user) return null

  const userRole = session.user.role as keyof typeof roleMenus
  const menuItems = roleMenus[userRole] || []

  return (
    <div className={cn(
      'fixed inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300',
      sidebarOpen ? 'w-64' : 'w-16'
    )}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">MedicoFlow</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft className={cn(
              'h-4 w-4 transition-transform',
              !sidebarOpen && 'rotate-180'
            )} />
          </Button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={session.user.image || ''} />
              <AvatarFallback>
                {session.user.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {session.user.role}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  !sidebarOpen && 'px-2'
                )}
              >
                <item.icon className={cn('h-4 w-4', sidebarOpen && 'mr-2')} />
                {sidebarOpen && item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10',
              !sidebarOpen && 'px-2'
            )}
            onClick={() => signOut()}
          >
            <LogOut className={cn('h-4 w-4', sidebarOpen && 'mr-2')} />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  )
}