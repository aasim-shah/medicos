import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'admin' | 'doctor' | 'reception' | 'lab' | 'pharmacy' | 'patient'
  tenantId: string
  permissions: string[]
  avatar?: string
}

interface Tenant {
  id: string
  name: string
  logo?: string
  primaryColor: string
  secondaryColor: string
  address: string
  phone: string
}

interface AuthState {
  user: User | null
  tenant: Tenant | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setTenant: (tenant: Tenant | null) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tenant: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTenant: (tenant) => set({ tenant }),
      logout: () => set({ user: null, tenant: null, isAuthenticated: false }),
      hasPermission: (permission) => {
        const { user } = get()
        return user?.permissions.includes(permission) ?? false
      }
    }),
    {
      name: 'medicflow-auth'
    }
  )
)

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    timestamp: Date
  }>
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
}

export const useUIStore = create<UIState>()((set, get) => ({
  sidebarOpen: true,
  theme: 'system',
  notifications: [],
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7)
    const newNotification = { ...notification, id, timestamp: new Date() }
    set({ notifications: [...get().notifications, newNotification] })
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id)
    }, 5000)
  },
  removeNotification: (id) => {
    set({ notifications: get().notifications.filter(n => n.id !== id) })
  }
}))