'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarIcon, Clock, User, MapPin, Plus, Edit, Trash2 } from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { AppLayout } from '@/components/layouts/app-layout'

interface Appointment {
  id: string
  patientName: string
  patientId: string
  date: Date
  time: string
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  reason: string
  notes?: string
  location: string
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    date: new Date(),
    time: '09:00',
    type: 'consultation',
    status: 'confirmed',
    reason: 'Chest pain and shortness of breath',
    location: 'Room 101'
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    patientId: 'P002',
    date: new Date(),
    time: '10:30',
    type: 'follow-up',
    status: 'scheduled',
    reason: 'Diabetes management follow-up',
    location: 'Room 102'
  },
  {
    id: '3',
    patientName: 'Mike Chen',
    patientId: 'P003',
    date: addDays(new Date(), 1),
    time: '14:00',
    type: 'routine',
    status: 'scheduled',
    reason: 'Annual physical examination',
    location: 'Room 101'
  }
]

export default function DoctorSchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientId: '',
    date: new Date(),
    time: '',
    type: 'consultation' as const,
    reason: '',
    location: 'Room 101'
  })

  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date())
  })

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, date))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { variant: 'secondary' as const, className: 'bg-secondary text-secondary-foreground' },
      confirmed: { variant: 'default' as const, className: 'bg-primary text-primary-foreground' },
      completed: { variant: 'outline' as const, className: 'bg-muted text-muted-foreground' },
      cancelled: { variant: 'destructive' as const, className: 'bg-destructive text-destructive-foreground' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      consultation: { variant: 'default' as const, className: 'bg-primary text-primary-foreground' },
      'follow-up': { variant: 'secondary' as const, className: 'bg-secondary text-secondary-foreground' },
      emergency: { variant: 'destructive' as const, className: 'bg-destructive text-destructive-foreground' },
      routine: { variant: 'outline' as const, className: 'bg-muted text-muted-foreground' }
    }

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.consultation
    return (
      <Badge variant={config.variant} className={config.className}>
        {type}
      </Badge>
    )
  }

  const handleAddAppointment = () => {
    const appointment: Appointment = {
      id: Date.now().toString(),
      ...newAppointment,
      status: 'scheduled',
      notes: ''
    }
    setAppointments([...appointments, appointment])
    setNewAppointment({
      patientName: '',
      patientId: '',
      date: new Date(),
      time: '',
      type: 'consultation',
      reason: '',
      location: 'Room 101'
    })
    setIsAddDialogOpen(false)
  }

  const handleEditAppointment = () => {
    if (!editingAppointment) return
    
    setAppointments(appointments.map(apt => 
      apt.id === editingAppointment.id ? editingAppointment : apt
    ))
    setEditingAppointment(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id))
  }

  const openEditDialog = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setIsEditDialogOpen(true)
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary rounded-xl p-3">
                <CalendarIcon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">My Schedule</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your appointments and daily schedule
                </p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Appointment
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader className="text-center pb-4">
                <DialogTitle className="text-xl flex items-center justify-center">
                  <Plus className="h-5 w-5 mr-2 text-primary" />
                  Schedule New Appointment
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a new patient appointment to your schedule
                </p>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Patient Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                    Patient Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName" className="text-sm font-medium text-foreground">Patient Name</Label>
                      <Input
                        id="patientName"
                        placeholder="Enter patient name"
                        className="h-10"
                        value={newAppointment.patientName}
                        onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientId" className="text-sm font-medium text-foreground">Patient ID</Label>
                      <Input
                        id="patientId"
                        placeholder="Enter patient ID"
                        className="h-10"
                        value={newAppointment.patientId}
                        onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                    Appointment Details
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium text-foreground">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        className="h-10"
                        value={newAppointment.date.toISOString().split('T')[0]}
                        onChange={(e) => setNewAppointment({...newAppointment, date: new Date(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-sm font-medium text-foreground">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        className="h-10"
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-medium text-foreground">Type</Label>
                      <Select
                        value={newAppointment.type}
                        onValueChange={(value: any) => setNewAppointment({...newAppointment, type: value})}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="routine">Routine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-foreground">Location</Label>
                    <Input
                      id="location"
                      placeholder="Room number or location"
                      className="h-10"
                      value={newAppointment.location}
                      onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-sm font-medium text-foreground">Reason for Visit</Label>
                    <Textarea
                      id="reason"
                      placeholder="Enter the reason for the appointment"
                      rows={3}
                      value={newAppointment.reason}
                      onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAppointment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-1">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger 
                value="calendar" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger 
                value="weekly"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <Clock className="h-4 w-4 mr-2" />
                Weekly View
              </TabsTrigger>
              <TabsTrigger 
                value="list"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <User className="h-4 w-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
                    <CardTitle className="text-lg text-foreground flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                      Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                  <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="w-full rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>
              
         
              
              <div className="lg:col-span-2 xl:col-span-2">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
                    <CardTitle className="text-lg text-foreground flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                      {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Today'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {getAppointmentsForDate(selectedDate || new Date()).length} appointment(s)
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 max-h-96 overflow-y-auto">
                    {getAppointmentsForDate(selectedDate || new Date()).length === 0 ? (
                      <div className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">
                          No appointments scheduled
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {getAppointmentsForDate(selectedDate || new Date()).map((appointment) => (
                          <div key={appointment.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="bg-primary/10 rounded-lg p-2">
                                  <Clock className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <span className="font-semibold text-foreground text-lg">{appointment.time}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(appointment.status)}
                                {getTypeBadge(appointment.type)}
                              </div>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center space-x-2">
                                <div className="bg-green-100 rounded-lg p-1">
                                  <User className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <span className="font-medium text-foreground">{appointment.patientName}</span>
                                  <span className="text-xs text-muted-foreground ml-2">({appointment.patientId})</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="bg-purple-100 rounded-lg p-1">
                                  <MapPin className="h-4 w-4 text-purple-600" />
                                </div>
                                <span className="text-sm text-muted-foreground">{appointment.location}</span>
                              </div>
                              <div className="bg-muted rounded-lg p-3 mt-3">
                                <p className="text-sm text-foreground font-medium mb-1">Reason for Visit:</p>
                                <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-border">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(appointment)}
                                  className="text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/30"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteAppointment(appointment.id)}
                                  className="text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/30"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {appointment.id}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader className="bg-muted border-b border-border">
                <CardTitle className="text-xl text-foreground flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Weekly Schedule
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Week of {format(startOfWeek(new Date()), 'MMM dd')} - {format(endOfWeek(new Date()), 'MMM dd, yyyy')}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {weekDays.map((day) => (
                    <div key={day.toISOString()} className="min-h-32">
                      <div className="text-center mb-3 pb-2 border-b border-border">
                        <div className="font-semibold text-sm text-foreground">
                          {format(day, 'EEE')}
                        </div>
                        <div className={`text-lg font-bold mt-1 ${
                          isSameDay(day, new Date()) 
                            ? 'text-primary bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mx-auto' 
                            : 'text-foreground'
                        }`}>
                          {format(day, 'dd')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(day, 'MMM')}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {getAppointmentsForDate(day).length === 0 ? (
                          <div className="text-center py-4">
                            <div className="text-xs text-muted-foreground">No appointments</div>
                          </div>
                        ) : (
                          getAppointmentsForDate(day).map((appointment) => (
                            <div
                              key={appointment.id}
                              className="p-2 text-xs bg-primary/10 border border-primary/20 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors"
                              onClick={() => setSelectedDate(day)}
                            >
                              <div className="font-semibold text-primary">{appointment.time}</div>
                              <div className="text-primary/80 truncate mt-1">{appointment.patientName}</div>
                              <div className="text-xs text-primary/60 mt-1">
                                {getTypeBadge(appointment.type)}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <Card>
              <CardHeader className="bg-muted border-b border-border">
                <CardTitle className="text-xl text-foreground flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  All Appointments
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {appointments.length} total appointment(s)
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No appointments scheduled</p>
                    </div>
                  ) : (
                    appointments.map((appointment) => (
                      <div key={appointment.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-center bg-primary/10 rounded-xl p-3 min-w-16">
                              <div className="text-xl font-bold text-primary">{format(appointment.date, 'dd')}</div>
                              <div className="text-xs text-primary/80 font-medium">{format(appointment.date, 'MMM')}</div>
                              <div className="text-xs text-primary/60">{format(appointment.date, 'yyyy')}</div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-semibold text-foreground">{appointment.time}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getStatusBadge(appointment.status)}
                                  {getTypeBadge(appointment.type)}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold text-foreground">{appointment.patientName}</span>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                  {appointment.patientId}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{appointment.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(appointment)}
                              className="text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="bg-muted rounded-lg p-3 border-l-4 border-primary">
                          <p className="text-sm text-foreground">{appointment.reason}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Appointment Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="text-center pb-4">
              <DialogTitle className="text-xl flex items-center justify-center">
                <Edit className="h-5 w-5 mr-2 text-primary" />
                Edit Appointment
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Update appointment details and information
              </p>
            </DialogHeader>
            {editingAppointment && (
              <div className="grid gap-6 py-4">
                {/* Patient Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                    Patient Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-patientName" className="text-sm font-medium text-foreground">Patient Name</Label>
                      <Input
                        id="edit-patientName"
                        placeholder="Enter patient name"
                        className="h-10"
                        value={editingAppointment.patientName}
                        onChange={(e) => setEditingAppointment({...editingAppointment, patientName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-patientId" className="text-sm font-medium text-foreground">Patient ID</Label>
                      <Input
                        id="edit-patientId"
                        placeholder="Enter patient ID"
                        className="h-10"
                        value={editingAppointment.patientId}
                        onChange={(e) => setEditingAppointment({...editingAppointment, patientId: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                    Appointment Details
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-date" className="text-sm font-medium text-foreground">Date</Label>
                      <Input
                        id="edit-date"
                        type="date"
                        className="h-10"
                        value={editingAppointment.date.toISOString().split('T')[0]}
                        onChange={(e) => setEditingAppointment({...editingAppointment, date: new Date(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-time" className="text-sm font-medium text-foreground">Time</Label>
                      <Input
                        id="edit-time"
                        type="time"
                        className="h-10"
                        value={editingAppointment.time}
                        onChange={(e) => setEditingAppointment({...editingAppointment, time: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-type" className="text-sm font-medium text-foreground">Type</Label>
                      <Select
                        value={editingAppointment.type}
                        onValueChange={(value: any) => setEditingAppointment({...editingAppointment, type: value})}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="routine">Routine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-location" className="text-sm font-medium text-foreground">Location</Label>
                    <Input
                      id="edit-location"
                      placeholder="Room number or location"
                      className="h-10"
                      value={editingAppointment.location}
                      onChange={(e) => setEditingAppointment({...editingAppointment, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-reason" className="text-sm font-medium text-foreground">Reason for Visit</Label>
                    <Textarea
                      id="edit-reason"
                      placeholder="Enter the reason for the appointment"
                      rows={3}
                      value={editingAppointment.reason}
                      onChange={(e) => setEditingAppointment({...editingAppointment, reason: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditAppointment}>
                <Edit className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
