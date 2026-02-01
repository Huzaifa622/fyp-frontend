"use client"

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useVerifyEmailQuery } from '@/services/auth'
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const VerifyEmailContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get('role') || 'patient'
  const email = searchParams.get('email') || 'your email'
  const token = searchParams.get('token')

  const { data, error, isLoading } = useVerifyEmailQuery(token!, {
    skip: !token,
  })

  const handleContinue = () => {
    router.push(`/onboarding/${role}`)
  }

  if (token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg text-center">
          {isLoading ? (
            <div className="space-y-4">
              <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Verifying your email</h1>
              <p className="text-muted-foreground">Please wait while we verify your account...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <XCircle className="mx-auto h-12 w-12 text-destructive" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Verification Failed</h1>
              <p className="text-muted-foreground">
                {(error as any)?.data?.message || 'Invalid or expired token. Please try again.'}
              </p>
              <Button onClick={() => router.push('/register')} className="w-full">
                Go back to Register
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Email Verified!</h1>
              <p className="text-muted-foreground">Your email has been successfully verified. You can now continue with onboarding.</p>
              <Button onClick={handleContinue} className="w-full">
                Continue to Onboarding
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Check your email</h1>
          <p className="text-muted-foreground">
            We sent a verification link to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account and continue to onboarding.
          </p>
          
          <div className="pt-4">
            <Button variant="outline" className="w-full" onClick={() => alert("Resent email!")}>
              Resend Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}

export default VerifyEmailPage
