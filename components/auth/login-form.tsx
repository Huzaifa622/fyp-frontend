"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLoginMutation } from '@/services/auth'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  role: 'admin' | 'doctor' | 'patient'
}

export const LoginForm = ({ role }: LoginFormProps) => {
  const router = useRouter()
  const [loginUser, { isLoading }] = useLoginMutation()
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setError(null)
    try {
      const response = await loginUser({ ...data, role: role.toUpperCase() }).unwrap()
      console.log('Login Success:', response)
      
      const userRole = response.role.toLowerCase()
      if (userRole === 'admin') {
        router.push('/admin/dashboard')
      } else if (userRole === 'doctor') {
        router.push('/doctor/dashboard')
      } else {
        router.push('/patient/dashboard')
      }
    } catch (err: any) {
      console.error('Login Error:', err)
      if(err.status === 403){
        setError('Account not verified')
        router.push(`/verify-email?role=${role}&email=${data.email}`)
      }
      setError(err?.data?.message || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-xl shadow-lg border border-border">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter text-foreground capitalize">{role} Login</h1>
        <p className="text-muted-foreground">Enter your credentials to access the {role} portal</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : 'Login'}
        </Button>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link href={`/register?role=${role}`} className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
