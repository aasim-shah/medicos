import { z } from 'zod'

// Staff validation schemas
export const staffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['doctor', 'nurse', 'reception', 'lab', 'pharmacy', 'admin']),
  department: z.string().min(1, 'Department is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  status: z.enum(['active', 'inactive']).default('active'),
  hireDate: z.string().optional(),
})

export const staffUpdateSchema = staffSchema.partial()

// Patient validation schemas
export const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().min(1, 'Address is required'),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    phone: z.string().min(10, 'Emergency contact phone is required'),
    relationship: z.string().min(1, 'Relationship is required'),
  }),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  insurance: z.string().optional(),
})

export const patientUpdateSchema = patientSchema.partial()

// Appointment validation schemas
export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  type: z.enum(['consultation', 'follow-up', 'emergency', 'routine']),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled']).default('scheduled'),
})

export const appointmentUpdateSchema = appointmentSchema.partial()

// Consultation validation schemas
export const consultationSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  type: z.enum(['follow-up', 'new', 'emergency', 'routine']),
  symptoms: z.string().min(1, 'Symptoms are required'),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
})

export const consultationUpdateSchema = consultationSchema.partial()

// Prescription validation schemas
export const prescriptionSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  medication: z.string().min(1, 'Medication is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  refills: z.number().min(0, 'Refills cannot be negative'),
  instructions: z.string().min(1, 'Instructions are required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  status: z.enum(['active', 'completed', 'discontinued']).default('active'),
})

export const prescriptionUpdateSchema = prescriptionSchema.partial()

// Lab order validation schemas
export const labOrderSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  testType: z.string().min(1, 'Test type is required'),
  priority: z.enum(['routine', 'urgent', 'emergency']).default('routine'),
  notes: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']).default('pending'),
})

export const labOrderUpdateSchema = labOrderSchema.partial()

// Department validation schemas
export const departmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters'),
  description: z.string().optional(),
  headOfDepartment: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  contactEmail: z.string().email('Invalid email address').optional(),
  contactPhone: z.string().optional(),
})

export const departmentUpdateSchema = departmentSchema.partial()

// Inventory validation schemas
export const inventorySchema = z.object({
  medication: z.string().min(1, 'Medication name is required'),
  genericName: z.string().optional(),
  currentStock: z.number().min(0, 'Current stock cannot be negative'),
  reorderLevel: z.number().min(0, 'Reorder level cannot be negative'),
  supplier: z.string().min(1, 'Supplier is required'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  unit: z.string().min(1, 'Unit is required'),
  expiryDate: z.string().optional(),
  status: z.enum(['in-stock', 'low-stock', 'out-of-stock']).default('in-stock'),
})

export const inventoryUpdateSchema = inventorySchema.partial()

// Follow-up appointment validation schemas
export const followUpSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  type: z.enum(['routine', 'medication', 'test', 'emergency']),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional(),
})

// Prescription fill validation schemas
export const prescriptionFillSchema = z.object({
  prescriptionId: z.string().min(1, 'Prescription is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  instructions: z.string().min(1, 'Instructions are required'),
  notes: z.string().optional(),
  filledBy: z.string().min(1, 'Pharmacist is required'),
})

// Lab result validation schemas
export const labResultSchema = z.object({
  labOrderId: z.string().min(1, 'Lab order is required'),
  results: z.string().min(1, 'Results are required'),
  interpretation: z.string().optional(),
  recommendations: z.string().optional(),
  status: z.enum(['normal', 'abnormal', 'critical']).default('normal'),
  reportedBy: z.string().min(1, 'Technician is required'),
})
