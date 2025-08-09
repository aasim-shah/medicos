import axios from 'axios'
import { getSession } from 'next-auth/react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.user.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`
  }
  if (session?.user.tenantId) {
    config.headers['X-Tenant-ID'] = session.user.tenantId
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password'
  },
  users: {
    list: '/users',
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    profile: '/users/profile'
  },
  staff: {
    list: '/staff',
    create: '/staff',
    update: (id: string) => `/staff/${id}`,
    delete: (id: string) => `/staff/${id}`,
    search: '/staff/search',
    byDepartment: (deptId: string) => `/staff/department/${deptId}`
  },
  patients: {
    list: '/patients',
    create: '/patients',
    update: (id: string) => `/patients/${id}`,
    delete: (id: string) => `/patients/${id}`,
    search: '/patients/search',
    history: (id: string) => `/patients/${id}/history`
  },
  appointments: {
    list: '/appointments',
    create: '/appointments',
    update: (id: string) => `/appointments/${id}`,
    delete: (id: string) => `/appointments/${id}`,
    today: '/appointments/today',
    schedule: '/appointments/schedule'
  },
  consultations: {
    list: '/consultations',
    create: '/consultations',
    update: (id: string) => `/consultations/${id}`,
    patient: (patientId: string) => `/consultations/patient/${patientId}`,
    doctor: (doctorId: string) => `/consultations/doctor/${doctorId}`
  },
  prescriptions: {
    list: '/prescriptions',
    create: '/prescriptions',
    update: (id: string) => `/prescriptions/${id}`,
    patient: (patientId: string) => `/prescriptions/patient/${patientId}`,
    doctor: (doctorId: string) => `/prescriptions/doctor/${doctorId}`,
    fill: (id: string) => `/prescriptions/${id}/fill`,
    refill: (id: string) => `/prescriptions/${id}/refill`
  },
  labOrders: {
    list: '/lab-orders',
    create: '/lab-orders',
    update: (id: string) => `/lab-orders/${id}`,
    delete: (id: string) => `/lab-orders/${id}`,
    results: (id: string) => `/lab-orders/${id}/results`,
    patient: (patientId: string) => `/lab-orders/patient/${patientId}`,
    doctor: (doctorId: string) => `/lab-orders/doctor/${doctorId}`
  },
  departments: {
    list: '/departments',
    create: '/departments',
    update: (id: string) => `/departments/${id}`,
    delete: (id: string) => `/departments/${id}`,
    staff: (id: string) => `/departments/${id}/staff`
  },
  inventory: {
    list: '/inventory',
    create: '/inventory',
    update: (id: string) => `/inventory/${id}`,
    delete: (id: string) => `/inventory/${id}`,
    lowStock: '/inventory/low-stock',
    reorder: (id: string) => `/inventory/${id}/reorder`
  },
  tenants: {
    settings: '/tenants/settings',
    update: '/tenants/settings'
  }
}