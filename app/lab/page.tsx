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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Laboratory Dashboard</h1>
            <p className="text-muted-foreground">
              Manage lab tests and orders
            </p>
          </div>
          <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Lab Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Lab Order</DialogTitle>
                <DialogDescription>
                  Add a new laboratory test order for a patient.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={newOrderForm.handleSubmit(handleCreateOrder)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient</Label>
                    <Select onValueChange={(value) => newOrderForm.setValue('patientId', value)}>
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
                    {newOrderForm.formState.errors.patientId && (
                      <p className="text-sm text-red-500 mt-1">
                        {newOrderForm.formState.errors.patientId.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctorId">Ordering Doctor</Label>
                    <Select onValueChange={(value) => newOrderForm.setValue('doctorId', value)}>
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
                    {newOrderForm.formState.errors.doctorId && (
                      <p className="text-sm text-red-500 mt-1">
                        {newOrderForm.formState.errors.doctorId.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testType">Test Type</Label>
                    <Select onValueChange={(value) => newOrderForm.setValue('testType', value)}>
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
                    {newOrderForm.formState.errors.testType && (
                      <p className="text-sm text-red-500 mt-1">
                        {newOrderForm.formState.errors.testType.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select onValueChange={(value) => newOrderForm.setValue('priority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                    {newOrderForm.formState.errors.priority && (
                      <p className="text-sm text-red-500 mt-1">
                        {newOrderForm.formState.errors.priority.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    {...newOrderForm.register('notes')}
                    placeholder="Additional notes or instructions"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsNewOrderOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createLabOrderMutation.isPending}
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

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                +12 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.pendingTests}</div>
              <p className="text-xs text-muted-foreground">
                {mockStats.urgentTests} urgent
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
                On schedule
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Tests</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.urgentTests}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Lab Orders</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Priorities</SelectItem>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lab Orders Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lab Orders</CardTitle>
                    <CardDescription>
                      {filteredLabOrders.length} orders found
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test Type</TableHead>
                      <TableHead>Ordering Doctor</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLabOrders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.patientName}</TableCell>
                        <TableCell>{order.testType}</TableCell>
                        <TableCell>{order.doctorName}</TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell>{getStatusBadge(order.status, order.priority)}</TableCell>
                        <TableCell>
                          {order.orderDate ? format(new Date(order.orderDate), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openViewDialog(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(order)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(order)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  View and manage completed test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>Test results will appear here once tests are completed</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Generate and view laboratory reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>Report generation functionality will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
                <Select onValueChange={(value) => editOrderForm.setValue('priority', value)}>
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
              <Select onValueChange={(value) => editOrderForm.setValue('status', value)}>
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
