'use client'

import { AppLayout } from '@/components/layouts/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, Column } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '@/hooks/use-api'
import { departmentSchema, departmentUpdateSchema } from '@/lib/validation'
import { Building2, Plus, Edit, Trash2, Loader2, Search, Users, Calendar } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'

const departmentColumns: Column<any>[] = [
  {
    key: 'name',
    title: 'Department Name',
    sortable: true,
  },
  {
    key: 'description',
    title: 'Description',
    render: (value) => (
      <span className="max-w-xs truncate" title={value}>
        {value}
      </span>
    ),
  },
  {
    key: 'headOfDepartment',
    title: 'Head of Department',
    sortable: true,
  },
  {
    key: 'staffCount',
    title: 'Staff Count',
    render: (value) => (
      <Badge variant="secondary">
        <Users className="mr-1 h-3 w-3" />
        {value || 0}
      </Badge>
    ),
  },
  {
    key: 'location',
    title: 'Location',
    sortable: true,
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
    key: 'createdAt',
    title: 'Created',
    render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A',
  },
]

export default function DepartmentsManagementPage() {
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // API hooks
  const { data: departmentsData, isLoading: departmentsLoading } = useDepartments()
  const createDepartmentMutation = useCreateDepartment()
  const updateDepartmentMutation = useUpdateDepartment()
  const deleteDepartmentMutation = useDeleteDepartment()

  // Form handling
  const addDepartmentForm = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      description: '',
      headOfDepartment: '',
      location: '',
      status: 'active',
      contactEmail: '',
      contactPhone: ''
    }
  })

  const editDepartmentForm = useForm({
    resolver: zodResolver(departmentUpdateSchema),
    defaultValues: {
      name: '',
      description: '',
      headOfDepartment: '',
      location: '',
      status: 'active',
      contactEmail: '',
      contactPhone: ''
    }
  })

  const handleAddDepartment = async (data: any) => {
    try {
      await createDepartmentMutation.mutateAsync(data)
      setIsAddDepartmentOpen(false)
      addDepartmentForm.reset()
      toast({
        title: "Success",
        description: "Department created successfully",
      })
    } catch (error) {
      console.error('Failed to create department:', error)
      toast({
        title: "Error",
        description: "Failed to create department",
        variant: "destructive"
      })
    }
  }

  const handleEditDepartment = async (data: any) => {
    if (!selectedDepartment) return
    
    try {
      await updateDepartmentMutation.mutateAsync({
        id: selectedDepartment.id,
        data
      })
      setIsEditDepartmentOpen(false)
      setSelectedDepartment(null)
      editDepartmentForm.reset()
      toast({
        title: "Success",
        description: "Department updated successfully",
      })
    } catch (error) {
      console.error('Failed to update department:', error)
      toast({
        title: "Error",
        description: "Failed to update department",
        variant: "destructive"
      })
    }
  }

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return
    
    try {
      await deleteDepartmentMutation.mutateAsync(selectedDepartment.id)
      setIsDeleteConfirmOpen(false)
      setSelectedDepartment(null)
      toast({
        title: "Success",
        description: "Department deleted successfully",
      })
    } catch (error) {
      console.error('Failed to delete department:', error)
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive"
      })
    }
  }

  const openEditDialog = (department: any) => {
    setSelectedDepartment(department)
    editDepartmentForm.reset({
      name: department.name,
      description: department.description,
      headOfDepartment: department.headOfDepartment,
      location: department.location,
      status: department.status,
      contactEmail: department.contactEmail,
      contactPhone: department.contactPhone
    })
    setIsEditDepartmentOpen(true)
  }

  const openDeleteDialog = (department: any) => {
    setSelectedDepartment(department)
    setIsDeleteConfirmOpen(true)
  }

  const departmentActions = (department: any) => (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => openEditDialog(department)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => openDeleteDialog(department)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  // Filter departments data
  const filteredDepartments = departmentsData?.filter((department: any) => {
    const matchesSearch = department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || department.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Departments Management</h1>
            <p className="text-muted-foreground">
              Manage hospital departments and their configurations
            </p>
          </div>
          <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>
                  Create a new department in the hospital.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={addDepartmentForm.handleSubmit(handleAddDepartment)} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <div className="col-span-3">
                    <Input
                      {...addDepartmentForm.register('name')}
                      placeholder="Department name"
                    />
                    {addDepartmentForm.formState.errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {addDepartmentForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      {...addDepartmentForm.register('description')}
                      placeholder="Department description"
                      rows={3}
                    />
                    {addDepartmentForm.formState.errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {addDepartmentForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="headOfDepartment" className="text-right">
                    Head of Department
                  </Label>
                  <div className="col-span-3">
                    <Input
                      {...addDepartmentForm.register('headOfDepartment')}
                      placeholder="Head of department name"
                    />
                    {addDepartmentForm.formState.errors.headOfDepartment && (
                      <p className="text-sm text-red-500 mt-1">
                        {addDepartmentForm.formState.errors.headOfDepartment.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <div className="col-span-3">
                    <Input
                      {...addDepartmentForm.register('location')}
                      placeholder="Floor/Building/Room"
                    />
                    {addDepartmentForm.formState.errors.location && (
                      <p className="text-sm text-red-500 mt-1">
                        {addDepartmentForm.formState.errors.location.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactEmail" className="text-right">
                    Contact Email
                  </Label>
                  <div className="col-span-3">
                    <Input
                      {...addDepartmentForm.register('contactEmail')}
                      type="email"
                      placeholder="department@hospital.com"
                    />
                    {addDepartmentForm.formState.errors.contactEmail && (
                      <p className="text-sm text-red-500 mt-1">
                        {addDepartmentForm.formState.errors.contactEmail.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactPhone" className="text-right">
                    Contact Phone
                  </Label>
                  <div className="col-span-3">
                    <Input
                      {...addDepartmentForm.register('contactPhone')}
                      placeholder="Phone number"
                    />
                    {addDepartmentForm.formState.errors.contactPhone && (
                      <p className="text-sm text-red-500 mt-1">
                        {addDepartmentForm.formState.errors.contactPhone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDepartmentOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createDepartmentMutation.isPending}
                  >
                    {createDepartmentMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Add Department
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
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Departments Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Departments</CardTitle>
                <CardDescription>
                  {filteredDepartments.length} departments found
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredDepartments}
              columns={departmentColumns}
              actions={departmentActions}
              searchPlaceholder="Search departments..."
              loading={departmentsLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDepartmentOpen} onOpenChange={setIsEditDepartmentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editDepartmentForm.handleSubmit(handleEditDepartment)} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  {...editDepartmentForm.register('name')}
                  placeholder="Department name"
                />
                {editDepartmentForm.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {editDepartmentForm.formState.errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <div className="col-span-3">
                <Textarea
                  {...editDepartmentForm.register('description')}
                  placeholder="Department description"
                  rows={3}
                />
                {editDepartmentForm.formState.errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {editDepartmentForm.formState.errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-headOfDepartment" className="text-right">
                Head of Department
              </Label>
              <div className="col-span-3">
                <Input
                  {...editDepartmentForm.register('headOfDepartment')}
                  placeholder="Head of department name"
                />
                {editDepartmentForm.formState.errors.headOfDepartment && (
                  <p className="text-sm text-red-500 mt-1">
                    {editDepartmentForm.formState.errors.headOfDepartment.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">
                Location
              </Label>
              <div className="col-span-3">
                <Input
                  {...editDepartmentForm.register('location')}
                  placeholder="Floor/Building/Room"
                />
                {editDepartmentForm.formState.errors.location && (
                  <p className="text-sm text-red-500 mt-1">
                    {editDepartmentForm.formState.errors.location.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-contactEmail" className="text-right">
                Contact Email
              </Label>
              <div className="col-span-3">
                <Input
                  {...editDepartmentForm.register('contactEmail')}
                  type="email"
                  placeholder="department@hospital.com"
                />
                {editDepartmentForm.formState.errors.contactEmail && (
                  <p className="text-sm text-red-500 mt-1">
                    {editDepartmentForm.formState.errors.contactEmail.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-contactPhone" className="text-right">
                Contact Phone
              </Label>
              <div className="col-span-3">
                <Input
                  {...editDepartmentForm.register('contactPhone')}
                  placeholder="Phone number"
                />
                {editDepartmentForm.formState.errors.contactPhone && (
                  <p className="text-sm text-red-500 mt-1">
                    {editDepartmentForm.formState.errors.contactPhone.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDepartmentOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateDepartmentMutation.isPending}
              >
                {updateDepartmentMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Edit className="mr-2 h-4 w-4" />
                )}
                Update Department
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDepartment?.name}? This action cannot be undone.
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
              onClick={handleDeleteDepartment}
              disabled={deleteDepartmentMutation.isPending}
            >
              {deleteDepartmentMutation.isPending ? (
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
