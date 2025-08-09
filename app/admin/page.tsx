'use client'

import { AppLayout } from '@/components/layouts/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, Column } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from '@/hooks/use-api'
import { queryKeys } from '@/lib/react-query'
import { staffSchema, staffUpdateSchema } from '@/lib/validation'
import { Users, Calendar, TestTube, Pill, Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'

// Mock data for stats - replace with real API calls
const mockStats = {
  totalPatients: 1247,
  appointmentsToday: 23,
  pendingLabs: 8,
  prescriptions: 156
}

const staffColumns: Column<any>[] = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
  },
  {
    key: 'role',
    title: 'Role',
    render: (value) => (
      <Badge variant="secondary" className="capitalize">
        {value}
      </Badge>
    ),
  },
  {
    key: 'department',
    title: 'Department',
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
  },
  {
    key: 'phone',
    title: 'Phone',
  },
  {
    key: 'status',
    title: 'Status',
    render: (value) => (
      <Badge variant={value === 'active' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    ),
  },
]

export default function AdminDashboard() {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  // API hooks
  const { data: staffData, isLoading: staffLoading } = useStaff()
  const createStaffMutation = useCreateStaff()
  const updateStaffMutation = useUpdateStaff()
  const deleteStaffMutation = useDeleteStaff()

  // Form handling
  const addStaffForm = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'reception',
      department: '',
      phone: '',
      status: 'active'
    }
  })

  const editStaffForm = useForm({
    resolver: zodResolver(staffUpdateSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'reception',
      department: '',
      phone: '',
      status: 'active'
    }
  })

  const handleAddStaff = async (data: any) => {
    try {
      await createStaffMutation.mutateAsync(data)
      setIsAddStaffOpen(false)
      addStaffForm.reset()
      toast({
        title: "Success",
        description: "Staff member added successfully",
      })
    } catch (error) {
      console.error('Failed to add staff:', error)
    }
  }

  const handleEditStaff = async (data: any) => {
    if (!selectedStaff) return
    
    try {
      await updateStaffMutation.mutateAsync({
        id: selectedStaff.id,
        data
      })
      setIsEditStaffOpen(false)
      setSelectedStaff(null)
      editStaffForm.reset()
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      })
    } catch (error) {
      console.error('Failed to update staff:', error)
    }
  }

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return
    
    try {
      await deleteStaffMutation.mutateAsync(selectedStaff.id)
      setIsDeleteConfirmOpen(false)
      setSelectedStaff(null)
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      })
    } catch (error) {
      console.error('Failed to delete staff:', error)
    }
  }

  const openEditDialog = (staff: any) => {
    setSelectedStaff(staff)
    editStaffForm.reset({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      department: staff.department,
      phone: staff.phone,
      status: staff.status
    })
    setIsEditStaffOpen(true)
  }

  const openDeleteDialog = (staff: any) => {
    setSelectedStaff(staff)
    setIsDeleteConfirmOpen(true)
  }

  const staffActions = (staff: any) => (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => openEditDialog(staff)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => openDeleteDialog(staff)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your medical facility and staff
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{mockStats.totalPatients.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Appointments Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{mockStats.appointmentsToday}</div>
              <p className="text-xs text-muted-foreground">
                6 completed, 17 upcoming
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Pending Labs</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{mockStats.pendingLabs}</div>
              <p className="text-xs text-muted-foreground">
                2 urgent, 6 routine
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Prescriptions</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{mockStats.prescriptions}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Staff Management */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">Staff Management</CardTitle>
                <CardDescription className="text-sm">
                  Manage medical staff and their roles
                </CardDescription>
              </div>
              <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Staff
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>
                      Add a new staff member to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addStaffForm.handleSubmit(handleAddStaff)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right text-sm">
                        Name
                      </Label>
                      <div className="sm:col-span-3">
                        <Input
                          {...addStaffForm.register('name')}
                          placeholder="Full name"
                          className="w-full"
                        />
                        {addStaffForm.formState.errors.name && (
                          <p className="text-sm text-red-500 mt-1">
                            {addStaffForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right text-sm">
                        Email
                      </Label>
                      <div className="sm:col-span-3">
                        <Input
                          {...addStaffForm.register('email')}
                          type="email"
                          placeholder="Email address"
                          className="w-full"
                        />
                        {addStaffForm.formState.errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {addStaffForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right text-sm">
                        Role
                      </Label>
                      <div className="sm:col-span-3">
                        <Select onValueChange={(value) => addStaffForm.setValue('role', value as 'doctor' | 'nurse' | 'reception' | 'lab' | 'pharmacy' | 'admin')}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="doctor">Doctor</SelectItem>
                            <SelectItem value="nurse">Nurse</SelectItem>
                            <SelectItem value="reception">Reception</SelectItem>
                            <SelectItem value="lab">Lab Technician</SelectItem>
                            <SelectItem value="pharmacy">Pharmacist</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        {addStaffForm.formState.errors.role && (
                          <p className="text-sm text-red-500 mt-1">
                            {addStaffForm.formState.errors.role.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right text-sm">
                        Department
                      </Label>
                      <div className="sm:col-span-3">
                        <Input
                          {...addStaffForm.register('department')}
                          placeholder="Department"
                          className="w-full"
                        />
                        {addStaffForm.formState.errors.department && (
                          <p className="text-sm text-red-500 mt-1">
                            {addStaffForm.formState.errors.department.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right text-sm">
                        Phone
                      </Label>
                      <div className="sm:col-span-3">
                        <Input
                          {...addStaffForm.register('phone')}
                          placeholder="Phone number"
                          className="w-full"
                        />
                        {addStaffForm.formState.errors.phone && (
                          <p className="text-sm text-red-500 mt-1">
                            {addStaffForm.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddStaffOpen(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createStaffMutation.isPending}
                        className="w-full sm:w-auto"
                      >
                        {createStaffMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        Add Staff
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <DataTable
                data={staffData || []}
                columns={staffColumns}
                actions={staffActions}
                searchPlaceholder="Search staff..."
                loading={staffLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditStaffOpen} onOpenChange={setIsEditStaffOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update staff member information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editStaffForm.handleSubmit(handleEditStaff)} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  {...editStaffForm.register('name')}
                  placeholder="Full name"
                />
                {editStaffForm.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {editStaffForm.formState.errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  {...editStaffForm.register('email')}
                  type="email"
                  placeholder="Email address"
                />
                {editStaffForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {editStaffForm.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => editStaffForm.setValue('role', value as 'doctor' | 'nurse' | 'reception' | 'lab' | 'pharmacy' | 'admin')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="reception">Reception</SelectItem>
                    <SelectItem value="lab">Lab Technician</SelectItem>
                    <SelectItem value="pharmacy">Pharmacist</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {editStaffForm.formState.errors.role && (
                  <p className="text-sm text-red-500 mt-1">
                    {editStaffForm.formState.errors.role.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right">
                Department
              </Label>
              <div className="col-span-3">
                <Input
                  {...editStaffForm.register('department')}
                  placeholder="Department"
                />
                {editStaffForm.formState.errors.department && (
                  <p className="text-sm text-red-500 mt-1">
                    {editStaffForm.formState.errors.department.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Phone
              </Label>
              <div className="col-span-3">
                <Input
                  {...editStaffForm.register('phone')}
                  placeholder="Phone number"
                />
                {editStaffForm.formState.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {editStaffForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditStaffOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateStaffMutation.isPending}
              >
                {updateStaffMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Edit className="mr-2 h-4 w-4" />
                )}
                Update Staff
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStaff?.name}? This action cannot be undone.
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
              onClick={handleDeleteStaff}
              disabled={deleteStaffMutation.isPending}
            >
              {deleteStaffMutation.isPending ? (
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