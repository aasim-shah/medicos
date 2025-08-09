'use client'

import { AppLayout } from '@/components/layouts/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Pill, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Plus,
  FileText,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckSquare,
  XCircle
} from 'lucide-react'
import { useState } from 'react'
import { format, addDays, addMonths } from 'date-fns'

// Mock data for prescriptions
const mockPrescriptions = [
  {
    id: '1',
    patientName: 'John Smith',
    patientId: 'P001',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    quantity: 30,
    prescribedBy: 'Dr. Sarah Johnson',
    prescribedDate: addDays(new Date(), -5),
    status: 'Pending',
    priority: 'Normal',
    instructions: 'Take 1 tablet daily in the morning with or without food',
    sideEffects: 'Dizziness, dry cough, fatigue',
    allergies: ['None known'],
    insurance: 'Blue Cross Blue Shield',
    copay: '$10.00',
    refills: 2,
    notes: 'Patient prefers generic version. First time on this medication.',
    contactInfo: {
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Main St, Anytown, ST 12345'
    }
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    patientId: 'P002',
    medication: 'Albuterol Inhaler',
    dosage: '90mcg',
    frequency: 'As needed',
    quantity: 1,
    prescribedBy: 'Dr. Michael Brown',
    prescribedDate: addDays(new Date(), -3),
    status: 'Ready for Pickup',
    priority: 'High',
    instructions: 'Use 2 puffs every 4-6 hours as needed for shortness of breath',
    sideEffects: 'Nervousness, shakiness, increased heart rate',
    allergies: ['Dairy', 'Tree nuts'],
    insurance: 'Aetna',
    copay: '$15.00',
    refills: 1,
    notes: 'Patient has asthma. Ensure proper inhaler technique demonstration.',
    contactInfo: {
      phone: '+1 (555) 234-5678',
      email: 'sarah.johnson@email.com',
      address: '456 Oak Ave, Somewhere, ST 23456'
    }
  },
  {
    id: '3',
    patientName: 'Michael Brown',
    patientId: 'P003',
    medication: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    quantity: 30,
    prescribedBy: 'Dr. Sarah Johnson',
    prescribedDate: addDays(new Date(), -7),
    status: 'Filled',
    priority: 'Normal',
    instructions: 'Take 1 tablet daily in the evening with or without food',
    sideEffects: 'Muscle pain, digestive issues, headache',
    allergies: ['Latex'],
    insurance: 'Cigna',
    copay: '$20.00',
    refills: 0,
    notes: 'Patient works construction. Monitor for muscle pain.',
    contactInfo: {
      phone: '+1 (555) 345-6789',
      email: 'michael.brown@email.com',
      address: '789 Pine Rd, Elsewhere, ST 34567'
    }
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    patientId: 'P004',
    medication: 'Prenatal Vitamins',
    dosage: '1 tablet',
    frequency: 'Once daily',
    quantity: 90,
    prescribedBy: 'Dr. Emily Wilson',
    prescribedDate: addDays(new Date(), -10),
    status: 'Pending',
    priority: 'Normal',
    instructions: 'Take 1 tablet daily with food',
    sideEffects: 'Nausea, constipation',
    allergies: ['None known'],
    insurance: 'UnitedHealth',
    copay: '$5.00',
    refills: 3,
    notes: 'Patient is 6 months pregnant. High-risk pregnancy.',
    contactInfo: {
      phone: '+1 (555) 456-7890',
      email: 'emily.davis@email.com',
      address: '321 Elm St, Nowhere, ST 45678'
    }
  },
  {
    id: '5',
    patientName: 'Robert Wilson',
    patientId: 'P005',
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    quantity: 60,
    prescribedBy: 'Dr. James Anderson',
    prescribedDate: addMonths(new Date(), -1),
    status: 'Filled',
    priority: 'Normal',
    instructions: 'Take 1 tablet twice daily with meals',
    sideEffects: 'Nausea, diarrhea, stomach upset',
    allergies: ['Aspirin', 'Codeine'],
    insurance: 'Medicare',
    copay: '$3.00',
    refills: 1,
    notes: 'Patient has diabetes. Monitor blood sugar levels.',
    contactInfo: {
      phone: '+1 (555) 567-8901',
      email: 'robert.wilson@email.com',
      address: '654 Maple Dr, Anywhere, ST 56789'
    }
  }
]

const prescriptionStatuses = ['All', 'Pending', 'Ready for Pickup', 'Filled', 'Cancelled']
const priorities = ['All', 'High', 'Normal', 'Low']

export default function PharmacyPrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isFillDialogOpen, setIsFillDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pending': 'outline',
      'Ready for Pickup': 'default',
      'Filled': 'secondary',
      'Cancelled': 'destructive'
    } as const

    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'High': 'destructive',
      'Normal': 'default',
      'Low': 'secondary'
    } as const

    return <Badge variant={variants[priority as keyof typeof variants]}>{priority}</Badge>
  }

  const filteredPrescriptions = mockPrescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'All' || prescription.status === selectedStatus
    const matchesPriority = selectedPriority === 'All' || prescription.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const openViewDialog = (prescription: any) => {
    setSelectedPrescription(prescription)
    setIsViewDialogOpen(true)
  }

  const openFillDialog = (prescription: any) => {
    setSelectedPrescription(prescription)
    setIsFillDialogOpen(true)
  }

  const handleFillPrescription = (prescriptionId: string) => {
    // Mock fill functionality
    console.log('Filling prescription:', prescriptionId)
    setIsFillDialogOpen(false)
  }

  const handleStatusChange = (prescriptionId: string, newStatus: string) => {
    // Mock status change functionality
    console.log('Changing status for prescription:', prescriptionId, 'to:', newStatus)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
            <p className="text-muted-foreground">
              Manage and fill patient prescriptions
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prescriptions by patient, medication, or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {prescriptionStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Pill className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold">{prescription.medication}</h3>
                        {getStatusBadge(prescription.status)}
                        {getPriorityBadge(prescription.priority)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{prescription.patientName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{prescription.prescribedBy}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Prescribed: {format(prescription.prescribedDate, 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Pill className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {prescription.dosage} • {prescription.frequency}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Qty: {prescription.quantity} • Refills: {prescription.refills}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Insurance: {prescription.insurance} • Copay: {prescription.copay}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Instructions: </span>
                        <span className="text-sm text-muted-foreground">{prescription.instructions}</span>
                      </div>
                      
                      {prescription.allergies.length > 0 && prescription.allergies[0] !== 'None known' && (
                        <div>
                          <span className="text-sm font-medium">Allergies: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prescription.allergies.map((allergy, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {prescription.notes && (
                        <div className="bg-muted p-2 rounded">
                          <span className="text-sm font-medium">Notes: </span>
                          <span className="text-sm text-muted-foreground">{prescription.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewDialog(prescription)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View Details
                    </Button>
                    {prescription.status === 'Pending' && (
                      <Button
                        size="sm"
                        onClick={() => openFillDialog(prescription)}
                      >
                        <CheckSquare className="mr-2 h-3 w-3" />
                        Fill
                      </Button>
                    )}
                    {prescription.status === 'Ready for Pickup' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(prescription.id, 'Filled')}
                      >
                        <CheckCircle className="mr-2 h-3 w-3" />
                        Mark Picked Up
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No prescriptions found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria.
              </p>
            </CardContent>
          </Card>
        )}

        {/* View Prescription Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
              <DialogDescription>
                Complete prescription information and patient details
              </DialogDescription>
            </DialogHeader>
            {selectedPrescription && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Pill className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{selectedPrescription.medication}</h3>
                    <div className="flex items-center space-x-3 mt-2">
                      {getStatusBadge(selectedPrescription.status)}
                      {getPriorityBadge(selectedPrescription.priority)}
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="patient">Patient</TabsTrigger>
                    <TabsTrigger value="medical">Medical</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Medication</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.medication}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Dosage</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.dosage}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Frequency</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.frequency}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Quantity</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.quantity}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Refills Remaining</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.refills}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Prescribed By</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.prescribedBy}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Prescribed Date</span>
                        <p className="text-sm text-muted-foreground">
                          {format(selectedPrescription.prescribedDate, 'EEEE, MMMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Status</span>
                        <div className="mt-1">{getStatusBadge(selectedPrescription.status)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Instructions</span>
                      <p className="text-sm text-muted-foreground mt-1">{selectedPrescription.instructions}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Side Effects</span>
                      <p className="text-sm text-muted-foreground mt-1">{selectedPrescription.sideEffects}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="patient" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Patient Name</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.patientName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Patient ID</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.patientId}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Insurance Provider</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.insurance}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Copay</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.copay}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medical" className="space-y-4">
                    <div>
                      <span className="text-sm font-medium">Allergies</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedPrescription.allergies.length > 0 ? (
                          selectedPrescription.allergies.map((allergy: string, index: number) => (
                            <Badge key={index} variant="destructive">
                              {allergy}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No known allergies</p>
                        )}
                      </div>
                    </div>
                    
                    {selectedPrescription.notes && (
                      <div>
                        <span className="text-sm font-medium">Notes</span>
                        <p className="text-sm text-muted-foreground mt-1">{selectedPrescription.notes}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Phone</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.contactInfo.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Email</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.contactInfo.email}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-medium">Address</span>
                        <p className="text-sm text-muted-foreground">{selectedPrescription.contactInfo.address}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  {selectedPrescription.status === 'Pending' && (
                    <Button onClick={() => openFillDialog(selectedPrescription)}>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Fill Prescription
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Fill Prescription Dialog */}
        <Dialog open={isFillDialogOpen} onOpenChange={setIsFillDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Fill Prescription</DialogTitle>
              <DialogDescription>
                Confirm prescription details and mark as ready for pickup
              </DialogDescription>
            </DialogHeader>
            {selectedPrescription && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Prescription Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Patient:</strong> {selectedPrescription.patientName}</div>
                    <div><strong>Medication:</strong> {selectedPrescription.medication}</div>
                    <div><strong>Dosage:</strong> {selectedPrescription.dosage} • {selectedPrescription.frequency}</div>
                    <div><strong>Quantity:</strong> {selectedPrescription.quantity}</div>
                    <div><strong>Instructions:</strong> {selectedPrescription.instructions}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Fill Date</label>
                    <Input type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} className="mt-1" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Pharmacist Notes</label>
                    <Input placeholder="Any additional notes or instructions" className="mt-1" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="verify" className="rounded" />
                    <label htmlFor="verify" className="text-sm">
                      I have verified the prescription details and patient information
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsFillDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleFillPrescription(selectedPrescription.id)}>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Mark Ready for Pickup
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
