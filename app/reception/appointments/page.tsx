'use client'

import { AppLayout } from '@/components/layouts/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, Column } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment } from '@/hooks/use-api'
import { appointmentSchema, appointmentUpdateSchema } from '@/lib/validation'
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Loader2, Search, Filter, Clock, User, Stethoscope } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const appointmentColumns: Column<any>[] = [
  {
    key: 'patientName',
    title: 'Patient',
    sortable: true,
    render: (value, row) => (
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span>{value}</span>
      </div>
    ),
  },
  {
    key: 'doctorName',
    title: 'Doctor',
    sortable: true,
    render: (value, row) => (
      <div className="flex items-center space-x-2">
        <Stethoscope className="h-4 w-4 text-muted-foreground" />
        <span>{value}</span>
      </div>
    ),
  },
  {
    key: 'appointmentDate',
    title: 'Date',
    sortable: true,
    render: (value) => value ? format(new Date(value), 'MMM dd, yyyy') : 'N/A',
  },
  {
    key: 'appointmentTime',
    title: 'Time',
    render: (value) => (
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span>{value}</span>
      </div>
    ),
  },
  {
    key: 'type',
    title: 'Type',
    render: (value) => (
      <Badge variant="secondary" className="capitalize">
        {value}
      </Badge>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    render: (value) => {
      const variants: any = {
        scheduled: 'default',
        confirmed: 'secondary',
        completed: 'outline',
        cancelled: 'destructive',
        noShow: 'secondary'
      }
      return (
        <Badge variant={variants[value] || 'secondary'}>
          {value}
        </Badge>
      )
    },
  },
  {
    key: 'notes',
    title: 'Notes',
    render: (value) => (
      <span className="max-w-xs truncate" title={value}>
        {value || 'No notes'}
      </span>
    ),
  },
]

export default function AppointmentsManagementPage() {
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false)
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [typeFilter, setTypeFilter] = useState('')

  // API hooks
  const { data: appointmentsData, isLoading: appointmentsLoading } = useAppointments()
  const createAppointmentMutation = useCreateAppointment()
  const updateAppointmentMutation = useUpdateAppointment()
  const deleteAppointmentMutation = useDeleteAppointment()

  // Form handling
  const addAppointmentForm = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: '',
      doctorId: '',
      appointmentDate: new Date(),
      appointmentTime: '',
      type: 'consultation',
      status: 'scheduled',
      notes: '',
      duration: '30'
    }
  })

  const editAppointmentForm = useForm({
    resolver: zodResolver(appointmentUpdateSchema),
    defaultValues: {
      patientId: '',
      doctorId: '',
      appointmentDate: new Date(),
      appointmentTime: '',
      type: 'consultation',
      status: 'scheduled',
      notes: '',
      duration: '30'
    }
  })

  const handleAddAppointment = async (data: any) => {
    try {
      await createAppointmentMutation.mutateAsync(data)
      setIsAddAppointmentOpen(false)
      addAppointmentForm.reset()
      toast({
        title: "Success",
        description: "Appointment created successfully",
      })
    } catch (error) {
      console.error('Failed to create appointment:', error)
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive"
      })
    }
  }

  const handleEditAppointment = async (data: any) => {
    if (!selectedAppointment) return
    
    try {
      await updateAppointmentMutation.mutateAsync({
        id: selectedAppointment.id,
        data
      })
      setIsEditAppointmentOpen(false)
      setSelectedAppointment(null)
      editAppointmentForm.reset()
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      })
    } catch (error) {
      console.error('Failed to update appointment:', error)
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return
    
    try {
      await deleteAppointmentMutation.mutateAsync(selectedAppointment.id)
      setIsDeleteConfirmOpen(false)
      setSelectedAppointment(null)
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      })
    } catch (error) {
      console.error('Failed to delete appointment:', error)
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive"
      })
    }
  }

  const openEditDialog = (appointment: any) => {
    setSelectedAppointment(appointment)
    editAppointmentForm.reset({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate) : new Date(),
      appointmentTime: appointment.appointmentTime,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
      duration: appointment.duration
    })
    setIsEditAppointmentOpen(true)
  }

  const openDeleteDialog = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsDeleteConfirmOpen(true)
  }

  const appointmentActions = (appointment: any) => (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => openEditDialog(appointment)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => openDeleteDialog(appointment)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  // Filter appointments data
  const filteredAppointments = appointmentsData?.filter((appointment: any) => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || appointment.status === statusFilter
    const matchesType = !typeFilter || appointment.type === typeFilter
    const matchesDate = !dateFilter || 
                       format(new Date(appointment.appointmentDate), 'yyyy-MM-dd') === 
                       format(dateFilter, 'yyyy-MM-dd')
    
    return matchesSearch && matchesStatus && matchesType && matchesDate
  }) || []

  // Mock data for patients and doctors (in real app, these would come from API)
  const patients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' }
  ]

  const doctors = [
    { id: '1', name: 'Dr. Sarah Wilson' },
    { id: '2', name: 'Dr. Michael Brown' },
    { id: '3', name: 'Dr. Emily Davis' }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments Management</h1>
            <p className="text-muted-foreground">
              Schedule and manage patient appointments
            </p>
          </div>
          <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Create a new appointment for a patient.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={addAppointmentForm.handleSubmit(handleAddAppointment)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient</Label>
                    <Select onValueChange={(value) => addAppointmentForm.setValue('patientId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {addAppointmentForm.formState.errors.patientId && (
                      <p className="text-sm text-red-500 mt-1">
                        {addAppointmentForm.formState.errors.patientId.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctorId">Doctor</Label>
                    <Select onValueChange={(value) => addAppointmentForm.setValue('doctorId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {addAppointmentForm.formState.errors.doctorId && (
                      <p className="text-sm text-red-500 mt-1">
                        {addAppointmentForm.formState.errors.doctorId.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDate">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !addAppointmentForm.watch('appointmentDate') && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {addAppointmentForm.watch('appointmentDate') ? (
                            format(addAppointmentForm.watch('appointmentDate'), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={addAppointmentForm.watch('appointmentDate')}
                          onSelect={(date) => addAppointmentForm.setValue('appointmentDate', date || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentTime">Time</Label>
                    <Select onValueChange={(value) => addAppointmentForm.setValue('appointmentTime', value)}>
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
                    {addAppointmentForm.formState.errors.appointmentTime && (
                      <p className="text-sm text-red-500 mt-1">
                        {addAppointmentForm.formState.errors.appointmentTime.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Appointment Type</Label>
                    <Select onValueChange={(value) => addAppointmentForm.setValue('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="followup">Follow-up</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="routine">Routine Check</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select onValueChange={(value) => addAppointmentForm.setValue('duration', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    {...addAppointmentForm.register('notes')}
                    placeholder="Additional notes or instructions"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddAppointmentOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createAppointmentMutation.isPending}
                  >
                    {createAppointmentMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Schedule Appointment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="noShow">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="routine">Routine Check</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-40 justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFilter ? format(dateFilter, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>
                  {filteredAppointments.length} appointments found
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredAppointments}
              columns={appointmentColumns}
              actions={appointmentActions}
              searchPlaceholder="Search appointments..."
              loading={appointmentsLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditAppointmentOpen} onOpenChange={setIsEditAppointmentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>
              Update appointment details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editAppointmentForm.handleSubmit(handleEditAppointment)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-patientId">Patient</Label>
                <Select onValueChange={(value) => editAppointmentForm.setValue('patientId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-doctorId">Doctor</Label>
                <Select onValueChange={(value) => editAppointmentForm.setValue('doctorId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-appointmentDate">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editAppointmentForm.watch('appointmentDate') && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editAppointmentForm.watch('appointmentDate') ? (
                        format(editAppointmentForm.watch('appointmentDate'), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editAppointmentForm.watch('appointmentDate')}
                      onSelect={(date) => editAppointmentForm.setValue('appointmentDate', date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-appointmentTime">Time</Label>
                <Select onValueChange={(value) => editAppointmentForm.setValue('appointmentTime', value)}>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Appointment Type</Label>
                <Select onValueChange={(value) => editAppointmentForm.setValue('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="routine">Routine Check</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select onValueChange={(value) => editAppointmentForm.setValue('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="noShow">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                {...editAppointmentForm.register('notes')}
                placeholder="Additional notes or instructions"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditAppointmentOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateAppointmentMutation.isPending}
              >
                {updateAppointmentMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Edit className="mr-2 h-4 w-4" />
                )}
                Update Appointment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAppointment}
              disabled={deleteAppointmentMutation.isPending}
            >
              {deleteAppointmentMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
