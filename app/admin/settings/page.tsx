'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { AppLayout } from '@/components/layouts/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from '@/hooks/use-toast'
import { 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  Palette, 
  Shield, 
  Bell, 
  Database, 
  Save,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react'

const tenantSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
})

const securitySchema = z.object({
  sessionTimeout: z.number().min(15, 'Session timeout must be at least 15 minutes').max(480, 'Session timeout cannot exceed 8 hours'),
  maxLoginAttempts: z.number().min(3, 'Maximum login attempts must be at least 3').max(10, 'Maximum login attempts cannot exceed 10'),
  passwordMinLength: z.number().min(6, 'Minimum password length must be at least 6').max(20, 'Maximum password length cannot exceed 20'),
  requireTwoFactor: z.boolean(),
  enableAuditLog: z.boolean(),
})

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  appointmentReminders: z.boolean(),
  labResultAlerts: z.boolean(),
  prescriptionUpdates: z.boolean(),
  systemAlerts: z.boolean(),
})

type TenantFormData = z.infer<typeof tenantSchema>
type SecurityFormData = z.infer<typeof securitySchema>
type NotificationFormData = z.infer<typeof notificationSchema>

export default function AdminSettingsPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isSecurityLoading, setIsSecurityLoading] = useState(false)
  const [isNotificationLoading, setIsNotificationLoading] = useState(false)

  const tenantForm = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: session?.user?.tenant?.name || 'Medicos Hospital',
      email: 'info@medicos.com',
      phone: session?.user?.tenant?.phone || '+1 (555) 123-4567',
      address: session?.user?.tenant?.address || '123 Medical Center Dr, Healthcare City, HC 12345',
      website: 'https://medicos.com',
      primaryColor: session?.user?.tenant?.primaryColor || '#3b82f6',
      secondaryColor: session?.user?.tenant?.secondaryColor || '#1e40af',
    }
  })

  const securityForm = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false,
      enableAuditLog: true,
    }
  })

  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      labResultAlerts: true,
      prescriptionUpdates: true,
      systemAlerts: true,
    }
  })

  const handleTenantUpdate = async (data: TenantFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call to update tenant settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings Updated",
        description: "Organization settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecurityUpdate = async (data: SecurityFormData) => {
    setIsSecurityLoading(true)
    try {
      // Simulate API call to update security settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Security Updated",
        description: "Security settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSecurityLoading(false)
    }
  }

  const handleNotificationUpdate = async (data: NotificationFormData) => {
    setIsNotificationLoading(true)
    try {
      // Simulate API call to update notification settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Notifications Updated",
        description: "Notification settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsNotificationLoading(false)
    }
  }

  if (!session?.user || session.user.role !== 'admin') {
    return null
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Manage system configuration and organization settings
          </p>
        </div>

        <Tabs defaultValue="organization" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Organization Information
                </CardTitle>
                <CardDescription>
                  Update your organization's basic information and branding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={tenantForm.handleSubmit(handleTenantUpdate)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Organization Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter organization name"
                        {...tenantForm.register('name')}
                      />
                      {tenantForm.formState.errors.name && (
                        <p className="text-sm text-red-600">
                          {tenantForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Contact Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter contact email"
                        {...tenantForm.register('email')}
                      />
                      {tenantForm.formState.errors.email && (
                        <p className="text-sm text-red-600">
                          {tenantForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter contact phone"
                        {...tenantForm.register('phone')}
                      />
                      {tenantForm.formState.errors.phone && (
                        <p className="text-sm text-red-600">
                          {tenantForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="Enter website URL"
                        {...tenantForm.register('website')}
                      />
                      {tenantForm.formState.errors.website && (
                        <p className="text-sm text-red-600">
                          {tenantForm.formState.errors.website.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter full address"
                      rows={3}
                      {...tenantForm.register('address')}
                    />
                    {tenantForm.formState.errors.address && (
                      <p className="text-sm text-red-600">
                        {tenantForm.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Branding Colors
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            className="w-16 h-10 p-1"
                            {...tenantForm.register('primaryColor')}
                          />
                          <Input
                            placeholder="#3b82f6"
                            {...tenantForm.register('primaryColor')}
                          />
                        </div>
                        {tenantForm.formState.errors.primaryColor && (
                          <p className="text-sm text-red-600">
                            {tenantForm.formState.errors.primaryColor.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="secondaryColor"
                            type="color"
                            className="w-16 h-10 p-1"
                            {...tenantForm.register('secondaryColor')}
                          />
                          <Input
                            placeholder="#1e40af"
                            {...tenantForm.register('secondaryColor')}
                          />
                        </div>
                        {tenantForm.formState.errors.secondaryColor && (
                          <p className="text-sm text-red-600">
                            {tenantForm.formState.errors.secondaryColor.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security policies and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={securityForm.handleSubmit(handleSecurityUpdate)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        min="15"
                        max="480"
                        {...securityForm.register('sessionTimeout', { valueAsNumber: true })}
                      />
                      {securityForm.formState.errors.sessionTimeout && (
                        <p className="text-sm text-red-600">
                          {securityForm.formState.errors.sessionTimeout.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        min="3"
                        max="10"
                        {...securityForm.register('maxLoginAttempts', { valueAsNumber: true })}
                      />
                      {securityForm.formState.errors.maxLoginAttempts && (
                        <p className="text-sm text-red-600">
                          {securityForm.formState.errors.maxLoginAttempts.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        min="6"
                        max="20"
                        {...securityForm.register('passwordMinLength', { valueAsNumber: true })}
                      />
                      {securityForm.formState.errors.passwordMinLength && (
                        <p className="text-sm text-red-600">
                          {securityForm.formState.errors.passwordMinLength.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Force all users to enable 2FA for enhanced security
                        </p>
                      </div>
                      <Switch
                        checked={securityForm.watch('requireTwoFactor')}
                        onCheckedChange={(checked) => securityForm.setValue('requireTwoFactor', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Audit Logging</Label>
                        <p className="text-sm text-muted-foreground">
                          Log all system activities for compliance and security
                        </p>
                      </div>
                      <Switch
                        checked={securityForm.watch('enableAuditLog')}
                        onCheckedChange={(checked) => securityForm.setValue('enableAuditLog', checked)}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSecurityLoading}>
                    {isSecurityLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Security Settings
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when notifications are sent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={notificationForm.handleSubmit(handleNotificationUpdate)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={notificationForm.watch('emailNotifications')}
                        onCheckedChange={(checked) => notificationForm.setValue('emailNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via SMS
                        </p>
                      </div>
                      <Switch
                        checked={notificationForm.watch('smsNotifications')}
                        onCheckedChange={(checked) => notificationForm.setValue('smsNotifications', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Appointment Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Send reminders for upcoming appointments
                        </p>
                      </div>
                      <Switch
                        checked={notificationForm.watch('appointmentReminders')}
                        onCheckedChange={(checked) => notificationForm.setValue('appointmentReminders', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Lab Result Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify when lab results are available
                        </p>
                      </div>
                      <Switch
                        checked={notificationForm.watch('labResultAlerts')}
                        onCheckedChange={(checked) => notificationForm.setValue('labResultAlerts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Prescription Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify about prescription changes
                        </p>
                      </div>
                      <Switch
                        checked={notificationForm.watch('prescriptionUpdates')}
                        onCheckedChange={(checked) => notificationForm.setValue('prescriptionUpdates', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive system maintenance and security alerts
                        </p>
                      </div>
                      <Switch
                        checked={notificationForm.watch('systemAlerts')}
                        onCheckedChange={(checked) => notificationForm.setValue('systemAlerts', checked)}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isNotificationLoading}>
                    {isNotificationLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Notification Settings
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>
                  Advanced system configuration and maintenance options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable maintenance mode to restrict access
                      </p>
                    </div>
                    <Switch disabled />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable debug logging for development
                      </p>
                    </div>
                    <Switch disabled />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Backup</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically backup system data
                      </p>
                    </div>
                    <Switch disabled />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Button variant="outline" disabled>
                    Export System Logs
                  </Button>
                  <Button variant="outline" disabled>
                    Clear Cache
                  </Button>
                  <Button variant="outline" disabled>
                    System Health Check
                  </Button>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    Advanced settings are currently disabled. Contact system administrator for access.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
