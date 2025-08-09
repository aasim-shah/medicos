'use client'

import { AppLayout } from '@/components/layouts/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, FileText, Pill, TestTube, Clock, Eye, Download, User, MapPin, Stethoscope, AlertTriangle, CheckCircle, Search, Filter, CalendarDays } from 'lucide-react'
import { useState } from 'react'
import { format, addDays, addMonths, addYears } from 'date-fns'

// Mock data for patient history
const mockMedicalHistory = [
  {
    id: '1',
    date: addDays(new Date(), -30),
    type: 'Visit',
    doctor: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    diagnosis: 'Hypertension',
    symptoms: 'High blood pressure, occasional headaches',
    treatment: 'Prescribed Lisinopril 10mg daily, lifestyle modifications',
    notes: 'Patient advised to reduce salt intake and exercise regularly',
    status: 'Active'
  },
  {
    id: '2',
    date: addMonths(new Date(), -3),
    type: 'Surgery',
    doctor: 'Dr. Michael Brown',
    department: 'General Surgery',
    diagnosis: 'Appendicitis',
    symptoms: 'Severe abdominal pain, nausea, fever',
    treatment: 'Laparoscopic appendectomy',
    notes: 'Surgery successful, patient recovered well',
    status: 'Resolved'
  },
  {
    id: '3',
    date: addMonths(new Date(), -6),
    type: 'Visit',
    doctor: 'Dr. Emily Davis',
    department: 'Dermatology',
    diagnosis: 'Eczema',
    symptoms: 'Dry, itchy patches on arms and legs',
    treatment: 'Prescribed hydrocortisone cream and moisturizer',
    notes: 'Patient should avoid hot showers and harsh soaps',
    status: 'Resolved'
  },
  {
    id: '4',
    date: addMonths(new Date(), -9),
    type: 'Emergency',
    doctor: 'Dr. James Wilson',
    department: 'Emergency Medicine',
    diagnosis: 'Sprained ankle',
    symptoms: 'Pain and swelling in right ankle after fall',
    treatment: 'RICE protocol, pain medication, crutches',
    notes: 'Follow up with orthopedic specialist if pain persists',
    status: 'Resolved'
  }
]

const mockLabResults = [
  {
    id: '1',
    testName: 'Complete Blood Count (CBC)',
    date: addDays(new Date(), -15),
    doctor: 'Dr. Sarah Johnson',
    status: 'Normal',
    results: {
      'White Blood Cells': '7.2 K/μL',
      'Red Blood Cells': '4.8 M/μL',
      'Hemoglobin': '14.2 g/dL',
      'Platelets': '250 K/μL'
    },
    notes: 'All values within normal range',
    recommendations: 'Continue current medication regimen'
  },
  {
    id: '2',
    testName: 'Lipid Panel',
    date: addDays(new Date(), -45),
    doctor: 'Dr. Sarah Johnson',
    status: 'Elevated',
    results: {
      'Total Cholesterol': '220 mg/dL',
      'HDL Cholesterol': '45 mg/dL',
      'LDL Cholesterol': '150 mg/dL',
      'Triglycerides': '180 mg/dL'
    },
    notes: 'LDL cholesterol slightly elevated, HDL below optimal',
    recommendations: 'Increase physical activity, consider dietary changes'
  },
  {
    id: '3',
    testName: 'Thyroid Function Test',
    date: addMonths(new Date(), -2),
    doctor: 'Dr. Emily Davis',
    status: 'Normal',
    results: {
      'TSH': '2.5 mIU/L',
      'Free T4': '1.2 ng/dL',
      'Free T3': '3.1 pg/mL'
    },
    notes: 'All thyroid values within normal range',
    recommendations: 'No changes needed to current treatment'
  }
]

const mockPrescriptions = [
  {
    id: '1',
    medication: 'Lisinopril',
    dosage: '10mg daily',
    prescribedBy: 'Dr. Sarah Johnson',
    prescribedDate: addDays(new Date(), -30),
    refills: 2,
    instructions: 'Take 1 tablet daily in the morning',
    sideEffects: 'Dizziness, dry cough',
    status: 'Active',
    nextRefill: addDays(new Date(), 15)
  },
  {
    id: '2',
    medication: 'Atorvastatin',
    dosage: '20mg daily',
    prescribedBy: 'Dr. Sarah Johnson',
    prescribedDate: addDays(new Date(), -45),
    refills: 1,
    instructions: 'Take 1 tablet daily in the evening',
    sideEffects: 'Muscle pain, digestive issues',
    status: 'Active',
    nextRefill: addDays(new Date(), 30)
  },
  {
    id: '3',
    medication: 'Hydrocortisone Cream',
    dosage: '1% topical',
    prescribedBy: 'Dr. Emily Davis',
    prescribedDate: addMonths(new Date(), -6),
    refills: 0,
    instructions: 'Apply thin layer to affected areas 2-3 times daily',
    sideEffects: 'Skin thinning with long-term use',
    status: 'Resolved',
    nextRefill: null
  }
]

export default function PatientHistoryPage() {
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Resolved': 'secondary',
      'Normal': 'default',
      'Elevated': 'destructive'
    } as const

    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      'Visit': 'default',
      'Surgery': 'destructive',
      'Emergency': 'destructive'
    } as const

    return <Badge variant={variants[type as keyof typeof variants]}>{type}</Badge>
  }

  const openViewDialog = (record: any) => {
    setSelectedRecord(record)
    setIsViewDialogOpen(true)
  }

  const filteredMedicalHistory = mockMedicalHistory.filter(record => {
    const matchesSearch = record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || record.type === filterType
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const filteredLabResults = mockLabResults.filter(result => {
    const matchesSearch = result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const filteredPrescriptions = mockPrescriptions.filter(prescription => {
    const matchesSearch = prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const exportData = (type: string) => {
    let data: any[] = []
    let filename = ''
    
    switch(type) {
      case 'visits':
        data = mockMedicalHistory
        filename = 'medical-visits-history'
        break
      case 'lab':
        data = mockLabResults
        filename = 'lab-results-history'
        break
      case 'medications':
        data = mockPrescriptions
        filename = 'medication-history'
        break
      default:
        return
    }
    
    const csvContent = convertToCSV(data)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvRows = [headers.join(',')]
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header]
        if (typeof value === 'object') {
          return JSON.stringify(value)
        }
        return value
      })
      csvRows.push(values.join(','))
    }
    
    return csvRows.join('\n')
  }

  const renderRecordDetails = () => {
    if (!selectedRecord) return null

    if (selectedRecord.results) {
      // Lab Results
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">Test Name</span>
              <p className="text-sm text-muted-foreground">{selectedRecord.testName}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Date</span>
              <p className="text-sm text-muted-foreground">
                {format(selectedRecord.date, 'EEEE, MMMM dd, yyyy')}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Doctor</span>
              <p className="text-sm text-muted-foreground">{selectedRecord.doctor}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Status</span>
              <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium">Test Results</span>
            <div className="mt-2 space-y-2">
              {Object.entries(selectedRecord.results).map(([key, value]) => (
                <div key={key} className="flex justify-between p-2 bg-muted rounded">
                  <span className="text-sm font-medium">{key}</span>
                  <span className="text-sm text-muted-foreground">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
          {selectedRecord.notes && (
            <div>
              <span className="text-sm font-medium">Notes</span>
              <p className="text-sm text-muted-foreground mt-1">{selectedRecord.notes}</p>
            </div>
          )}
          {selectedRecord.recommendations && (
            <div>
              <span className="text-sm font-medium">Recommendations</span>
              <p className="text-sm text-muted-foreground mt-1">{selectedRecord.recommendations}</p>
            </div>
          )}
        </div>
      )
    } else if (selectedRecord.medication) {
      // Prescription
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">Medication</span>
              <p className="text-sm text-muted-foreground">{selectedRecord.medication}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Prescribed Date</span>
              <p className="text-sm text-muted-foreground">
                {format(selectedRecord.prescribedDate, 'EEEE, MMMM dd, yyyy')}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Prescribed By</span>
              <p className="text-sm text-muted-foreground">{selectedRecord.prescribedBy}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Status</span>
              <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">Dosage</span>
              <p className="text-sm text-muted-foreground">{selectedRecord.dosage}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Refills Remaining</span>
              <p className="text-sm text-muted-foreground">{selectedRecord.refills}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Instructions</span>
              <p className="text-sm text-muted-foreground">{selectedRecord.instructions}</p>
            </div>
            {selectedRecord.nextRefill && (
              <div>
                <span className="text-sm font-medium">Next Refill</span>
                <p className="text-sm text-muted-foreground">{format(selectedRecord.nextRefill, 'MMM dd, yyyy')}</p>
              </div>
            )}
          </div>
          {selectedRecord.sideEffects && (
            <div>
              <span className="text-sm font-medium">Side Effects</span>
              <p className="text-sm text-muted-foreground mt-1">{selectedRecord.sideEffects}</p>
            </div>
          )}
        </div>
      )
    } else {
      // Medical Visit
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">Date</span>
              <p className="text-sm text-muted-foreground">
                {format(selectedRecord.date, 'EEEE, MMMM dd, yyyy')}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Type</span>
              <div className="mt-1">{getTypeBadge(selectedRecord.type)}</div>
            </div>
            <div>
              <span className="text-sm font-medium">Doctor</span>
              <p className="text-sm text-muted-foreground">{selectedRecord.doctor}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Status</span>
              <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
            </div>
          </div>
          <div className="space-y-2">
            {selectedRecord.diagnosis && (
              <div>
                <span className="text-sm font-medium">Diagnosis</span>
                <p className="text-sm text-muted-foreground mt-1">{selectedRecord.diagnosis}</p>
              </div>
            )}
            {selectedRecord.symptoms && (
              <div>
                <span className="text-sm font-medium">Symptoms</span>
                <p className="text-sm text-muted-foreground mt-1">{selectedRecord.symptoms}</p>
              </div>
            )}
            {selectedRecord.treatment && (
              <div>
                <span className="text-sm font-medium">Treatment</span>
                <p className="text-sm text-muted-foreground mt-1">{selectedRecord.treatment}</p>
              </div>
            )}
            {selectedRecord.notes && (
              <div>
                <span className="text-sm font-medium">Notes</span>
                <p className="text-sm text-muted-foreground mt-1">{selectedRecord.notes}</p>
              </div>
            )}
          </div>
        </div>
      )
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical History</h1>
          <p className="text-muted-foreground">
            Your complete medical records, test results, and treatment history
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visits">Visit History</TabsTrigger>
            <TabsTrigger value="lab">Lab Results</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockMedicalHistory.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Last visit {format(mockMedicalHistory[0]?.date || new Date(), 'MMM dd, yyyy')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
                  <Pill className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockPrescriptions.filter(p => p.status === 'Active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {mockPrescriptions.filter(p => p.status === 'Active').length} prescriptions
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lab Tests</CardTitle>
                  <TestTube className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockLabResults.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Last test {format(mockLabResults[0]?.date || new Date(), 'MMM dd, yyyy')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {format(mockMedicalHistory[0]?.date || new Date(), 'dd')}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Days since last visit
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest medical activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMedicalHistory.slice(0, 3).map((record, index) => (
                    <div key={record.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-primary-foreground font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{record.diagnosis}</span>
                          {getTypeBadge(record.type)}
                          {getStatusBadge(record.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {record.doctor} • {record.department}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(record.date, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visits" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Medical Visit History</CardTitle>
                    <CardDescription>Complete record of all your medical visits, surgeries, and treatments</CardDescription>
                  </div>
                  <Button onClick={() => exportData('visits')} variant="outline" size="sm">
                    <Download className="mr-2 h-3 w-3" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search visits, doctors, or departments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Visit">Visits</SelectItem>
                        <SelectItem value="Surgery">Surgery</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredMedicalHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No visits found matching your criteria
                    </div>
                  ) : (
                    filteredMedicalHistory.map((record) => (
                      <div key={record.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-bold">{format(record.date, 'dd')}</div>
                              <div className="text-sm text-muted-foreground">{format(record.date, 'MMM')}</div>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                {getTypeBadge(record.type)}
                                {getStatusBadge(record.status)}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{record.doctor}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openViewDialog(record)}
                          >
                            <Eye className="mr-2 h-3 w-3" />
                            View Details
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{record.department}</span>
                          </div>
                          <div>
                            <strong>Diagnosis:</strong> {record.diagnosis}
                          </div>
                          <div>
                            <strong>Symptoms:</strong> {record.symptoms}
                          </div>
                          <div>
                            <strong>Treatment:</strong> {record.treatment}
                          </div>
                          {record.notes && (
                            <div className="bg-muted p-2 rounded">
                              <strong>Notes:</strong> {record.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Laboratory Results</CardTitle>
                    <CardDescription>Your test results and medical reports</CardDescription>
                  </div>
                  <Button onClick={() => exportData('lab')} variant="outline" size="sm">
                    <Download className="mr-2 h-3 w-3" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search test names or doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Results</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Elevated">Elevated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredLabResults.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No lab results found matching your criteria
                    </div>
                  ) : (
                    filteredLabResults.map((result) => (
                      <div key={result.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{result.testName}</h3>
                              {getStatusBadge(result.status)}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{format(result.date, 'MMM dd, yyyy')}</span>
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{result.doctor}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openViewDialog(result)}
                            >
                              <Eye className="mr-2 h-3 w-3" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Download className="mr-2 h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(result.results).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-sm font-medium">{key}:</span>
                                <span className="text-sm text-muted-foreground">{value}</span>
                              </div>
                            ))}
                          </div>
                          {result.notes && (
                            <div className="bg-muted p-2 rounded">
                              <strong>Notes:</strong> {result.notes}
                            </div>
                          )}
                          {result.recommendations && (
                            <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                              <strong>Recommendations:</strong> {result.recommendations}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Medication History</CardTitle>
                    <CardDescription>All your prescriptions, current and past</CardDescription>
                  </div>
                  <Button onClick={() => exportData('medications')} variant="outline" size="sm">
                    <Download className="mr-2 h-3 w-3" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search medications or doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredPrescriptions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No medications found matching your criteria
                    </div>
                  ) : (
                    filteredPrescriptions.map((prescription) => (
                      <div key={prescription.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{prescription.medication}</h3>
                              {getStatusBadge(prescription.status)}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Prescribed: {format(prescription.prescribedDate, 'MMM dd, yyyy')}</span>
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{prescription.prescribedBy}</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openViewDialog(prescription)}
                          >
                            <Eye className="mr-2 h-3 w-3" />
                            View Details
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <strong>Dosage:</strong> {prescription.dosage}
                            </div>
                            <div>
                              <strong>Refills:</strong> {prescription.refills}
                            </div>
                            <div>
                              <strong>Instructions:</strong> {prescription.instructions}
                            </div>
                            {prescription.nextRefill && (
                              <div>
                                <strong>Next Refill:</strong> {format(prescription.nextRefill, 'MMM dd, yyyy')}
                              </div>
                            )}
                          </div>
                          {prescription.sideEffects && (
                            <div className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                              <strong>Side Effects:</strong> {prescription.sideEffects}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Record Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Record Details</DialogTitle>
              <DialogDescription>
                Complete information about this medical record
              </DialogDescription>
            </DialogHeader>
            {selectedRecord && renderRecordDetails()}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
