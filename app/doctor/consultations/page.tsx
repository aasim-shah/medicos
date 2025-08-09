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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Stethoscope, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Calendar, 
  FileText, 
  User, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarDays,
  Pill,
  TestTube,
  Activity
} from 'lucide-react'
import { useState, useMemo } from 'react'

// Mock data for consultations
const mockConsultations = [
  {
    id: 'C001',
    patientId: 'P001',
    patientName: 'John Smith',
    patientAge: 45,
    patientGender: 'Male',
    date: '2024-01-15',
    time: '09:00 AM',
    type: 'Follow-up',
    status: 'completed',
    reason: 'Hypertension management follow-up',
    symptoms: 'Mild headache, occasional dizziness',
    diagnosis: 'Controlled hypertension',
    treatment: 'Continue Lisinopril 10mg daily, monitor blood pressure',
    medications: [
      { name: 'Lisinopril 10mg', dosage: '1 tablet daily', duration: '30 days' },
      { name: 'Aspirin 81mg', dosage: '1 tablet daily', duration: 'Lifetime' }
    ],
    labOrders: [
      { test: 'Complete Blood Count', status: 'ordered', date: '2024-01-16' },
      { test: 'Comprehensive Metabolic Panel', status: 'ordered', date: '2024-01-16' }
    ],
    followUp: '2024-02-15',
    notes: 'Patient reports good compliance with medication. Blood pressure improved from 150/95 to 140/90. Continue current treatment plan.',
    doctor: 'Dr. Sarah Johnson',
    duration: '30 minutes'
  },
  {
    id: 'C002',
    patientId: 'P002',
    patientName: 'Sarah Wilson',
    patientAge: 32,
    patientGender: 'Female',
    date: '2024-01-15',
    time: '10:30 AM',
    type: 'New Patient',
    status: 'pending',
    reason: 'Initial consultation for diabetes management',
    symptoms: 'Increased thirst, frequent urination, fatigue',
    diagnosis: 'Type 2 Diabetes (suspected)',
    treatment: 'Order diagnostic tests, lifestyle modification counseling',
    medications: [],
    labOrders: [
      { test: 'Fasting Blood Glucose', status: 'ordered', date: '2024-01-16' },
      { test: 'HbA1c', status: 'ordered', date: '2024-01-16' },
      { test: 'Lipid Panel', status: 'ordered', date: '2024-01-16' }
    ],
    followUp: '2024-01-22',
    notes: 'Patient presents with classic diabetes symptoms. Ordered comprehensive metabolic workup. Provided dietary and exercise counseling.',
    doctor: 'Dr. Sarah Johnson',
    duration: '45 minutes'
  },
  {
    id: 'C003',
    patientId: 'P003',
    patientName: 'Michael Brown',
    patientAge: 58,
    patientGender: 'Male',
    date: '2024-01-14',
    time: '02:00 PM',
    type: 'Emergency',
    status: 'completed',
    reason: 'Chest pain and shortness of breath',
    symptoms: 'Sharp chest pain, difficulty breathing, sweating',
    diagnosis: 'Angina (stable)',
    treatment: 'Nitroglycerin, lifestyle modification, medication adjustment',
    medications: [
      { name: 'Nitroglycerin 0.4mg', dosage: '1 tablet sublingual as needed', duration: 'As needed' },
      { name: 'Atorvastatin 40mg', dosage: '1 tablet daily', duration: 'Lifetime' }
    ],
    labOrders: [
      { test: 'Troponin', status: 'completed', date: '2024-01-14' },
      { test: 'EKG', status: 'completed', date: '2024-01-14' }
    ],
    followUp: '2024-01-21',
    notes: 'Patient experienced chest pain while exercising. EKG showed no acute changes. Troponin negative. Diagnosed with stable angina.',
    doctor: 'Dr. Sarah Johnson',
    duration: '60 minutes'
  },
  {
    id: 'C004',
    patientId: 'P004',
    patientName: 'Emily Davis',
    patientAge: 28,
    patientGender: 'Female',
    date: '2024-01-16',
    time: '11:00 AM',
    type: 'Routine',
    status: 'scheduled',
    reason: 'Annual physical examination',
    symptoms: 'None reported',
    diagnosis: 'Pending',
    treatment: 'Pending',
    medications: [],
    labOrders: [],
    followUp: 'TBD',
    notes: 'Annual wellness visit scheduled. Will perform comprehensive physical examination and order routine screening tests.',
    doctor: 'Dr. Sarah Johnson',
    duration: '45 minutes'
  },
  {
    id: 'C005',
    patientId: 'P005',
    patientName: 'David Thompson',
    patientAge: 41,
    patientGender: 'Male',
    date: '2024-01-13',
    time: '03:30 PM',
    type: 'Follow-up',
    status: 'completed',
    reason: 'Sleep apnea management',
    symptoms: 'Improved sleep quality, reduced daytime fatigue',
    diagnosis: 'Obstructive Sleep Apnea (well-controlled)',
    treatment: 'Continue CPAP therapy, weight management',
    medications: [],
    labOrders: [],
    followUp: '2024-04-13',
    notes: 'Patient reports significant improvement with CPAP therapy. Sleep study showed AHI reduced from 25 to 3. Continue current treatment.',
    doctor: 'Dr. Sarah Johnson',
    duration: '25 minutes'
  }
]

export default function ConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null)
  const [isConsultationDetailsOpen, setIsConsultationDetailsOpen] = useState(false)
  const [isNewConsultationOpen, setIsNewConsultationOpen] = useState(false)
  const [isEditConsultationOpen, setIsEditConsultationOpen] = useState(false)

  // Filter consultations based on search and filters
  const filteredConsultations = useMemo(() => {
    return mockConsultations.filter(consultation => {
      const matchesSearch = consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultation.reason.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter
      const matchesType = typeFilter === 'all' || consultation.type === typeFilter
      
      return matchesSearch && matchesStatus && matchesType
    })
  }, [searchTerm, statusFilter, typeFilter])

  const handleViewConsultation = (consultation: any) => {
    setSelectedConsultation(consultation)
    setIsConsultationDetailsOpen(true)
  }

  const handleEditConsultation = (consultation: any) => {
    setSelectedConsultation(consultation)
    setIsEditConsultationOpen(true)
  }

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge variant="default"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>
    }
    if (status === 'pending') {
      return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>
    }
    if (status === 'scheduled') {
      return <Badge variant="outline"><CalendarDays className="mr-1 h-3 w-3" />Scheduled</Badge>
    }
    if (status === 'cancelled') {
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Cancelled</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    if (type === 'Emergency') {
      return <Badge variant="destructive">{type}</Badge>
    }
    if (type === 'Follow-up') {
      return <Badge variant="default">{type}</Badge>
    }
    if (type === 'New Patient') {
      return <Badge variant="secondary">{type}</Badge>
    }
    return <Badge variant="outline">{type}</Badge>
  }

  const getLabOrderStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge variant="default">Completed</Badge>
    }
    if (status === 'ordered') {
      return <Badge variant="secondary">Ordered</Badge>
    }
    if (status === 'pending') {
      return <Badge variant="outline">Pending</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
            <p className="text-muted-foreground">
              Manage patient consultations, treatment plans, and follow-ups
            </p>
          </div>
          <Dialog open={isNewConsultationOpen} onOpenChange={setIsNewConsultationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Consultation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>New Consultation</DialogTitle>
                <DialogDescription>
                  Create a new patient consultation record.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input id="patientName" placeholder="Patient name" />
                  </div>
                  <div>
                    <Label htmlFor="consultationType">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Patient</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea id="reason" placeholder="Primary reason for consultation" />
                </div>
                <div>
                  <Label htmlFor="notes">Initial Notes</Label>
                  <Textarea id="notes" placeholder="Any preliminary notes or observations" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewConsultationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewConsultationOpen(false)}>
                  Create Consultation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Consultations</CardTitle>
            <CardDescription>
              Search and filter consultation records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient name, ID, or reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="New Patient">New Patient</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Routine">Routine</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Consultations Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Follow-up</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConsultations.map((consultation) => (
                      <TableRow key={consultation.id}>
                        <TableCell className="font-medium">{consultation.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{consultation.patientName}</div>
                            <div className="text-sm text-muted-foreground">
                              {consultation.patientAge} / {consultation.patientGender}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{consultation.date}</div>
                            <div className="text-muted-foreground">{consultation.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(consultation.type)}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate" title={consultation.reason}>
                            {consultation.reason}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                        <TableCell>
                          {consultation.followUp ? (
                            <div className="text-sm">
                              <div>{consultation.followUp}</div>
                              <div className="text-muted-foreground">{consultation.duration}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">TBD</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewConsultation(consultation)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditConsultation(consultation)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultation Details Dialog */}
      <Dialog open={isConsultationDetailsOpen} onOpenChange={setIsConsultationDetailsOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Consultation Details - {selectedConsultation?.patientName}</DialogTitle>
            <DialogDescription>
              Comprehensive consultation information and treatment plan
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                <TabsTrigger value="treatment">Treatment</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="lab">Lab Orders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Consultation ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedConsultation?.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Patient Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedConsultation?.patientName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date & Time</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedConsultation?.date} at {selectedConsultation?.time}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Duration</Label>
                    <p className="text-sm text-muted-foreground">{selectedConsultation?.duration}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="text-sm text-muted-foreground">{selectedConsultation?.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <p className="text-sm text-muted-foreground">{selectedConsultation?.status}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Reason for Visit</Label>
                    <p className="text-sm text-muted-foreground">{selectedConsultation?.reason}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Follow-up Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedConsultation?.followUp || 'Not scheduled'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm text-muted-foreground">{selectedConsultation?.notes}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="symptoms" className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Presenting Symptoms</h4>
                  <p className="text-sm text-muted-foreground">{selectedConsultation?.symptoms}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="diagnosis" className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Diagnosis</h4>
                  <p className="text-sm text-muted-foreground">{selectedConsultation?.diagnosis}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="treatment" className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Treatment Plan</h4>
                  <p className="text-sm text-muted-foreground">{selectedConsultation?.treatment}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="medications" className="space-y-4">
                <div className="space-y-3">
                  {selectedConsultation?.medications && selectedConsultation.medications.length > 0 ? (
                    selectedConsultation.medications.map((medication: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Pill className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium">{medication.name}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-xs font-medium">Dosage</Label>
                            <p className="text-muted-foreground">{medication.dosage}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium">Duration</Label>
                            <p className="text-muted-foreground">{medication.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border rounded-lg text-center text-muted-foreground">
                      No medications prescribed
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="lab" className="space-y-4">
                <div className="space-y-3">
                  {selectedConsultation?.labOrders && selectedConsultation.labOrders.length > 0 ? (
                    selectedConsultation.labOrders.map((order: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <TestTube className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium">{order.test}</h4>
                          </div>
                          {getLabOrderStatusBadge(order.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Ordered: {order.date}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border rounded-lg text-center text-muted-foreground">
                      No lab orders
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsConsultationDetailsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleEditConsultation(selectedConsultation)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Consultation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Consultation Dialog */}
      <Dialog open={isEditConsultationOpen} onOpenChange={setIsEditConsultationOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Consultation - {selectedConsultation?.patientName}</DialogTitle>
            <DialogDescription>
              Update consultation details and treatment plan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editDate">Date</Label>
                <Input id="editDate" type="date" defaultValue={selectedConsultation?.date} />
              </div>
              <div>
                <Label htmlFor="editTime">Time</Label>
                <Input id="editTime" type="time" defaultValue={selectedConsultation?.time} />
              </div>
            </div>
            <div>
              <Label htmlFor="editReason">Reason for Visit</Label>
              <Textarea id="editReason" defaultValue={selectedConsultation?.reason} />
            </div>
            <div>
              <Label htmlFor="editDiagnosis">Diagnosis</Label>
              <Textarea id="editDiagnosis" defaultValue={selectedConsultation?.diagnosis} />
            </div>
            <div>
              <Label htmlFor="editTreatment">Treatment Plan</Label>
              <Textarea id="editTreatment" defaultValue={selectedConsultation?.treatment} />
            </div>
            <div>
              <Label htmlFor="editNotes">Notes</Label>
              <Textarea id="editNotes" defaultValue={selectedConsultation?.notes} />
            </div>
            <div>
              <Label htmlFor="editFollowUp">Follow-up Date</Label>
              <Input id="editFollowUp" type="date" defaultValue={selectedConsultation?.followUp} />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditConsultationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditConsultationOpen(false)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
