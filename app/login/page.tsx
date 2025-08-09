'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Stethoscope, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

type EmailFormData = z.infer<typeof emailSchema>
type PhoneFormData = z.infer<typeof phoneSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const router = useRouter()

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '', password: '' }
  })

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '', otp: '' }
  })

  const handleEmailLogin = async (data: EmailFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOTP = async () => {
    const phone = phoneForm.getValues('phone')
    if (!phone) return

    setIsLoading(true)
    try {
      // API call to send OTP
      setOtpSent(true)
    } catch (err) {
      setError('Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneLogin = async (data: PhoneFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        phone: data.phone,
        otp: data.otp,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid OTP')
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding Section */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MedicoFlow</h1>
          <p className="text-gray-600">
            Your comprehensive medical management system
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-600 mt-1">
                Sign in to access your medical portal
              </p>
            </div>
          </CardHeader>

        <CardContent className="pt-0">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
              <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-5">
              <form onSubmit={emailForm.handleSubmit(handleEmailLogin)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...emailForm.register('email')}
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-red-600">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...emailForm.register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </Button>
                  </div>
                  {emailForm.formState.errors.password && (
                    <p className="text-sm text-red-600">
                      {emailForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone" className="space-y-5">
              <form onSubmit={phoneForm.handleSubmit(handlePhoneLogin)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...phoneForm.register('phone')}
                    />
                  </div>
                  {phoneForm.formState.errors.phone && (
                    <p className="text-sm text-red-600">
                      {phoneForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                {!otpSent ? (
                  <Button 
                    type="button" 
                    onClick={handleSendOTP} 
                    className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-sm font-medium text-gray-700">Enter OTP</Label>
                      <Input
                        id="otp"
                        placeholder="Enter 6-digit OTP"
                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-center tracking-wider"
                        {...phoneForm.register('otp')}
                      />
                      {phoneForm.formState.errors.otp && (
                        <p className="text-sm text-red-600">
                          {phoneForm.formState.errors.otp.message}
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        'Verify OTP'
                      )}
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 text-center pt-6">
          <Link 
            href="/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
          >
            Forgot your password?
          </Link>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Need access? Contact your system administrator
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Secure medical portal powered by MedicoFlow
            </p>
          </div>
        </CardFooter>
        </Card>
      </div>
    </div>
  )
}