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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reception</h1>
            <p className="text-muted-foreground">
              Manage appointments and patient registration
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Register Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Register New Patient</DialogTitle>
                  <DialogDescription>
                    Add a new patient to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dateOfBirth" className="text-right">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone number"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Full address"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="emergencyContact" className="text-right">
                      Emergency Contact
                    </Label>
                    <Input
                      id="emergencyContact"
                      placeholder="Emergency contact name and phone"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsRegistrationOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsRegistrationOpen(false)}>
                    Register Patient
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
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
                    Schedule an appointment for a patient.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patientSelect" className="text-right">
                      Patient
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john">John Smith</SelectItem>
                        <SelectItem value="emily">Emily Davis</SelectItem>
                        <SelectItem value="robert">Robert Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="doctorSelect" className="text-right">
                      Doctor
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Dr. Sarah Johnson - Cardiology</SelectItem>
                        <SelectItem value="michael">Dr. Michael Brown - Dermatology</SelectItem>
                        <SelectItem value="lisa">Dr. Lisa Anderson - Orthopedics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="appointmentDate" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="appointmentDate"
                      type="date"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="appointmentTime" className="text-right">
                      Time
                    </Label>
                    <Input
                      id="appointmentTime"
                      type="time"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="appointmentType" className="text-right">
                      Type
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Appointment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="followup">Follow-up</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="routine">Routine Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsBookingOpen(false)}>
                    Book Appointment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {todaysAppointments.filter(a => a.status === 'checked-in').length} checked in
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10:30</div>
              <p className="text-xs text-muted-foreground">
                Emily Davis - Dr. Brown
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Walk-ins Today</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                All accommodated
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>
              Manage check-ins and appointment scheduling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={todaysAppointments}
              columns={appointmentColumns}
              actions={appointmentActions}
              searchPlaceholder="Search by patient name or phone..."
              pageSize={15}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}