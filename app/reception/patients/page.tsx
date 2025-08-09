'use client'

import { AppLayout } from '@/components/layouts/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Plus,
  Eye,
  Edit,
  PhoneCall,
  Mail as MailIcon,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import { format, addDays, addMonths } from 'date-fns'

// Mock data for patients
const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    address: '123 Main St, Anytown, ST 12345',
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1 (555) 123-4568'
    },
    insurance: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BCBS123456789',
      groupNumber: 'GRP001'
    },
    lastVisit: addDays(new Date(), -7),
    nextAppointment: addDays(new Date(), 14),
    status: 'Active',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin', 'Sulfa drugs'],
    notes: 'Patient prefers morning appointments. Has difficulty with stairs due to knee issues.'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1992-07-22',
    gender: 'Female',
    address: '456 Oak Ave, Somewhere, ST 23456',
    emergencyContact: {
      name: 'Mike Johnson',
      relationship: 'Father',
      phone: '+1 (555) 234-5679'
    },
    insurance: {
      provider: 'Aetna',
      policyNumber: 'AET789012345',
      groupNumber: 'GRP002'
    },
    lastVisit: addDays(new Date(), -21),
    nextAppointment: null,
    status: 'Active',
    medicalHistory: ['Asthma', 'Seasonal allergies'],
    allergies: ['Dairy', 'Tree nuts'],
    notes: 'Patient is a teacher and prefers after-school appointments. Brings rescue inhaler to all visits.'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '1978-11-08',
    gender: 'Male',
    address: '789 Pine Rd, Elsewhere, ST 34567',
    emergencyContact: {
      name: 'Lisa Brown',
      relationship: 'Sister',
      phone: '+1 (555) 345-6790'
    },
    insurance: {
      provider: 'Cigna',
      policyNumber: 'CIG456789012',
      groupNumber: 'GRP003'
    },
    lastVisit: addMonths(new Date(), -2),
    nextAppointment: addDays(new Date(), 3),
    status: 'Active',
    medicalHistory: ['Appendectomy (2023)', 'Broken arm (2021)'],
    allergies: ['Latex'],
    notes: 'Patient works construction and often has minor injuries. Prefers early morning appointments.'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 456-7890',
    dateOfBirth: '1995-04-12',
    gender: 'Female',
    address: '321 Elm St, Nowhere, ST 45678',
    emergencyContact: {
      name: 'David Davis',
      relationship: 'Husband',
      phone: '+1 (555) 456-7891'
    },
    insurance: {
      provider: 'UnitedHealth',
      policyNumber: 'UHC567890123',
      groupNumber: 'GRP004'
    },
    lastVisit: addDays(new Date(), -14),
    nextAppointment: addDays(new Date(), 28),
    status: 'Active',
    medicalHistory: ['Pregnancy (current)', 'Migraines'],
    allergies: ['None known'],
    notes: 'Patient is 6 months pregnant. High-risk pregnancy due to previous complications. Requires frequent monitoring.'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@email.com',
    phone: '+1 (555) 567-8901',
    dateOfBirth: '1965-09-30',
    gender: 'Male',
    address: '654 Maple Dr, Anywhere, ST 56789',
    emergencyContact: {
      name: 'Mary Wilson',
      relationship: 'Wife',
      phone: '+1 (555) 567-8902'
    },
    insurance: {
      provider: 'Medicare',
      policyNumber: 'MED890123456',
      groupNumber: 'GRP005'
    },
    lastVisit: addDays(new Date(), -35),
    nextAppointment: null,
    status: 'Inactive',
    medicalHistory: ['Heart disease', 'Diabetes', 'High cholesterol'],
    allergies: ['Aspirin', 'Codeine'],
    notes: 'Patient has multiple chronic conditions. Requires regular monitoring. Has difficulty with technology.'
  }
]

const patientStatuses = ['All', 'Active', 'Inactive', 'New']
const appointmentStatuses = ['All', 'Scheduled', 'Completed', 'Cancelled', 'No-show']

export default function ReceptionPatientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Inactive': 'secondary',
      'New': 'outline'
    } as const

    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm)
    const matchesStatus = selectedStatus === 'All' || patient.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const openViewDialog = (patient: any) => {
    setSelectedPatient(patient)
    setIsViewDialogOpen(true)
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
            <p className="text-muted-foreground">
              Manage patient information and appointments
            </p>
          </div>
          <Button onClick={() => setIsAddPatientDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {patientStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-lg">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold">{patient.name}</h3>
                        {getStatusBadge(patient.status)}
                        <Badge variant="outline">
                          {patient.gender} • {calculateAge(patient.dateOfBirth)} years
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{patient.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{patient.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{patient.address}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Last visit: {format(patient.lastVisit, 'MMM dd, yyyy')}
                            </span>
                          </div>
                          {patient.nextAppointment && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Next: {format(patient.nextAppointment, 'MMM dd, yyyy')}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Insurance: {patient.insurance.provider}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {patient.medicalHistory.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Medical History: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {patient.medicalHistory.map((condition, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {patient.allergies.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Allergies: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {patient.allergies.map((allergy, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewDialog(patient)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No patients found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or add a new patient.
              </p>
              <Button onClick={() => setIsAddPatientDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </CardContent>
          </Card>
        )}

        {/* View Patient Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
              <DialogDescription>
                Complete patient information and medical history
              </DialogDescription>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl">
                      {selectedPatient.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-semibold">{selectedPatient.name}</h3>
                    <div className="flex items-center space-x-3 mt-2">
                      {getStatusBadge(selectedPatient.status)}
                      <Badge variant="outline">
                        {selectedPatient.gender} • {calculateAge(selectedPatient.dateOfBirth)} years
                      </Badge>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="medical">Medical</TabsTrigger>
                    <TabsTrigger value="insurance">Insurance</TabsTrigger>
                    <TabsTrigger value="emergency">Emergency</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Full Name</span>
                        <p className="text-sm text-muted-foreground">{selectedPatient.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Date of Birth</span>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(selectedPatient.dateOfBirth), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Email</span>
                        <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Phone</span>
                        <p className="text-sm text-muted-foreground">{selectedPatient.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-medium">Address</span>
                        <p className="text-sm text-muted-foreground">{selectedPatient.address}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medical" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium">Medical History</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedPatient.medicalHistory.length > 0 ? (
                            selectedPatient.medicalHistory.map((condition: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {condition}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No medical history recorded</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Allergies</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedPatient.allergies.length > 0 ? (
                            selectedPatient.allergies.map((allergy: string, index: number) => (
                              <Badge key={index} variant="destructive">
                                {allergy}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No known allergies</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Last Visit</span>
                        <p className="text-sm text-muted-foreground">
                          {format(selectedPatient.lastVisit, 'EEEE, MMMM dd, yyyy')}
                        </p>
                      </div>
                      
                      {selectedPatient.nextAppointment && (
                        <div>
                          <span className="text-sm font-medium">Next Appointment</span>
                          <p className="text-sm text-muted-foreground">
                            {format(selectedPatient.nextAppointment, 'EEEE, MMMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                      
                      {selectedPatient.notes && (
                        <div>
                          <span className="text-sm font-medium">Notes</span>
                          <p className="text-sm text-muted-foreground mt-1">{selectedPatient.notes}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="insurance" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Insurance Provider</span>
                        <p className="text-sm text-muted-foreground">{selectedPatient.insurance.provider}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Policy Number</span>
                        <p className="text-sm text-muted-foreground">{selectedPatient.insurance.policyNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Group Number</span>
                        <p className="text-sm text-muted-foreground">{selectedPatient.insurance.groupNumber}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="emergency" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Emergency Contact Name</span>
                        <p className="text-sm text-muted-foreground">{selectedPatient.emergencyContact.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Relationship</span>
                        <p className="text-sm text-muted-foreground">{selectedPatient.emergencyContact.relationship}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Emergency Contact Phone</span>
                        <p className="text-sm text-muted-foreground">{selectedPatient.emergencyContact.phone}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Patient
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Patient Dialog */}
        <Dialog open={isAddPatientDialogOpen} onOpenChange={setIsAddPatientDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Enter patient information to create a new record
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input placeholder="First name" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input placeholder="Last name" className="mt-1" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Gender</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Email address" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input placeholder="Phone number" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input placeholder="Full address" className="mt-1" />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddPatientDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Patient
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
