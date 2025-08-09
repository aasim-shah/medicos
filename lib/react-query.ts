import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
})

// Query keys for cache management
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  staff: (filters?: any) => ['staff', filters] as const,
  staffMember: (id: string) => ['staff', id] as const,
  patients: (filters?: any) => ['patients', filters] as const,
  patient: (id: string) => ['patients', id] as const,
  appointments: (filters?: any) => ['appointments', filters] as const,
  appointment: (id: string) => ['appointments', id] as const,
  todayAppointments: ['appointments', 'today'] as const,
  consultations: (patientId?: string) => ['consultations', patientId] as const,
  consultation: (id: string) => ['consultations', id] as const,
  prescriptions: (patientId?: string) => ['prescriptions', patientId] as const,
  prescription: (id: string) => ['prescriptions', id] as const,
  labOrders: (filters?: any) => ['lab-orders', filters] as const,
  labOrder: (id: string) => ['lab-orders', id] as const,
  departments: ['departments'] as const,
  department: (id: string) => ['departments', id] as const,
  inventory: (filters?: any) => ['inventory', filters] as const,
  inventoryItem: (id: string) => ['inventory', id] as const,
  lowStockInventory: ['inventory', 'low-stock'] as const,
  tenantSettings: ['tenant', 'settings'] as const,
}