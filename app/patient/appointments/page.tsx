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
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar as CalendarIcon, Clock, User, MapPin, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'

// Form validation schema
const appointmentSchema = z.object({
  department: z.string().min(1, 'Department is required'),
  doctor: z.string().min(1, 'Doctor is required'),
  date: z.date(),
  time: z.string().min(1, 'Time is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  type: z.enum(['consultation', 'follow-up', 'emergency', 'routine']),
  notes: z.string().optional()
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

// Mock data for appointments
const mockAppointments = [
  {
    id: '1',
    date: new Date(),
    time: '10:00 AM',
    doctor: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    status: 'upcoming',
    type: 'Follow-up',
    reason: 'Blood pressure check and medication review',
    location: 'Room 101',
    notes: 'Bring current medication list'
  },
  {
    id: '2',
    date: addDays(new Date(), 1),
    time: '2:30 PM',
    doctor: 'Dr. Emily Rodriguez',
    department: 'Laboratory',
    status: 'upcoming',
    type: 'Routine Check',
    reason: 'Annual blood work and health screening',
    location: 'Lab 2',
    notes: 'Fasting required for 12 hours'
  },
  {
    id: '3',
    date: addDays(new Date(), -2),
    time: '9:00 AM',
    doctor: 'Dr. Michael Brown',
    department: 'General Medicine',
    status: 'completed',
    type: 'Consultation',
    reason: 'Annual physical examination',
    location: 'Room 105',
    notes: 'All vitals normal, recommended follow-up in 6 months'
  },
  {
    id: '4',
    date: addDays(new Date(), -5),
    time: '11:00 AM',
    doctor: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    status: 'cancelled',
    type: 'Follow-up',
    reason: 'Cardiac stress test review',
    location: 'Room 101',
    notes: 'Rescheduled due to emergency'
  }
]

const mockDepartments = [
  { id: 'cardiology', name: 'Cardiology', doctors: ['Dr. Sarah Johnson', 'Dr. Robert Wilson'] },
  { id: 'general', name: 'General Medicine', doctors: ['Dr. Michael Brown', 'Dr. Lisa Chen'] },
  { id: 'laboratory', name: 'Laboratory', doctors: ['Dr. Emily Rodriguez', 'Dr. David Kim'] },
  { id: 'radiology', name: 'Radiology', doctors: ['Dr. James Miller', 'Dr. Amanda Taylor'] },
  { id: 'dermatology', name: 'Dermatology', doctors: ['Dr. Patricia Garcia', 'Dr. Thomas Lee'] }
]

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [availableDoctors, setAvailableDoctors] = useState<string[]>([])

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      department: '',
      doctor: '',
      date: new Date(),
      time: '',
      reason: '',
      type: 'consultation',
      notes: ''
    }
  })

  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date())
  })

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, date))
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      upcoming: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
      rescheduled: 'outline'
    } as const

    const icons = {
      upcoming: <Clock className="h-3 w-3" />,
      completed: <CheckCircle className="h-3 w-3" />,
      cancelled: <XCircle className="h-3 w-3" />,
      rescheduled: <AlertCircle className="h-3 w-3" />
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="flex items-center gap-1">
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      consultation: 'default',
      'follow-up': 'secondary',
      emergency: 'destructive',
      routine: 'outline'
    } as const

    return <Badge variant={variants[type as keyof typeof variants]}>{type}</Badge>
  }

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId)
    const department = mockDepartments.find(d => d.id === departmentId)
    setAvailableDoctors(department?.doctors || [])
    form.setValue('doctor', '')
  }

  const handleBookAppointment = async (data: AppointmentFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newAppointment = {
        id: Date.now().toString(),
        ...data,
        status: 'upcoming',
        location: 'TBD',
        notes: data.notes || ''
      }
      
      setAppointments([...appointments, newAppointment])
      setIsBookDialogOpen(false)
      form.reset()
      toast({
        title: 'Appointment Booked',
        description: 'Your appointment has been successfully scheduled.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to book appointment. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleCancelAppointment = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      ))
      
      toast({
        title: 'Appointment Cancelled',
        description: 'Your appointment has been cancelled successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel appointment. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleRescheduleAppointment = async (id: string, newDate: Date, newTime: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, date: newDate, time: newTime, status: 'rescheduled' } : apt
      ))
      
      toast({
        title: 'Appointment Rescheduled',
        description: 'Your appointment has been rescheduled successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reschedule appointment. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const openViewDialog = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsViewDialogOpen(true)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
            <p className="text-muted-foreground">
              Manage and schedule your medical appointments
            </p>
          </div>
          <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
                <DialogDescription>
                  Schedule a new appointment with one of our healthcare providers.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleBookAppointment)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={selectedDepartment}
                      onValueChange={handleDepartmentChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDepartments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor</Label>
                    <Select
                      value={form.watch('doctor')}
                      onValueChange={(value) => form.setValue('doctor', value)}
                      disabled={!selectedDepartment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDoctors.map((doctor) => (
                          <SelectItem key={doctor} value={doctor}>
                            {doctor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Calendar
                      mode="single"
                      selected={form.watch('date')}
                      onSelect={(date) => form.setValue('date', date || new Date())}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Select
                      value={form.watch('time')}
                      onValueChange={(value) => form.setValue('time', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="09:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="10:30">10:30 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="11:30">11:30 AM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="14:30">2:30 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="15:30">3:30 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="16:30">4:30 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select
                    value={form.watch('type')}
                    onValueChange={(value: any) => form.setValue('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="routine">Routine Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe your symptoms or reason for the appointment"
                    {...form.register('reason')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information or special requests"
                    {...form.register('notes')}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsBookDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Book Appointment</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid gap-4">
              {appointments
                .filter(apt => apt.status === 'upcoming')
                .map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{format(appointment.date, 'dd')}</div>
                              <div className="text-sm text-muted-foreground">{format(appointment.date, 'MMM')}</div>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{appointment.time}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{appointment.doctor}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{appointment.location}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-3">
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(appointment.status)}
                            {getTypeBadge(appointment.type)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openViewDialog(appointment)}
                            >
                              <Eye className="mr-2 h-3 w-3" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Calendar</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Appointments for {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Today'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {getAppointmentsForDate(selectedDate || new Date()).length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No appointments scheduled
                      </p>
                    ) : (
                      getAppointmentsForDate(selectedDate || new Date()).map((appointment) => (
                        <div key={appointment.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{appointment.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(appointment.status)}
                              {getTypeBadge(appointment.type)}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{appointment.doctor}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{appointment.location}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appointment History</CardTitle>
                <CardDescription>
                  Your past appointments and their outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments
                    .filter(apt => apt.status === 'completed' || apt.status === 'cancelled')
                    .map((appointment) => (
                      <div key={appointment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-bold">{format(appointment.date, 'dd')}</div>
                              <div className="text-sm text-muted-foreground">{format(appointment.date, 'MMM')}</div>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{appointment.time}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{appointment.doctor}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(appointment.status)}
                            {getTypeBadge(appointment.type)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openViewDialog(appointment)}
                            >
                              <Eye className="mr-2 h-3 w-3" />
                              View Details
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{appointment.location}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              <strong>Notes:</strong> {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Appointment Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                Complete information about your appointment
              </DialogDescription>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedAppointment.date, 'EEEE, MMMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Time</Label>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.time}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Doctor</Label>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.doctor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Department</Label>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <div className="mt-1">{getTypeBadge(selectedAppointment.type)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.location}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reason for Visit</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedAppointment.reason}</p>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedAppointment.notes}</p>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  {selectedAppointment.status === 'upcoming' && (
                    <Button
                      variant="outline"
                      onClick={() => handleCancelAppointment(selectedAppointment.id)}
                    >
                      Cancel Appointment
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
