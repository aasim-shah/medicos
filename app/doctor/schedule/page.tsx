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
    const variants = {
      scheduled: 'default',
      confirmed: 'secondary',
      completed: 'default',
      cancelled: 'destructive'
    } as const

    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
            <p className="text-muted-foreground">
              Manage your appointments and schedule
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Appointment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      value={newAppointment.patientName}
                      onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={newAppointment.patientId}
                      onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newAppointment.date.toISOString().split('T')[0]}
                      onChange={(e) => setNewAppointment({...newAppointment, date: new Date(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newAppointment.type}
                    onValueChange={(value: any) => setNewAppointment({...newAppointment, type: value})}
                  >
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={newAppointment.reason}
                    onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newAppointment.location}
                    onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAppointment}>
                  Add Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
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
                              <span className="font-medium">{appointment.patientName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{appointment.location}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(appointment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAppointment(appointment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => (
                    <div key={day.toISOString()} className="text-center">
                      <div className="font-medium text-sm mb-2">
                        {format(day, 'EEE')}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {format(day, 'MMM dd')}
                      </div>
                      <div className="space-y-1">
                        {getAppointmentsForDate(day).map((appointment) => (
                          <div
                            key={appointment.id}
                            className="p-2 text-xs bg-primary/10 rounded border cursor-pointer hover:bg-primary/20"
                            onClick={() => setSelectedDate(day)}
                          >
                            <div className="font-medium">{appointment.time}</div>
                            <div className="truncate">{appointment.patientName}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.map((appointment) => (
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
                              <span className="font-medium">{appointment.patientName}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(appointment.status)}
                          {getTypeBadge(appointment.type)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(appointment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAppointment(appointment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{appointment.location}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Appointment Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
            </DialogHeader>
            {editingAppointment && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-patientName">Patient Name</Label>
                    <Input
                      id="edit-patientName"
                      value={editingAppointment.patientName}
                      onChange={(e) => setEditingAppointment({...editingAppointment, patientName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-patientId">Patient ID</Label>
                    <Input
                      id="edit-patientId"
                      value={editingAppointment.patientId}
                      onChange={(e) => setEditingAppointment({...editingAppointment, patientId: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Date</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={editingAppointment.date.toISOString().split('T')[0]}
                      onChange={(e) => setEditingAppointment({...editingAppointment, date: new Date(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-time">Time</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={editingAppointment.time}
                      onChange={(e) => setEditingAppointment({...editingAppointment, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={editingAppointment.type}
                    onValueChange={(value: any) => setEditingAppointment({...editingAppointment, type: value})}
                  >
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="edit-reason">Reason</Label>
                  <Textarea
                    id="edit-reason"
                    value={editingAppointment.reason}
                    onChange={(e) => setEditingAppointment({...editingAppointment, reason: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editingAppointment.location}
                    onChange={(e) => setEditingAppointment({...editingAppointment, location: e.target.value})}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditAppointment}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
