'use client'

import { AppLayout } from '@/components/layouts/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarIcon2, FileText, Pill, TestTube, Clock, Plus, Eye, Download, CalendarIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

// Mock data for patient dashboard
const mockPatientData = {
  name: 'John Smith',
  age: 45,
  bloodType: 'O+',
  lastCheckup: '2024-01-10',
  nextAppointment: '2024-01-20',
  email: 'john.smith@email.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, City, State 12345',
  emergencyContact: 'Mary Smith (Wife) +1 (555) 123-4568',
  insurance: 'Blue Cross Blue Shield',
  primaryCare: 'Dr. Sarah Johnson'
}

const mockAppointments = [
  {
    id: '1',
    date: '2024-01-20',
    time: '10:00 AM',
    doctor: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    status: 'upcoming',
    type: 'Follow-up'
  },
  {
    id: '2',
    date: '2024-01-25',
    time: '2:30 PM',
    doctor: 'Dr. Emily Rodriguez',
    department: 'Laboratory',
    status: 'upcoming',
    type: 'Routine Check'
  }
]

const mockPrescriptions = [
  {
    id: '1',
    medication: 'Lisinopril',
    dosage: '10mg daily',
    prescribedBy: 'Dr. Sarah Johnson',
    prescribedDate: '2024-01-10',
    refills: 2,
    instructions: 'Take 1 tablet daily in the morning',
    sideEffects: 'Dizziness, dry cough'
  },
  {
    id: '2',
    medication: 'Metformin',
    dosage: '500mg twice daily',
    prescribedBy: 'Dr. Sarah Johnson',
    prescribedDate: '2024-01-10',
    refills: 1,
    instructions: 'Take with meals to reduce stomach upset',
    sideEffects: 'Nausea, diarrhea'
  }
]

const mockLabResults = [
  {
    id: '1',
    testName: 'Complete Blood Count',
    date: '2024-01-10',
    status: 'completed',
    results: 'Normal',
    doctor: 'Dr. Sarah Johnson',
    notes: 'All values within normal range'
  },
  {
    id: '2',
    testName: 'Lipid Panel',
    date: '2024-01-10',
    status: 'completed',
    results: 'Normal',
    doctor: 'Dr. Sarah Johnson',
    notes: 'Cholesterol levels improved with medication'
  }
]

const mockDoctors = [
  { id: '1', name: 'Dr. Sarah Johnson', department: 'Cardiology', availability: 'Mon-Fri 9AM-5PM' },
  { id: '2', name: 'Dr. Emily Rodriguez', department: 'Laboratory', availability: 'Mon-Fri 8AM-4PM' },
  { id: '3', name: 'Dr. Michael Brown', department: 'Dermatology', availability: 'Mon-Fri 10AM-6PM' }
]

export default function PatientDashboard() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isRefillOpen, setIsRefillOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [isViewLabResultOpen, setIsViewLabResultOpen] = useState(false)
  const [selectedLabResult, setSelectedLabResult] = useState<any>(null)

  // Form handling
  const appointmentForm = useForm({
    defaultValues: {
      doctorId: '',
      appointmentDate: new Date(),
      appointmentTime: '',
      type: 'consultation',
      reason: '',
      preferredDate: ''
    }
  })

  const refillForm = useForm({
    defaultValues: {
      refillQuantity: 1,
      pharmacy: '',
      notes: '',
      urgency: 'routine'
    }
  })

  const handleBookAppointment = async (data: any) => {
    try {
      // In a real app, this would call an API
      console.log('Booking appointment:', data)
      toast({
        title: "Success",
        description: "Appointment booked successfully! You will receive a confirmation email.",
      })
      setIsBookingOpen(false)
      appointmentForm.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleRequestRefill = async (data: any) => {
    try {
      // In a real app, this would call an API
      console.log('Requesting refill:', data)
      toast({
        title: "Success",
        description: "Refill request submitted successfully! The pharmacy will contact you.",
      })
      setIsRefillOpen(false)
      refillForm.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit refill request. Please try again.",
        variant: "destructive"
      })
    }
  }

  const openRefillDialog = (prescription: any) => {
    setSelectedPrescription(prescription)
    setIsRefillOpen(true)
  }

  const openLabResultDialog = (result: any) => {
    setSelectedLabResult(result)
    setIsViewLabResultOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants: any = {
      upcoming: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
      'no-show': 'outline'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getAppointmentTypeBadge = (type: string) => {
    const variants: any = {
      consultation: 'default',
      'follow-up': 'secondary',
      routine: 'outline',
      emergency: 'destructive'
    }
    return <Badge variant={variants[type] || 'secondary'}>{type}</Badge>
  }

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Patient Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Welcome back, {mockPatientData.name}
            </p>
          </div>
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
                <DialogDescription>
                  Schedule an appointment with a doctor.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={appointmentForm.handleSubmit(handleBookAppointment)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctorId" className="text-sm">Doctor</Label>
                    <Select onValueChange={(value) => appointmentForm.setValue('doctorId', value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDoctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentType" className="text-sm">Type</Label>
                    <Select onValueChange={(value) => appointmentForm.setValue('type', value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Appointment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="routine">Routine Check</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDate" className="text-sm">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !appointmentForm.watch('appointmentDate') && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {appointmentForm.watch('appointmentDate') ? (
                            format(appointmentForm.watch('appointmentDate'), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={appointmentForm.watch('appointmentDate')}
                          onSelect={(date) => appointmentForm.setValue('appointmentDate', date || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentTime" className="text-sm">Time</Label>
                    <Select onValueChange={(value) => appointmentForm.setValue('appointmentTime', value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="09:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="10:30">10:30 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="14:30">2:30 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="15:30">3:30 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm">Reason for Visit</Label>
                  <Textarea
                    {...appointmentForm.register('reason')}
                    placeholder="Please describe your symptoms or reason for the appointment"
                    rows={3}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsBookingOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Book Appointment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Next Appointment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{mockPatientData.nextAppointment}</div>
              <p className="text-xs text-muted-foreground">
                Dr. Sarah Johnson
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Active Prescriptions</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPrescriptions.length}</div>
              <p className="text-xs text-muted-foreground">
                {mockPrescriptions.filter(p => p.refills > 0).length} need refills
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Recent Lab Results</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockLabResults.length}</div>
              <p className="text-xs text-muted-foreground">
                All results normal
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Last Checkup</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPatientData.lastCheckup}</div>
              <p className="text-xs text-muted-foreground">
                {mockPatientData.primaryCare}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Patient Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{mockPatientData.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Age</p>
                <p className="text-sm text-muted-foreground">{mockPatientData.age} years</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Blood Type</p>
                <p className="text-sm text-muted-foreground">{mockPatientData.bloodType}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{mockPatientData.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{mockPatientData.phone}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Insurance</p>
                <p className="text-sm text-muted-foreground">{mockPatientData.insurance}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Primary Care</p>
                <p className="text-sm text-muted-foreground">{mockPatientData.primaryCare}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Emergency Contact</p>
                <p className="text-sm text-muted-foreground">{mockPatientData.emergencyContact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Your scheduled medical appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.department} • {appointment.date} at {appointment.time}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getAppointmentTypeBadge(appointment.type)}
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Current Prescriptions</CardTitle>
            <CardDescription>
              Your active medications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPrescriptions.map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{prescription.medication}</p>
                    <p className="text-sm text-muted-foreground">
                      {prescription.dosage} • Prescribed by {prescription.prescribedBy}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Prescribed: {prescription.prescribedDate} • Refills: {prescription.refills}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Instructions: {prescription.instructions}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{prescription.refills} refills left</Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openRefillDialog(prescription)}
                    >
                      Request Refill
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lab Results */}
        <Card>
          <CardHeader>
            <CardTitle>Laboratory Results</CardTitle>
            <CardDescription>
              Your recent lab test results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLabResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{result.testName}</p>
                    <p className="text-sm text-muted-foreground">
                      Date: {result.date} • Doctor: {result.doctor}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Results: {result.results}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openLabResultDialog(result)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prescription Refill Dialog */}
      <Dialog open={isRefillOpen} onOpenChange={setIsRefillOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Prescription Refill</DialogTitle>
            <DialogDescription>
              Request a refill for {selectedPrescription?.medication}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={refillForm.handleSubmit(handleRequestRefill)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medication">Medication</Label>
                <Input
                  id="medication"
                  value={selectedPrescription?.medication || ''}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={selectedPrescription?.dosage || ''}
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="refillQuantity">Refill Quantity</Label>
                <Input
                  {...refillForm.register('refillQuantity', { min: 1, max: 10 })}
                  type="number"
                  placeholder="Number of refills needed"
                  min="1"
                  max="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select onValueChange={(value) => refillForm.setValue('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pharmacy">Preferred Pharmacy</Label>
              <Input
                {...refillForm.register('pharmacy')}
                placeholder="Pharmacy name and location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                {...refillForm.register('notes')}
                placeholder="Any special instructions or notes"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsRefillOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Request Refill
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lab Result Details Dialog */}
      <Dialog open={isViewLabResultOpen} onOpenChange={setIsViewLabResultOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Lab Result Details</DialogTitle>
            <DialogDescription>
              Detailed view of laboratory test results
            </DialogDescription>
          </DialogHeader>
          {selectedLabResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Test Name</Label>
                  <p className="text-sm">{selectedLabResult.testName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm">{selectedLabResult.date}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm">{selectedLabResult.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Doctor</Label>
                  <p className="text-sm">{selectedLabResult.doctor}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Results</Label>
                <p className="text-sm">{selectedLabResult.results}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <p className="text-sm">{selectedLabResult.notes}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View Full Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
