import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, endpoints } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { queryKeys } from '@/lib/react-query'

// Generic list hook
export function useList<T>(key: string[], endpoint: string, params?: any) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const response = await api.get(endpoint, { params })
      return response.data
    },
    enabled: !!endpoint,
  })
}

// Generic create hook
export function useCreate<T>(key: string[], endpoint: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: T) => {
      const response = await api.post(endpoint, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      toast({
        title: "Success",
        description: "Item created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create item",
        variant: "destructive",
      })
    },
  })
}

// Generic update hook
export function useUpdate<T>(key: string[], getEndpoint: (id: string) => string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
      const response = await api.put(getEndpoint(id), data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      toast({
        title: "Success",
        description: "Item updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update item",
        variant: "destructive",
      })
    },
  })
}

// Generic delete hook
export function useDelete(key: string[], getEndpoint: (id: string) => string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(getEndpoint(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete item",
        variant: "destructive",
      })
    },
  })
}

// Staff management hooks
export const useStaff = (filters?: any) =>
  useList(queryKeys.staff(filters), endpoints.staff.list, filters)

export const useCreateStaff = () =>
  useCreate(queryKeys.staff(), endpoints.staff.create)

export const useUpdateStaff = () =>
  useUpdate(queryKeys.staff(), endpoints.staff.update)

export const useDeleteStaff = () =>
  useDelete(queryKeys.staff(), endpoints.staff.delete)

// Patient hooks
export const usePatients = (filters?: any) =>
  useList(queryKeys.patients(filters), endpoints.patients.list, filters)

export const useCreatePatient = () =>
  useCreate(queryKeys.patients(), endpoints.patients.create)

export const useUpdatePatient = () =>
  useUpdate(queryKeys.patients(), endpoints.patients.update)

export const useDeletePatient = () =>
  useDelete(queryKeys.patients(), endpoints.patients.delete)

// Appointment hooks
export const useAppointments = (filters?: any) =>
  useList(queryKeys.appointments(filters), endpoints.appointments.list, filters)

export const useTodayAppointments = () =>
  useList(queryKeys.todayAppointments, endpoints.appointments.today)

export const useCreateAppointment = () =>
  useCreate(queryKeys.appointments(), endpoints.appointments.create)

export const useUpdateAppointment = () =>
  useUpdate(queryKeys.appointments(), endpoints.appointments.update)

export const useDeleteAppointment = () =>
  useDelete(queryKeys.appointments(), endpoints.appointments.delete)

// Consultation hooks
export const useConsultations = (patientId?: string) =>
  useList(queryKeys.consultations(patientId), endpoints.consultations.list, { patientId })

export const useCreateConsultation = () =>
  useCreate(queryKeys.consultations(), endpoints.consultations.create)

export const useUpdateConsultation = () =>
  useUpdate(queryKeys.consultations(), endpoints.consultations.update)

// Prescription hooks
export const usePrescriptions = (patientId?: string) =>
  useList(queryKeys.prescriptions(patientId), endpoints.prescriptions.list, { patientId })

export const useCreatePrescription = () =>
  useCreate(queryKeys.prescriptions(), endpoints.prescriptions.create)

export const useUpdatePrescription = () =>
  useUpdate(queryKeys.prescriptions(), endpoints.prescriptions.update)

// Lab order hooks
export const useLabOrders = (filters?: any) =>
  useList(queryKeys.labOrders(filters), endpoints.labOrders.list, filters)

export const useCreateLabOrder = () =>
  useCreate(queryKeys.labOrders(), endpoints.labOrders.create)

export const useUpdateLabOrder = () =>
  useUpdate(queryKeys.labOrders(), endpoints.labOrders.update)

export const useDeleteLabOrder = () =>
  useDelete(queryKeys.labOrders(), endpoints.labOrders.delete)

// Department hooks
export const useDepartments = () =>
  useList(queryKeys.departments, endpoints.departments.list)

export const useCreateDepartment = () =>
  useCreate(queryKeys.departments, endpoints.departments.create)

export const useUpdateDepartment = () =>
  useUpdate(queryKeys.departments, endpoints.departments.update)

export const useDeleteDepartment = () =>
  useDelete(queryKeys.departments, endpoints.departments.delete)

// Tenant settings hooks
export const useTenantSettings = () =>
  useList(queryKeys.tenantSettings, endpoints.tenants.settings)

export const useUpdateTenantSettings = () =>
  useUpdate(queryKeys.tenantSettings, () => endpoints.tenants.update)