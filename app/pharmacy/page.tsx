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
import { Checkbox } from '@/components/ui/checkbox'
import { Pill, Clock, CheckCircle, AlertCircle, Plus, Package, Eye, Edit, RefreshCw, Search, Filter, Download, Upload, AlertTriangle } from 'lucide-react'
import { useState, useMemo } from 'react'

// Mock data for pharmacy dashboard
const mockStats = {
  totalPrescriptions: 234,
  pendingFills: 18,
  completedToday: 15,
  outOfStock: 3
}

const mockPrescriptions = [
  {
    id: '1',
    patientName: 'John Smith',
    medication: 'Lisinopril 10mg',
    prescribedBy: 'Dr. Sarah Johnson',
    orderDate: '2024-01-15',
    status: 'pending',
    priority: 'routine',
    quantity: 30,
    refills: 2,
    instructions: 'Take 1 tablet daily in the morning',
    allergies: 'None',
    insurance: 'Blue Cross Blue Shield',
    patientId: 'P001',
    phone: '+1 (555) 123-4567'
  },
  {
    id: '2',
    patientName: 'Sarah Wilson',
    medication: 'Metformin 500mg',
    prescribedBy: 'Dr. Michael Brown',
    orderDate: '2024-01-15',
    status: 'urgent',
    priority: 'urgent',
    quantity: 60,
    refills: 1,
    instructions: 'Take 1 tablet twice daily with meals',
    allergies: 'None',
    insurance: 'Aetna',
    patientId: 'P002',
    phone: '+1 (555) 234-5678'
  },
  {
    id: '3',
    patientName: 'Mike Chen',
    medication: 'Atorvastatin 20mg',
    prescribedBy: 'Dr. Emily Rodriguez',
    orderDate: '2024-01-14',
    status: 'completed',
    priority: 'routine',
    quantity: 30,
    refills: 0,
    instructions: 'Take 1 tablet daily in the evening',
    allergies: 'None',
    insurance: 'UnitedHealth',
    patientId: 'P003',
    phone: '+1 (555) 345-6789'
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    medication: 'Omeprazole 20mg',
    prescribedBy: 'Dr. James Wilson',
    orderDate: '2024-01-16',
    status: 'pending',
    priority: 'routine',
    quantity: 30,
    refills: 3,
    instructions: 'Take 1 capsule daily before breakfast',
    allergies: 'Penicillin',
    insurance: 'Cigna',
    patientId: 'P004',
    phone: '+1 (555) 456-7890'
  },
  {
    id: '5',
    patientName: 'David Thompson',
    medication: 'Amlodipine 5mg',
    prescribedBy: 'Dr. Lisa Chen',
    orderDate: '2024-01-16',
    status: 'urgent',
    priority: 'urgent',
    quantity: 30,
    refills: 1,
    instructions: 'Take 1 tablet daily',
    allergies: 'Sulfa drugs',
    insurance: 'Humana',
    patientId: 'P005',
    phone: '+1 (555) 567-8901'
  }
]

const mockInventory = [
  {
    id: '1',
    medication: 'Lisinopril 10mg',
    currentStock: 150,
    reorderLevel: 50,
    supplier: 'ABC Pharmaceuticals',
    lastOrderDate: '2024-01-10',
    cost: '$0.25 per tablet',
    expiryDate: '2025-06-15',
    location: 'Shelf A1'
  },
  {
    id: '2',
    medication: 'Metformin 500mg',
    currentStock: 200,
    reorderLevel: 75,
    supplier: 'XYZ Medical Supplies',
    lastOrderDate: '2024-01-12',
    cost: '$0.15 per tablet',
    expiryDate: '2025-08-20',
    location: 'Shelf B2'
  },
  {
    id: '3',
    medication: 'Atorvastatin 20mg',
    currentStock: 45,
    reorderLevel: 50,
    supplier: 'MedCorp',
    lastOrderDate: '2024-01-08',
    cost: '$0.35 per tablet',
    expiryDate: '2025-04-10',
    location: 'Shelf C3'
  },
  {
    id: '4',
    medication: 'Omeprazole 20mg',
    currentStock: 180,
    reorderLevel: 60,
    supplier: 'PharmaPlus',
    lastOrderDate: '2024-01-14',
    cost: '$0.20 per tablet',
    expiryDate: '2025-07-25',
    location: 'Shelf D4'
  }
]

export default function PharmacyDashboard() {
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false)
  const [isPrescriptionDetailsOpen, setIsPrescriptionDetailsOpen] = useState(false)
  const [isProcessPrescriptionOpen, setIsProcessPrescriptionOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>([])
  const [isBulkProcessOpen, setIsBulkProcessOpen] = useState(false)

  // Filter prescriptions based on search and filters
  const filteredPrescriptions = useMemo(() => {
    return mockPrescriptions.filter(prescription => {
      const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || prescription.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchTerm, statusFilter, priorityFilter])

  const getStatusBadge = (status: string, priority: string) => {
    if (status === 'urgent') {
      return <Badge variant="destructive">Urgent</Badge>
    }
    if (status === 'pending') {
      return <Badge variant="secondary">Pending</Badge>
    }
    if (status === 'completed') {
      return <Badge variant="default">Completed</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent') {
      return <Badge variant="destructive">High Priority</Badge>
    }
    if (priority === 'routine') {
      return <Badge variant="default">Routine</Badge>
    }
    return <Badge variant="outline">{priority}</Badge>
  }

  const handleViewPrescription = (prescription: any) => {
    setSelectedPrescription(prescription)
    setIsPrescriptionDetailsOpen(true)
  }

  const handleProcessPrescription = (prescription: any) => {
    setSelectedPrescription(prescription)
    setIsProcessPrescriptionOpen(true)
  }

  const handleBulkProcess = () => {
    if (selectedPrescriptions.length > 0) {
      setIsBulkProcessOpen(true)
    }
  }

  const handleSelectAll = () => {
    if (selectedPrescriptions.length === filteredPrescriptions.length) {
      setSelectedPrescriptions([])
    } else {
      setSelectedPrescriptions(filteredPrescriptions.map(p => p.id))
    }
  }

  const handlePrescriptionSelection = (prescriptionId: string) => {
    setSelectedPrescriptions(prev => 
      prev.includes(prescriptionId) 
        ? prev.filter(id => id !== prescriptionId)
        : [...prev, prescriptionId]
    )
  }

  const handleCompletePrescription = (prescriptionId: string) => {
    // In a real app, this would update the database
    console.log('Completing prescription:', prescriptionId)
    setIsProcessPrescriptionOpen(false)
    // Refresh prescriptions list
  }

  const handleBulkComplete = () => {
    // In a real app, this would update multiple prescriptions
    console.log('Completing prescriptions:', selectedPrescriptions)
    setSelectedPrescriptions([])
    setIsBulkProcessOpen(false)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pharmacy Dashboard</h1>
            <p className="text-muted-foreground">
              Manage prescriptions and medication dispensing
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setIsInventoryOpen(true)}>
              <Package className="mr-2 h-4 w-4" />
              Inventory
            </Button>
            <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Fill New Prescription</DialogTitle>
                  <DialogDescription>
                    Process a new prescription for a patient.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patientName" className="text-right">
                      Patient
                    </Label>
                    <Input
                      id="patientName"
                      placeholder="Patient name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="medication" className="text-right">
                      Medication
                    </Label>
                    <Input
                      id="medication"
                      placeholder="Medication name and dosage"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Number of pills"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="refills" className="text-right">
                      Refills
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Number of refills" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No refills</SelectItem>
                        <SelectItem value="1">1 refill</SelectItem>
                        <SelectItem value="2">2 refills</SelectItem>
                        <SelectItem value="3">3 refills</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="instructions" className="text-right">
                      Instructions
                    </Label>
                    <Textarea
                      id="instructions"
                      placeholder="Dosage instructions"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Special instructions"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewPrescriptionOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewPrescriptionOpen(false)}>
                    Fill Prescription
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalPrescriptions}</div>
              <p className="text-xs text-muted-foreground">
                +23 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Fills</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.pendingFills}</div>
              <p className="text-xs text-muted-foreground">
                Ready for pickup
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.completedToday}</div>
              <p className="text-xs text-muted-foreground">
                Dispensed today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.outOfStock}</div>
              <p className="text-xs text-muted-foreground">
                Need reordering
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Prescriptions</CardTitle>
            <CardDescription>
              Current prescription orders and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search prescriptions..."
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedPrescriptions.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    {selectedPrescriptions.length} prescription(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleBulkProcess}>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Process Selected
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedPrescriptions([])}>
                      Clear Selection
                    </Button>
                  </div>
                </div>
              )}

              {/* Prescriptions List */}
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-muted rounded-lg">
                  <Checkbox
                    checked={selectedPrescriptions.length === filteredPrescriptions.length && filteredPrescriptions.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="ml-3 text-sm font-medium">Select All</span>
                </div>
                
                {filteredPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedPrescriptions.includes(prescription.id)}
                        onCheckedChange={() => handlePrescriptionSelection(prescription.id)}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{prescription.patientName}</p>
                          {getPriorityBadge(prescription.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {prescription.medication} • Prescribed by {prescription.prescribedBy}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Order date: {prescription.orderDate} • Qty: {prescription.quantity} • Refills: {prescription.refills}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(prescription.status, prescription.priority)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPrescription(prescription)}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                      {prescription.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleProcessPrescription(prescription)}
                        >
                          <RefreshCw className="mr-2 h-3 w-3" />
                          Process
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prescription Details Dialog */}
      <Dialog open={isPrescriptionDetailsOpen} onOpenChange={setIsPrescriptionDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>
              Comprehensive prescription information for {selectedPrescription?.patientName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medication">Medication</TabsTrigger>
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Patient Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.patientName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Prescribed By</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.prescribedBy}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Order Date</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.orderDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.status}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="medication" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Medication</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.medication}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Quantity</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.quantity}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Refills</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.refills}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Instructions</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.instructions}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="patient" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Patient ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.patientId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Allergies</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.allergies}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Insurance</Label>
                    <p className="text-sm text-muted-foreground">{selectedPrescription?.insurance}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="billing" className="space-y-4">
                <p className="text-sm text-muted-foreground">Billing information not available</p>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsPrescriptionDetailsOpen(false)}>
              Close
            </Button>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Prescription
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Process Prescription Dialog */}
      <Dialog open={isProcessPrescriptionOpen} onOpenChange={setIsProcessPrescriptionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Process Prescription</DialogTitle>
            <DialogDescription>
              Complete the prescription for {selectedPrescription?.patientName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Patient</Label>
                <p className="text-sm text-muted-foreground">{selectedPrescription?.patientName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Medication</Label>
                <p className="text-sm text-muted-foreground">{selectedPrescription?.medication}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Quantity</Label>
                <p className="text-sm text-muted-foreground">{selectedPrescription?.quantity}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Refills</Label>
                <p className="text-sm text-muted-foreground">{selectedPrescription?.refills}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dispensingNotes">Dispensing Notes</Label>
              <Textarea
                id="dispensingNotes"
                placeholder="Any special instructions or notes for dispensing..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pharmacistNotes">Pharmacist Notes</Label>
              <Textarea
                id="pharmacistNotes"
                placeholder="Clinical notes or recommendations..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsProcessPrescriptionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleCompletePrescription(selectedPrescription?.id)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Prescription
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Process Dialog */}
      <Dialog open={isBulkProcessOpen} onOpenChange={setIsBulkProcessOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bulk Process Prescriptions</DialogTitle>
            <DialogDescription>
              Process {selectedPrescriptions.length} selected prescription(s)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="bulkNotes">General Notes</Label>
              <Textarea
                id="bulkNotes"
                placeholder="Notes that apply to all selected prescriptions..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsBulkProcessOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkComplete}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Process All
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inventory Dialog */}
      <Dialog open={isInventoryOpen} onOpenChange={setIsInventoryOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Inventory Management</DialogTitle>
            <DialogDescription>
              Current medication stock levels and reorder information
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-3 w-3" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-3 w-3" />
                  Import
                </Button>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-3 w-3" />
                Add Medication
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockInventory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{item.medication}</p>
                    <p className="text-sm text-muted-foreground">
                      Current Stock: {item.currentStock} • Reorder Level: {item.reorderLevel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supplier: {item.supplier} • Cost: {item.cost} • Location: {item.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last Order: {item.lastOrderDate} • Expiry: {item.expiryDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={item.currentStock <= item.reorderLevel ? "destructive" : "default"}>
                      {item.currentStock <= item.reorderLevel ? "Low Stock" : "In Stock"}
                    </Badge>
                    {item.currentStock <= item.reorderLevel && (
                      <Badge variant="destructive">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Reorder
                      </Badge>
                    )}
                    <Button variant="outline" size="sm">
                      <Package className="mr-2 h-3 w-3" />
                      Reorder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsInventoryOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
