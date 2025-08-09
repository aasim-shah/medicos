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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Calendar, Stethoscope, FileText, Plus, Eye, Edit, Clock, AlertCircle } from 'lucide-react'
import { useState } from 'react'

// Mock data for doctor dashboard
const mockStats = {
  totalPatients: 156,
  appointmentsToday: 12,
  pendingConsultations: 3,
  completedToday: 8
}

const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    age: 45,
    condition: 'Hypertension',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-01-20',
    status: 'active',
    bloodPressure: '140/90',
    weight: '75kg',
    allergies: 'Penicillin'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    age: 32,
    condition: 'Diabetes Type 2',
    lastVisit: '2024-01-12',
    nextAppointment: '2024-01-25',
    status: 'active',
    bloodPressure: '120/80',
    weight: '68kg',
    allergies: 'None'
  },
  {
    id: '3',
    name: 'Michael Brown',
    age: 58,
    condition: 'Heart Disease',
    lastVisit: '2024-01-08',
    nextAppointment: '2024-01-18',
    status: 'active',
    bloodPressure: '135/85',
    weight: '82kg',
    allergies: 'Sulfa drugs'
  }
]

const mockConsultations = [
  {
    id: '1',
    patientName: 'John Smith',
    date: '2024-01-15',
    time: '09:00 AM',
    type: 'Follow-up',
    status: 'completed',
    notes: 'Blood pressure improved with medication adjustment'
  },
  {
    id: '2',
    patientName: 'Sarah Wilson',
    date: '2024-01-15',
    time: '10:30 AM',
    type: 'New Patient',
    status: 'pending',
    notes: 'Initial consultation for diabetes management'
  }
]

export default function DoctorDashboard() {
  const [isNewConsultationOpen, setIsNewConsultationOpen] = useState(false)
  const [isPatientDetailsOpen, setIsPatientDetailsOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false)

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient)
    setIsPatientDetailsOpen(true)
  }

  const handleScheduleFollowUp = (patient: any) => {
    setSelectedPatient(patient)
    setIsFollowUpOpen(true)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your patients and consultations
            </p>
          </div>
          <Dialog open={isNewConsultationOpen} onOpenChange={setIsNewConsultationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Consultation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Patient Consultation</DialogTitle>
                <DialogDescription>
                  Start a new consultation with a patient.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="patientName" className="text-right">
                    Patient
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Smith</SelectItem>
                      <SelectItem value="sarah">Sarah Wilson</SelectItem>
                      <SelectItem value="michael">Michael Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="consultationType" className="text-right">
                    Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="followup">Follow-up</SelectItem>
                      <SelectItem value="new">New Patient</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="routine">Routine Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="symptoms" className="text-right">
                    Symptoms
                  </Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Patient symptoms"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diagnosis" className="text-right">
                    Diagnosis
                  </Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Diagnosis and findings"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="treatment" className="text-right">
                    Treatment
                  </Label>
                  <Textarea
                    id="treatment"
                    placeholder="Treatment plan"
                    className="col-span-3"
                  />
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
                <Button variant="outline" onClick={() => setIsNewConsultationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewConsultationOpen(false)}>
                  Start Consultation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                +5 new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.appointmentsToday}</div>
              <p className="text-xs text-muted-foreground">
                {mockStats.completedToday} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Consultations</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.pendingConsultations}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                Updated this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Consultations</CardTitle>
            <CardDescription>
              Your recent patient consultations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockConsultations.map((consultation) => (
                <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{consultation.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {consultation.type} • {consultation.date} at {consultation.time}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {consultation.notes}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={consultation.status === 'completed' ? 'default' : 'secondary'}>
                      {consultation.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>
              Your active patients and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Age: {patient.age} • {patient.condition}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last visit: {patient.lastVisit} • Next: {patient.nextAppointment}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{patient.status}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewPatient(patient)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleScheduleFollowUp(patient)}
                    >
                      <Clock className="mr-2 h-3 w-3" />
                      Follow-up
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Details Dialog */}
      <Dialog open={isPatientDetailsOpen} onOpenChange={setIsPatientDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Patient Details - {selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              Comprehensive patient information and medical history
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Age</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.age} years</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Condition</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.condition}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Allergies</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.allergies}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="vitals" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Blood Pressure</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.bloodPressure}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Weight</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.weight}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium">Last Visit</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.lastVisit}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Next Appointment</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.nextAppointment}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="medications" className="space-y-4">
                <p className="text-sm text-muted-foreground">No current medications</p>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsPatientDetailsOpen(false)}>
              Close
            </Button>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Patient
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Follow-up Dialog */}
      <Dialog open={isFollowUpOpen} onOpenChange={setIsFollowUpOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Follow-up</DialogTitle>
            <DialogDescription>
              Schedule a follow-up appointment for {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="followUpDate" className="text-right">
                Date
              </Label>
              <Input
                id="followUpDate"
                type="date"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="followUpTime" className="text-right">
                Time
              </Label>
              <Input
                id="followUpTime"
                type="time"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="followUpType" className="text-right">
                Type
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Follow-up type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine Check</SelectItem>
                  <SelectItem value="medication">Medication Review</SelectItem>
                  <SelectItem value="test">Test Results Review</SelectItem>
                  <SelectItem value="emergency">Emergency Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="followUpReason" className="text-right">
                Reason
              </Label>
              <Textarea
                id="followUpReason"
                placeholder="Reason for follow-up"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsFollowUpOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsFollowUpOpen(false)}>
              Schedule Follow-up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
