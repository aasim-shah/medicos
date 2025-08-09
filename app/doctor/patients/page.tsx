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
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Calendar, 
  FileText, 
  Activity, 
  Pill, 
  TestTube,
  Phone,
  Mail,
  MapPin,
  Heart,
  Weight,
  Thermometer,
  Stethoscope
} from 'lucide-react'
import { useState, useMemo } from 'react'

// Mock data for patients
const mockPatients = [
  {
    id: 'P001',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@email.com',
    address: '123 Main St, City, State 12345',
    bloodType: 'O+',
    weight: '75kg',
    height: '175cm',
    emergencyContact: 'Mary Smith (Wife) +1 (555) 123-4568',
    insurance: 'Blue Cross Blue Shield',
    primaryCare: 'Dr. Sarah Johnson',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-01-20',
    status: 'active',
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin', 'Sulfa drugs'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    vitalSigns: {
      bloodPressure: '140/90',
      heartRate: '72 bpm',
      temperature: '98.6°F',
      oxygenSaturation: '98%'
    }
  },
  {
    id: 'P002',
    name: 'Sarah Wilson',
    age: 32,
    gender: 'Female',
    phone: '+1 (555) 234-5678',
    email: 'sarah.wilson@email.com',
    address: '456 Oak Ave, City, State 12345',
    bloodType: 'A+',
    weight: '68kg',
    height: '165cm',
    emergencyContact: 'David Wilson (Husband) +1 (555) 234-5679',
    insurance: 'Aetna',
    primaryCare: 'Dr. Michael Brown',
    lastVisit: '2024-01-12',
    nextAppointment: '2024-01-25',
    status: 'active',
    conditions: ['Diabetes Type 2', 'Hypothyroidism'],
    allergies: ['None'],
    medications: ['Metformin 500mg', 'Levothyroxine 50mcg'],
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: '68 bpm',
      temperature: '98.4°F',
      oxygenSaturation: '99%'
    }
  },
  {
    id: 'P003',
    name: 'Michael Brown',
    age: 58,
    gender: 'Male',
    phone: '+1 (555) 345-6789',
    email: 'michael.brown@email.com',
    address: '789 Pine Rd, City, State 12345',
    bloodType: 'B+',
    weight: '82kg',
    height: '180cm',
    emergencyContact: 'Lisa Brown (Daughter) +1 (555) 345-6790',
    insurance: 'UnitedHealth',
    primaryCare: 'Dr. Emily Rodriguez',
    lastVisit: '2024-01-08',
    nextAppointment: '2024-01-18',
    status: 'active',
    conditions: ['Heart Disease', 'High Cholesterol'],
    allergies: ['Sulfa drugs'],
    medications: ['Atorvastatin 20mg', 'Aspirin 81mg'],
    vitalSigns: {
      bloodPressure: '135/85',
      heartRate: '75 bpm',
      temperature: '98.8°F',
      oxygenSaturation: '97%'
    }
  },
  {
    id: 'P004',
    name: 'Emily Davis',
    age: 28,
    gender: 'Female',
    phone: '+1 (555) 456-7890',
    email: 'emily.davis@email.com',
    address: '321 Elm St, City, State 12345',
    bloodType: 'AB+',
    weight: '62kg',
    height: '160cm',
    emergencyContact: 'Robert Davis (Father) +1 (555) 456-7891',
    insurance: 'Cigna',
    primaryCare: 'Dr. James Wilson',
    lastVisit: '2024-01-16',
    nextAppointment: '2024-01-30',
    status: 'active',
    conditions: ['Asthma', 'Seasonal Allergies'],
    allergies: ['Penicillin'],
    medications: ['Albuterol inhaler', 'Fluticasone nasal spray'],
    vitalSigns: {
      bloodPressure: '110/70',
      heartRate: '70 bpm',
      temperature: '98.2°F',
      oxygenSaturation: '99%'
    }
  },
  {
    id: 'P005',
    name: 'David Thompson',
    age: 41,
    gender: 'Male',
    phone: '+1 (555) 567-8901',
    email: 'david.thompson@email.com',
    address: '654 Maple Dr, City, State 12345',
    bloodType: 'O-',
    weight: '88kg',
    height: '178cm',
    emergencyContact: 'Jennifer Thompson (Wife) +1 (555) 567-8902',
    insurance: 'Humana',
    primaryCare: 'Dr. Lisa Chen',
    lastVisit: '2024-01-16',
    nextAppointment: '2024-01-28',
    status: 'active',
    conditions: ['Hypertension', 'Sleep Apnea'],
    allergies: ['Sulfa drugs'],
    medications: ['Amlodipine 5mg', 'CPAP therapy'],
    vitalSigns: {
      bloodPressure: '145/95',
      heartRate: '78 bpm',
      temperature: '98.6°F',
      oxygenSaturation: '96%'
    }
  }
]

const mockMedicalHistory = [
  {
    id: '1',
    date: '2024-01-10',
    type: 'Follow-up',
    diagnosis: 'Hypertension management',
    treatment: 'Adjusted Lisinopril dosage',
    notes: 'Blood pressure improved with medication adjustment. Patient reports good compliance.',
    doctor: 'Dr. Sarah Johnson'
  },
  {
    id: '2',
    date: '2023-12-15',
    type: 'Annual Physical',
    diagnosis: 'Routine checkup',
    treatment: 'No treatment needed',
    notes: 'All vitals within normal range. Continue current medications.',
    doctor: 'Dr. Sarah Johnson'
  },
  {
    id: '3',
    date: '2023-11-20',
    type: 'Consultation',
    diagnosis: 'Chest pain evaluation',
    treatment: 'EKG and blood work ordered',
    notes: 'Patient reported mild chest discomfort. Tests showed no cardiac issues.',
    doctor: 'Dr. Sarah Johnson'
  }
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ageFilter, setAgeFilter] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isPatientDetailsOpen, setIsPatientDetailsOpen] = useState(false)
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false)
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false)

  // Filter patients based on search and filters
  const filteredPatients = useMemo(() => {
    return mockPatients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.phone.includes(searchTerm)
      
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
      
      let matchesAge = true
      if (ageFilter === '18-30' && (patient.age < 18 || patient.age > 30)) matchesAge = false
      if (ageFilter === '31-50' && (patient.age < 31 || patient.age > 50)) matchesAge = false
      if (ageFilter === '51-70' && (patient.age < 51 || patient.age > 70)) matchesAge = false
      if (ageFilter === '70+' && patient.age < 70) matchesAge = false
      
      return matchesSearch && matchesStatus && matchesAge
    })
  }, [searchTerm, statusFilter, ageFilter])

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient)
    setIsPatientDetailsOpen(true)
  }

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient)
    setIsEditPatientOpen(true)
  }

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge variant="default">Active</Badge>
    }
    if (status === 'inactive') {
      return <Badge variant="secondary">Inactive</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const getConditionBadge = (condition: string) => {
    return <Badge variant="outline" className="text-xs">{condition}</Badge>
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
            <p className="text-muted-foreground">
              Manage patient records, view medical history, and track patient care
            </p>
          </div>
          <Dialog open={isNewPatientOpen} onOpenChange={setIsNewPatientOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Create a new patient record in the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Patient name" />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" placeholder="Age" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Phone number" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Email address" />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Full address" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewPatientOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewPatientOpen(false)}>
                  Add Patient
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <CardDescription>
              Search and filter patient records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, or phone..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={ageFilter} onValueChange={setAgeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Age Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="18-30">18-30</SelectItem>
                      <SelectItem value="31-50">31-50</SelectItem>
                      <SelectItem value="51-70">51-70</SelectItem>
                      <SelectItem value="70+">70+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Patients Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Next Appointment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {patient.conditions.map(condition => getConditionBadge(condition))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{patient.age} / {patient.gender}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{patient.phone}</div>
                            <div className="text-muted-foreground">{patient.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>{patient.nextAppointment}</TableCell>
                        <TableCell>{getStatusBadge(patient.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPatient(patient)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPatient(patient)}
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

      {/* Patient Details Dialog */}
      <Dialog open={isPatientDetailsOpen} onOpenChange={setIsPatientDetailsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details - {selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              Comprehensive patient information and medical history
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Patient ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Age & Gender</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.age} / {selectedPatient?.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Blood Type</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.bloodType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.email}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Address</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.address}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Emergency Contact</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.emergencyContact}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Insurance</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.insurance}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="medical" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Primary Care Physician</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.primaryCare}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Visit</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.lastVisit}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Next Appointment</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.nextAppointment}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient?.status}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Medical Conditions</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPatient?.conditions.map((condition: string) => (
                        <Badge key={condition} variant="outline">{condition}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Allergies</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPatient?.allergies.map((allergy: string) => (
                        <Badge key={allergy} variant="destructive">{allergy}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-3">
                  {mockMedicalHistory.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{record.type}</h4>
                          <p className="text-sm text-muted-foreground">{record.date} • {record.doctor}</p>
                        </div>
                        <Badge variant="outline">{record.diagnosis}</Badge>
                      </div>
                      <p className="text-sm mb-2"><strong>Treatment:</strong> {record.treatment}</p>
                      <p className="text-sm text-muted-foreground">{record.notes}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="medications" className="space-y-4">
                <div className="space-y-3">
                  {selectedPatient?.medications.map((medication: string) => (
                    <div key={medication} className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Pill className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{medication}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="vitals" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <Label className="text-sm font-medium">Blood Pressure</Label>
                    </div>
                    <p className="text-2xl font-bold">{selectedPatient?.vitalSigns?.bloodPressure}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <Label className="text-sm font-medium">Heart Rate</Label>
                    </div>
                    <p className="text-2xl font-bold">{selectedPatient?.vitalSigns?.heartRate}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <Label className="text-sm font-medium">Temperature</Label>
                    </div>
                    <p className="text-2xl font-bold">{selectedPatient?.vitalSigns?.temperature}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Stethoscope className="h-4 w-4 text-green-500" />
                      <Label className="text-sm font-medium">Oxygen Saturation</Label>
                    </div>
                    <p className="text-2xl font-bold">{selectedPatient?.vitalSigns?.oxygenSaturation}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Weight className="h-4 w-4 text-purple-500" />
                      <Label className="text-sm font-medium">Weight</Label>
                    </div>
                    <p className="text-2xl font-bold">{selectedPatient?.weight}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-indigo-500" />
                      <Label className="text-sm font-medium">Height</Label>
                    </div>
                    <p className="text-2xl font-bold">{selectedPatient?.height}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsPatientDetailsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleEditPatient(selectedPatient)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Patient
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditPatientOpen} onOpenChange={setIsEditPatientOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Patient - {selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              Update patient information and medical details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editName">Full Name</Label>
                <Input id="editName" defaultValue={selectedPatient?.name} />
              </div>
              <div>
                <Label htmlFor="editAge">Age</Label>
                <Input id="editAge" type="number" defaultValue={selectedPatient?.age} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editPhone">Phone</Label>
                <Input id="editPhone" defaultValue={selectedPatient?.phone} />
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input id="editEmail" type="email" defaultValue={selectedPatient?.email} />
              </div>
            </div>
            <div>
              <Label htmlFor="editAddress">Address</Label>
              <Textarea id="editAddress" defaultValue={selectedPatient?.address} />
            </div>
            <div>
              <Label htmlFor="editConditions">Medical Conditions</Label>
              <Textarea id="editConditions" defaultValue={selectedPatient?.conditions?.join(', ')} />
            </div>
            <div>
              <Label htmlFor="editAllergies">Allergies</Label>
              <Textarea id="editAllergies" defaultValue={selectedPatient?.allergies?.join(', ')} />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditPatientOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditPatientOpen(false)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
