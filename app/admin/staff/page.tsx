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
import { staffSchema, staffUpdateSchema } from '@/lib/validation'
import { Users, Plus, Edit, Trash2, Loader2, Search, Filter } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'

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
  {
    key: 'hireDate',
    title: 'Hire Date',
    render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A',
  },
]

export default function StaffManagementPage() {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')

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
      status: 'active',
      hireDate: ''
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
      status: 'active',
      hireDate: ''
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
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive"
      })
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
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive"
      })
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
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive"
      })
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
      status: staff.status,
      hireDate: staff.hireDate ? new Date(staff.hireDate).toISOString().split('T')[0] : ''
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

  // Filter staff data
  const filteredStaff = staffData?.filter((staff: any) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !roleFilter || staff.role === roleFilter
    const matchesDepartment = !departmentFilter || staff.department === departmentFilter
    
    return matchesSearch && matchesRole && matchesDepartment
  }) || []

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground">
              Manage medical staff and their roles
            </p>
          </div>
          <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Add a new staff member to the system.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={addStaffForm.handleSubmit(handleAddStaff)} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <div className="col-span-3">
                    <Input
                      {...addStaffForm.register('name')}
                      placeholder="Full name"
                    />
                    {addStaffForm.formState.errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {addStaffForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-3">
                    <Input
                      {...addStaffForm.register('email')}
                      type="email"
                      placeholder="Email address"
                    />
                    {addStaffForm.formState.errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {addStaffForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <div className="col-span-3">
                    <Select onValueChange={(value) => addStaffForm.setValue('role', value as 'doctor' | 'nurse' | 'reception' | 'lab' | 'pharmacy' | 'admin')}>
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
                    {addStaffForm.formState.errors.role && (
                      <p className="text-sm text-red-500 mt-1">
                        {addStaffForm.formState.errors.role.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <div className="col-span-3">
                    <Input
                      {...addStaffForm.register('department')}
                      placeholder="Department"
                    />
                    {addStaffForm.formState.errors.department && (
                      <p className="text-sm text-red-500 mt-1">
                        {addStaffForm.formState.errors.department.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <div className="col-span-3">
                    <Input
                      {...addStaffForm.register('phone')}
                      placeholder="Phone number"
                    />
                    {addStaffForm.formState.errors.phone && (
                      <p className="text-sm text-red-500 mt-1">
                        {addStaffForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hireDate" className="text-right">
                    Hire Date
                  </Label>
                  <div className="col-span-3">
                    <Input
                      {...addStaffForm.register('hireDate')}
                      type="date"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddStaffOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createStaffMutation.isPending}
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
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Roles</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="reception">Reception</SelectItem>
                    <SelectItem value="lab">Lab Technician</SelectItem>
                    <SelectItem value="pharmacy">Pharmacist</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Staff Members</CardTitle>
                <CardDescription>
                  {filteredStaff.length} staff members found
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredStaff}
              columns={staffColumns}
              actions={staffActions}
              searchPlaceholder="Search staff..."
              loading={staffLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditStaffOpen} onOpenChange={setIsEditStaffOpen}>
        <DialogContent className="sm:max-w-[500px]">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-hireDate" className="text-right">
                Hire Date
              </Label>
              <div className="col-span-3">
                <Input
                  {...editStaffForm.register('hireDate')}
                  type="date"
                />
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
