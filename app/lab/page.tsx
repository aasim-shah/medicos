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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLabOrders, useCreateLabOrder, useUpdateLabOrder, useDeleteLabOrder } from '@/hooks/use-api'
import { labOrderSchema, labOrderUpdateSchema } from '@/lib/validation'
import { TestTube, Clock, CheckCircle, AlertCircle, Plus, FileText, Edit, Trash2, Search, Filter, Download, Upload, AlertTriangle, Loader2, Eye } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'

// Mock data for lab dashboard
const mockStats = {
  totalOrders: 89,
  pendingTests: 12,
  completedToday: 8,
  urgentTests: 3
}

export default function LabDashboard() {
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false)
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [activeTab, setActiveTab] = useState('orders')

  // API hooks
  const { data: labOrdersData, isLoading: labOrdersLoading } = useLabOrders()
  const createLabOrderMutation = useCreateLabOrder()
  const updateLabOrderMutation = useUpdateLabOrder()
  const deleteLabOrderMutation = useDeleteLabOrder()

  // Form handling
  const newOrderForm = useForm({
    resolver: zodResolver(labOrderSchema),
    defaultValues: {
      patientId: '',
      doctorId: '',
      testType: '',
      priority: 'routine',
      notes: '',
      status: 'pending'
    }
  })

  const editOrderForm = useForm({
    resolver: zodResolver(labOrderUpdateSchema),
    defaultValues: {
      patientId: '',
      doctorId: '',
      testType: '',
      priority: 'routine',
      notes: '',
      status: 'pending'
    }
  })

  const handleCreateOrder = async (data: any) => {
    try {
      await createLabOrderMutation.mutateAsync(data)
      setIsNewOrderOpen(false)
      newOrderForm.reset()
      toast({
        title: "Success",
        description: "Lab order created successfully",
      })
    } catch (error) {
      console.error('Failed to create lab order:', error)
      toast({
        title: "Error",
        description: "Failed to create lab order",
        variant: "destructive"
      })
    }
  }

  const handleUpdateOrder = async (data: any) => {
    if (!selectedOrder) return
    
    try {
      await updateLabOrderMutation.mutateAsync({
        id: selectedOrder.id,
        data
      })
      setIsEditOrderOpen(false)
      setSelectedOrder(null)
      editOrderForm.reset()
      toast({
        title: "Success",
        description: "Lab order updated successfully",
      })
    } catch (error) {
      console.error('Failed to update lab order:', error)
      toast({
        title: "Error",
        description: "Failed to update lab order",
        variant: "destructive"
      })
    }
  }

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return
    
    try {
      await deleteLabOrderMutation.mutateAsync(selectedOrder.id)
      setIsDeleteConfirmOpen(false)
      setSelectedOrder(null)
      toast({
        title: "Success",
        description: "Lab order deleted successfully",
      })
    } catch (error) {
      console.error('Failed to delete lab order:', error)
      toast({
        title: "Error",
        description: "Failed to delete lab order",
        variant: "destructive"
      })
    }
  }

  const openEditDialog = (order: any) => {
    setSelectedOrder(order)
    editOrderForm.reset({
      patientId: order.patientId,
      doctorId: order.doctorId,
      testType: order.testType,
      priority: order.priority,
      notes: order.notes,
      status: order.status
    })
    setIsEditOrderOpen(true)
  }

  const openViewDialog = (order: any) => {
    setSelectedOrder(order)
    setIsViewOrderOpen(true)
  }

  const openDeleteDialog = (order: any) => {
    setSelectedOrder(order)
    setIsDeleteConfirmOpen(true)
  }

  const getStatusBadge = (status: string, priority: string) => {
    if (priority === 'emergency') {
      return <Badge variant="destructive">Emergency</Badge>
    }
    if (priority === 'urgent') {
      return <Badge variant="destructive">Urgent</Badge>
    }
    if (status === 'pending') {
      return <Badge variant="secondary">Pending</Badge>
    }
    if (status === 'in-progress') {
      return <Badge variant="default">In Progress</Badge>
    }
    if (status === 'completed') {
      return <Badge variant="outline">Completed</Badge>
    }
    if (status === 'cancelled') {
      return <Badge variant="secondary">Cancelled</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants: any = {
      routine: 'secondary',
      urgent: 'destructive',
      emergency: 'destructive'
    }
    return <Badge variant={variants[priority] || 'secondary'}>{priority}</Badge>
  }

  // Filter lab orders data
  const filteredLabOrders = labOrdersData?.filter((order: any) => {
    const matchesSearch = order.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.testType?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || order.status === statusFilter
    const matchesPriority = !priorityFilter || order.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  }) || []

  // Mock data for patients and doctors (in real app, these would come from API)
  const patients = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Sarah Wilson' },
    { id: '3', name: 'Mike Chen' }
  ]

  const doctors = [
    { id: '1', name: 'Dr. Sarah Johnson' },
    { id: '2', name: 'Dr. Michael Brown' },
    { id: '3', name: 'Dr. Emily Rodriguez' }
  ]

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Laboratory Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage lab orders and test results
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Import Results
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  New Lab Order
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Lab Order</DialogTitle>
                  <DialogDescription>
                    Create a new laboratory test order.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={newOrderForm.handleSubmit(handleCreateOrder)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientId" className="text-sm">Patient</Label>
                      <Select onValueChange={(value) => newOrderForm.setValue('patientId', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient1">John Smith</SelectItem>
                          <SelectItem value="patient2">Sarah Wilson</SelectItem>
                          <SelectItem value="patient3">Mike Chen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctorId" className="text-sm">Doctor</Label>
                      <Select onValueChange={(value) => newOrderForm.setValue('doctorId', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor1">Dr. Sarah Johnson</SelectItem>
                          <SelectItem value="doctor2">Dr. Michael Brown</SelectItem>
                          <SelectItem value="doctor3">Dr. Emily Rodriguez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="testType" className="text-sm">Test Type</Label>
                      <Select onValueChange={(value) => newOrderForm.setValue('testType', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select test type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cbc">Complete Blood Count</SelectItem>
                          <SelectItem value="lipid">Lipid Panel</SelectItem>
                          <SelectItem value="glucose">Glucose Test</SelectItem>
                          <SelectItem value="urinalysis">Urinalysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-sm">Priority</Label>
                      <Select onValueChange={(value) => newOrderForm.setValue('priority', value as 'routine' | 'urgent' | 'emergency')}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm">Notes</Label>
                    <Textarea
                      {...newOrderForm.register('notes')}
                      placeholder="Additional notes or instructions"
                      rows={3}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsNewOrderOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createLabOrderMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      {createLabOrderMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      Create Order
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Orders</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{mockStats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Pending Tests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{mockStats.pendingTests}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting processing
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{mockStats.completedToday}</div>
              <p className="text-xs text-muted-foreground">
                Tests completed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Urgent Tests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{mockStats.urgentTests}</div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">Lab Orders</CardTitle>
                <CardDescription className="text-sm">
                  Manage laboratory test orders and results
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Priority</SelectItem>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labOrdersData?.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.patientName}</TableCell>
                      <TableCell>{order.testType}</TableCell>
                      <TableCell>{order.doctorName}</TableCell>
                      <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                      <TableCell>{getStatusBadge(order.status, order.priority)}</TableCell>
                      <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(order)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(order)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(order)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Order Dialog */}
      <Dialog open={isEditOrderOpen} onOpenChange={setIsEditOrderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Lab Order</DialogTitle>
            <DialogDescription>
              Update lab order details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editOrderForm.handleSubmit(handleUpdateOrder)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-patientId">Patient</Label>
                <Select onValueChange={(value) => editOrderForm.setValue('patientId', value)}>
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
                <Label htmlFor="edit-doctorId">Ordering Doctor</Label>
                <Select onValueChange={(value) => editOrderForm.setValue('doctorId', value)}>
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
                <Label htmlFor="edit-testType">Test Type</Label>
                <Select onValueChange={(value) => editOrderForm.setValue('testType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood">Blood Test</SelectItem>
                    <SelectItem value="urine">Urine Analysis</SelectItem>
                    <SelectItem value="xray">X-Ray</SelectItem>
                    <SelectItem value="mri">MRI</SelectItem>
                    <SelectItem value="ct">CT Scan</SelectItem>
                    <SelectItem value="ecg">ECG</SelectItem>
                    <SelectItem value="ultrasound">Ultrasound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select onValueChange={(value) => editOrderForm.setValue('priority', value as 'routine' | 'urgent' | 'emergency')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select onValueChange={(value) => editOrderForm.setValue('status', value as 'pending' | 'in-progress' | 'completed' | 'cancelled')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                {...editOrderForm.register('notes')}
                placeholder="Additional notes or instructions"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditOrderOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateLabOrderMutation.isPending}
              >
                {updateLabOrderMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Edit className="mr-2 h-4 w-4" />
                )}
                Update Order
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Lab Order Details</DialogTitle>
            <DialogDescription>
              View complete lab order information.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Patient</Label>
                  <p className="text-sm">{selectedOrder.patientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Test Type</Label>
                  <p className="text-sm">{selectedOrder.testType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ordering Doctor</Label>
                  <p className="text-sm">{selectedOrder.doctorName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="mt-1">{getPriorityBadge(selectedOrder.priority)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status, selectedOrder.priority)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Order Date</Label>
                  <p className="text-sm">
                    {selectedOrder.orderDate ? format(new Date(selectedOrder.orderDate), 'PPP') : 'N/A'}
                  </p>
                </div>
              </div>
              {selectedOrder.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Lab Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lab order? This action cannot be undone.
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
              onClick={handleDeleteOrder}
              disabled={deleteLabOrderMutation.isPending}
            >
              {deleteLabOrderMutation.isPending ? (
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
