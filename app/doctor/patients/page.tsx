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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
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
  Stethoscope,
  MoreHorizontal,
  ChevronRight,
  Clock,
  UserCheck,
  AlertCircle,
  TrendingUp,
  CalendarDays,
  Table2
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
    },
    avatar: '/avatars/john-smith.jpg'
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
    },
    avatar: '/avatars/sarah-wilson.jpg'
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
    },
    avatar: '/avatars/michael-brown.jpg'
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
    },
    avatar: '/avatars/emily-davis.jpg'
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
    },
    avatar: '/avatars/david-thompson.jpg'
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
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

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
      return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    }
    if (status === 'inactive') {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const getConditionBadge = (condition: string) => {
    return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">{condition}</Badge>
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getVitalStatus = (vital: string, value: string) => {
    // Simple logic for vital status - in real app, this would be more sophisticated
    if (vital === 'bloodPressure') {
      const [systolic, diastolic] = value.split('/').map(Number)
      if (systolic > 140 || diastolic > 90) return 'warning'
      if (systolic < 90 || diastolic < 60) return 'danger'
      return 'normal'
    }
    return 'normal'
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Patients Management</h1>
         
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex items-center gap-2"
              >
                <Table2 className="h-3 w-3" />
                Table
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Grid
              </Button>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Patient name" />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" placeholder="Age" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Total Patients</p>
                  <p className="text-2xl font-bold text-foreground">{mockPatients.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Patients</p>
                  <p className="text-2xl font-bold text-foreground">{mockPatients.filter(p => p.status === 'active').length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <CalendarDays className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Critical Cases</p>
                  <p className="text-2xl font-bold text-foreground">1</p>
                </div>
                <AlertCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className='w-full border-none py-3'>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={ageFilter} onValueChange={setAgeFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
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

              {/* Patients Display */}
              {viewMode === 'table' ? (
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <TableHead className="font-semibold text-foreground w-1/3">Patient Information</TableHead>
                          <TableHead className="font-semibold text-foreground">Contact</TableHead>
                          <TableHead className="font-semibold text-foreground">Appointments</TableHead>
                          <TableHead className="font-semibold text-foreground">Status</TableHead>
                          <TableHead className="font-semibold text-foreground w-24">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPatients.map((patient) => (
                          <TableRow key={patient.id} className="hover:bg-muted/50 transition-colors">
                            <TableCell className="w-1/3">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={patient.avatar} />
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {getInitials(patient.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-foreground text-base">{patient.name}</div>
                                  <div className="text-sm text-muted-foreground mb-1">ID: {patient.id}</div>
                                  <div className="text-sm text-muted-foreground mb-2">{patient.age} years • {patient.gender}</div>
                                  <div className="flex flex-wrap gap-1">
                                    {patient.conditions.slice(0, 2).map(condition => getConditionBadge(condition))}
                                    {patient.conditions.length > 2 && (
                                      <Badge variant="outline" className="text-xs">+{patient.conditions.length - 2}</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="truncate">{patient.phone}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="truncate">{patient.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="truncate text-xs">{patient.address}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs text-muted-foreground font-medium">Last Visit</div>
                                  <div className="text-sm text-foreground font-medium">{patient.lastVisit}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground font-medium">Next Appointment</div>
                                  <div className="text-sm text-primary font-medium">{patient.nextAppointment}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(patient.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewPatient(patient)}
                                  className="hover:bg-primary/10 hover:text-primary h-8 w-8 p-0"
                                  title="View Patient"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditPatient(patient)}
                                  className="hover:bg-green-500/10 hover:text-green-600 h-8 w-8 p-0"
                                  title="Edit Patient"
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPatients.map((patient) => (
                    <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewPatient(patient)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={patient.avatar} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(patient.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-foreground">{patient.name}</h3>
                              <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                              <p className="text-sm text-muted-foreground">{patient.age} • {patient.gender}</p>
                            </div>
                          </div>
                          {getStatusBadge(patient.status)}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2" />
                            {patient.email}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            Next: {patient.nextAppointment}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex flex-wrap gap-1">
                            {patient.conditions.slice(0, 2).map(condition => getConditionBadge(condition))}
                            {patient.conditions.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{patient.conditions.length - 2} more</Badge>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewPatient(patient)
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditPatient(patient)
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Details Dialog */}
      <Dialog open={isPatientDetailsOpen} onOpenChange={setIsPatientDetailsOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedPatient?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedPatient ? getInitials(selectedPatient.name) : ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">{selectedPatient?.name}</DialogTitle>
                <DialogDescription>
                  Patient ID: {selectedPatient?.id} • {selectedPatient?.age} years old • {selectedPatient?.gender}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Patient ID</Label>
                          <p className="text-sm text-foreground font-medium">{selectedPatient?.id}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Blood Type</Label>
                          <p className="text-sm text-foreground">{selectedPatient?.bloodType}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Weight</Label>
                          <p className="text-sm text-foreground">{selectedPatient?.weight}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Height</Label>
                          <p className="text-sm text-foreground">{selectedPatient?.height}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">{selectedPatient?.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">{selectedPatient?.email}</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                          <span className="text-gray-900">{selectedPatient?.address}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Emergency & Insurance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Emergency Contact</Label>
                        <p className="text-sm text-gray-900">{selectedPatient?.emergencyContact}</p>
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Insurance Provider</Label>
                        <p className="text-sm text-gray-900">{selectedPatient?.insurance}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Primary Care Physician</Label>
                        <p className="text-sm text-gray-900">{selectedPatient?.primaryCare}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="medical" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Medical Conditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient?.conditions.map((condition: string) => (
                          <Badge key={condition} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Allergies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient?.allergies.map((allergy: string) => (
                          <Badge key={allergy} variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Appointment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium">Last Visit</Label>
                          </div>
                          <p className="text-lg font-semibold">{selectedPatient?.lastVisit}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <Label className="text-sm font-medium">Next Appointment</Label>
                          </div>
                          <p className="text-lg font-semibold text-blue-700">{selectedPatient?.nextAppointment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-4">
                  {mockMedicalHistory.map((record) => (
                    <Card key={record.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{record.type}</h4>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {record.date} • {record.doctor}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-gray-50">{record.diagnosis}</Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm"><strong>Treatment:</strong> {record.treatment}</p>
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="medications" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPatient?.medications.map((medication: string) => (
                    <Card key={medication} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Pill className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{medication}</p>
                            <p className="text-sm text-gray-500">Active medication</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="vitals" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-red-100 rounded-full">
                          <Heart className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Blood Pressure</Label>
                          <p className="text-xs text-gray-500">Systolic/Diastolic</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedPatient?.vitalSigns?.bloodPressure}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Heart Rate</Label>
                          <p className="text-xs text-gray-500">Beats per minute</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedPatient?.vitalSigns?.heartRate}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-orange-100 rounded-full">
                          <Thermometer className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Temperature</Label>
                          <p className="text-xs text-gray-500">Body temperature</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedPatient?.vitalSigns?.temperature}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Stethoscope className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Oxygen Saturation</Label>
                          <p className="text-xs text-gray-500">SpO2 level</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedPatient?.vitalSigns?.oxygenSaturation}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <Weight className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Weight</Label>
                          <p className="text-xs text-gray-500">Current weight</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedPatient?.weight}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-indigo-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-indigo-100 rounded-full">
                          <Users className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Height</Label>
                          <p className="text-xs text-gray-500">Current height</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{selectedPatient?.height}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsPatientDetailsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleEditPatient(selectedPatient)} className="bg-blue-600 hover:bg-blue-700">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editName">Full Name</Label>
                <Input id="editName" defaultValue={selectedPatient?.name} />
              </div>
              <div>
                <Label htmlFor="editAge">Age</Label>
                <Input id="editAge" type="number" defaultValue={selectedPatient?.age} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <Button onClick={() => setIsEditPatientOpen(false)} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
