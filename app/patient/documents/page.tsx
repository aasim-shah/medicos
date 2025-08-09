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
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  FileImage, 
  File, 
  FileArchive,
  Trash2,
  Plus
} from 'lucide-react'
import { useState } from 'react'
import { format, addDays, addMonths } from 'date-fns'

// Mock data for documents
const mockDocuments = [
  {
    id: '1',
    name: 'Medical Report - Cardiology Consultation',
    type: 'Medical Report',
    category: 'Consultation',
    uploadedBy: 'Dr. Sarah Johnson',
    uploadDate: addDays(new Date(), -5),
    fileSize: '2.4 MB',
    fileType: 'PDF',
    status: 'Active',
    description: 'Detailed report from cardiology consultation including ECG results and treatment recommendations.',
    tags: ['cardiology', 'consultation', 'ECG']
  },
  {
    id: '2',
    name: 'Lab Results - Blood Work',
    type: 'Lab Results',
    category: 'Laboratory',
    uploadedBy: 'Dr. Michael Brown',
    uploadDate: addDays(new Date(), -12),
    fileSize: '1.8 MB',
    fileType: 'PDF',
    status: 'Active',
    description: 'Complete blood count and comprehensive metabolic panel results.',
    tags: ['lab', 'blood work', 'CBC']
  },
  {
    id: '3',
    name: 'Prescription - Lisinopril',
    type: 'Prescription',
    category: 'Medication',
    uploadedBy: 'Dr. Sarah Johnson',
    uploadDate: addDays(new Date(), -30),
    fileSize: '0.5 MB',
    fileType: 'PDF',
    status: 'Active',
    description: 'Prescription for Lisinopril 10mg daily for hypertension management.',
    tags: ['prescription', 'medication', 'hypertension']
  },
  {
    id: '4',
    name: 'Insurance Card Front',
    type: 'Insurance',
    category: 'Administrative',
    uploadedBy: 'Reception Staff',
    uploadDate: addMonths(new Date(), -2),
    fileSize: '0.8 MB',
    fileType: 'Image',
    status: 'Active',
    description: 'Front side of health insurance card for coverage verification.',
    tags: ['insurance', 'administrative', 'coverage']
  },
  {
    id: '5',
    name: 'Insurance Card Back',
    type: 'Insurance',
    category: 'Administrative',
    uploadedBy: 'Reception Staff',
    uploadDate: addMonths(new Date(), -2),
    fileSize: '0.7 MB',
    fileType: 'Image',
    status: 'Active',
    description: 'Back side of health insurance card with contact information.',
    tags: ['insurance', 'administrative', 'contact']
  },
  {
    id: '6',
    name: 'Surgery Consent Form',
    type: 'Consent Form',
    category: 'Surgery',
    uploadedBy: 'Dr. Michael Brown',
    uploadDate: addMonths(new Date(), -3),
    fileSize: '1.2 MB',
    fileType: 'PDF',
    status: 'Archived',
    description: 'Signed consent form for laparoscopic appendectomy procedure.',
    tags: ['surgery', 'consent', 'appendectomy']
  }
]

const documentCategories = [
  'All',
  'Medical Report',
  'Lab Results', 
  'Prescription',
  'Insurance',
  'Consent Form',
  'Administrative',
  'Surgery'
]

const documentTypes = [
  'All',
  'PDF',
  'Image',
  'Document',
  'Archive'
]

export default function PatientDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <File className="h-8 w-8 text-red-500" />
      case 'image':
        return <FileImage className="h-8 w-8 text-blue-500" />
      case 'archive':
        return <FileArchive className="h-8 w-8 text-orange-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Archived': 'secondary',
      'Pending': 'outline'
    } as const

    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory
    const matchesType = selectedType === 'All' || doc.fileType === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const openViewDialog = (document: any) => {
    setSelectedDocument(document)
    setIsViewDialogOpen(true)
  }

  const handleDownload = (document: any) => {
    // Mock download functionality
    const link = document.createElement('a')
    link.href = '#'
    link.download = document.name
    link.click()
  }

  const handleDelete = (documentId: string) => {
    // Mock delete functionality
    console.log('Deleting document:', documentId)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Manage and access all your medical documents and records
            </p>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  {getFileTypeIcon(document.fileType)}
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(document.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(document.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                      {document.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {document.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{document.uploadedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {format(document.uploadDate, 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{document.fileSize}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {document.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{document.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openViewDialog(document)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or upload a new document.
              </p>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        )}

        {/* View Document Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Document Details</DialogTitle>
              <DialogDescription>
                View and manage document information
              </DialogDescription>
            </DialogHeader>
            {selectedDocument && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {getFileTypeIcon(selectedDocument.fileType)}
                  <div>
                    <h3 className="font-semibold text-lg">{selectedDocument.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedDocument.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Category</span>
                    <p className="text-sm text-muted-foreground">{selectedDocument.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">File Type</span>
                    <p className="text-sm text-muted-foreground">{selectedDocument.fileType}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">File Size</span>
                    <p className="text-sm text-muted-foreground">{selectedDocument.fileSize}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Status</span>
                    <div className="mt-1">{getStatusBadge(selectedDocument.status)}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Uploaded By</span>
                    <p className="text-sm text-muted-foreground">{selectedDocument.uploadedBy}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Upload Date</span>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedDocument.uploadDate, 'EEEE, MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Tags</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDocument.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => handleDownload(selectedDocument)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Upload Document Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a new medical document or record
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Document Name</label>
                <Input placeholder="Enter document name" className="mt-1" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentCategories.slice(1).map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">File Type</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.slice(1).map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Enter document description" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input placeholder="Enter tags separated by commas" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">File</label>
                <div className="mt-1 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
