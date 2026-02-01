"use client"

import React, { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useRegisterMutation } from '@/services/auth'
import { Loader2 } from 'lucide-react'

// Define Zod Schema
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  role: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

const RegisterForm = () => {
  const searchParams = useSearchParams()
  const role = searchParams.get('role')! || 'admin'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: role,
    },
  })

  const router = useRouter()
  const [registerUser, { isLoading }] = useRegisterMutation({})
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null)
    try {
      const response = await registerUser(data).unwrap()
      console.log('Register Success:', response)
      // Redirect to Verify Email page
      router.push(`/verify-email?role=${data.role}&email=${data.email}`)
    } catch (err: any) {
      console.error('Register Error:', err)
      setError(err?.data?.message || 'Registration failed. Please try again.')
    }
  }


  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-xl shadow-lg border border-border">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter text-foreground">Create an Account</h1>
        <p className="text-muted-foreground">Enter your information to get started as a <span className="font-semibold text-primary">{role || 'admin'}</span></p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">First Name</label>
            <input
              id="firstName"
              {...register('firstName')}
              className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-background ${errors.firstName ? 'border-destructive focus-visible:ring-destructive' : 'border-input focus-visible:ring-ring'}`}
              placeholder="John"
            />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Last Name</label>
            <input
              id="lastName"
              {...register('lastName')}
              className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-background ${errors.lastName ? 'border-destructive focus-visible:ring-destructive' : 'border-input focus-visible:ring-ring'}`}
              placeholder="Doe"
            />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-background ${errors.email ? 'border-destructive focus-visible:ring-destructive' : 'border-input focus-visible:ring-ring'}`}
            placeholder="m@example.com"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-background ${errors.password ? 'border-destructive focus-visible:ring-destructive' : 'border-input focus-visible:ring-ring'}`}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-background ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : 'border-input focus-visible:ring-ring'}`}
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        {/* Hidden role input not strictly necessary with explicit defaultValues, but good for form submissions if using native form actions (not here) */}
        <input type="hidden" {...register('role')} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : 'Create Account'}
        </Button>
      </form>
    </div>
  )
}

const Register = (props: any) => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}

export default Register