'use client'

import { AppLayout } from '@/components/layouts/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, Column } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, Phone, User, Plus, CheckCircle } from 'lucide-react'
import { useState } from 'react'

// Mock data for today's appointments
const todaysAppointments = [
  {
    id: '1',
    time: '09:00',
    patient: 'John Smith',
    phone: '+1 (555) 123-4567',
    doctor: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    status: 'checked-in',
    type: 'consultation'
  },
  {
    id: '2',
    time: '10:30',
    patient: 'Emily Davis',
    phone: '+1 (555) 234-5678',
    doctor: 'Dr. Michael Brown',
    department: 'Dermatology',
    status: 'booked',
    type: 'follow-up'
  },
  {
    id: '3',
    time: '11:00',
    patient: 'Robert Wilson',
    phone: '+1 (555) 345-6789',
    doctor: 'Dr. Lisa Anderson',
    department: 'Orthopedics',
    status: 'booked',
    type: 'consultation'
  }
]

const appointmentColumns: Column<typeof todaysAppointments[0]>[] = [
  {
    key: 'time',
    title: 'Time',
    width: '80px',
    render: (value) => (
      <div className="flex items-center font-medium">
        <Clock className="mr-2 h-4 w-4" />
        {value}
      </div>
    ),
  },
  {
    key: 'patient',
    title: 'Patient',
    sortable: true,
  },
  {
    key: 'phone',
    title: 'Phone',
    render: (value) => (
      <div className="flex items-center">
        <Phone className="mr-2 h-3 w-3" />
        {value}
      </div>
    ),
  },
  {
    key: 'doctor',
    title: 'Doctor',
    sortable: true,
  },
  {
    key: 'department',
    title: 'Department',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Status',
    render: (value) => (
      <Badge variant={value === 'checked-in' ? 'default' : 'secondary'}>
        {value === 'checked-in' ? 'Checked In' : 'Booked'}
      </Badge>
    ),
  },
]

export default function ReceptionDashboard() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const handleCheckIn = (appointment: any) => {
    console.log('Check in patient:', appointment)
  }

  const handleBookAppointment = () => {
    setIsBookingOpen(true)
  }

  const handleRegisterPatient = () => {
    setIsRegistrationOpen(true)
  }

  const appointmentActions = (appointment: any) => (
    <div className="flex items-center space-x-1">
      {appointment.status !== 'checked-in' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCheckIn(appointment)}
        >
          <CheckCircle className="mr-2 h-3 w-3" />
          Check In
        </Button>
      )}
    </div>
  )

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reception</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage appointments and patient registration
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <User className="mr-2 h-4 w-4" />
                  Register Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Register New Patient</DialogTitle>
                  <DialogDescription>
                    Register a new patient in the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm">First Name</Label>
                      <Input id="firstName" placeholder="First name" className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                      <Input id="lastName" placeholder="Last name" className="w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <Input id="email" type="email" placeholder="Email address" className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">Phone</Label>
                      <Input id="phone" placeholder="Phone number" className="w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm">Address</Label>
                    <Textarea id="address" placeholder="Full address" rows={2} className="w-full" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-sm">Date of Birth</Label>
                      <Input id="dateOfBirth" type="date" className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact" className="text-sm">Emergency Contact</Label>
                      <Input id="emergencyContact" placeholder="Emergency contact" className="w-full" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button variant="outline" onClick={() => setIsRegistrationOpen(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={() => setIsRegistrationOpen(false)} className="w-full sm:w-auto">
                    Register Patient
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleBookAppointment} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Book Appointment</DialogTitle>
                  <DialogDescription>
                    Schedule an appointment for a patient.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient" className="text-sm">Patient</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john">John Smith</SelectItem>
                          <SelectItem value="emily">Emily Davis</SelectItem>
                          <SelectItem value="robert">Robert Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor" className="text-sm">Doctor</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sarah">Dr. Sarah Johnson</SelectItem>
                          <SelectItem value="michael">Dr. Michael Brown</SelectItem>
                          <SelectItem value="lisa">Dr. Lisa Anderson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm">Date</Label>
                      <Input id="date" type="date" className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-sm">Time</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="09:30">9:30 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="10:30">10:30 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-sm">Reason</Label>
                    <Textarea id="reason" placeholder="Reason for appointment" rows={3} className="w-full" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button variant="outline" onClick={() => setIsBookingOpen(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={() => setIsBookingOpen(false)} className="w-full sm:w-auto">
                    Book Appointment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{todaysAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {todaysAppointments.filter(a => a.status === 'checked-in').length} checked in
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Pending Check-ins</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {todaysAppointments.filter(a => a.status === 'booked').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting arrival
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Checked In</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {todaysAppointments.filter(a => a.status === 'checked-in').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Patients seen
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Patients</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                Registered patients
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl">Today's Appointments</CardTitle>
                <CardDescription className="text-sm">
                  Manage today's scheduled appointments
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <DataTable
                data={todaysAppointments}
                columns={appointmentColumns}
                actions={appointmentActions}
                searchPlaceholder="Search appointments..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}