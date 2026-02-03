"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useGetProfileQuery, useUpdateProfileMutation } from '@/services/patient'
import { Loader2, User, UploadCloud, X } from 'lucide-react'
import { toast } from 'sonner'

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
})

type ProfileValues = z.infer<typeof profileSchema>

export default function PatientProfile() {
  const { data: profile, isLoading: isLoadingProfile } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [error, setError] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      gender: undefined,
      dateOfBirth: '',
    }
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(profile?.user.avatar || null)
  }

  React.useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.user.firstName,
        lastName: profile.user.lastName,
        email: profile.user.email,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
      })
      setAvatarPreview(profile.user.avatar || null)
    }
  }, [profile, form])

  const onSubmit = async (data: ProfileValues) => {
    setError(null)
    try {
      const formData = new FormData()
      formData.append('gender', data.gender)
      formData.append('dateOfBirth', data.dateOfBirth)
      formData.append('firstName', data.firstName)
      formData.append('lastName', data.lastName)
      formData.append('email', data.email)

      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      await updateProfile(formData).unwrap()
      toast.success("Profile updated successfully!")
    } catch (err: any) {
      console.error("Profile update failed:", err)
      setError(err?.data?.message || "Failed to update profile. Please try again.")
      toast.error("Failed to update profile")
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="text-muted-foreground">Update your personal information</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-full bg-primary/10 p-3">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
            <p className="text-sm text-muted-foreground">Update your profile details</p>
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                className={form.formState.errors.firstName ? 'border-destructive' : ''}
              />
              {form.formState.errors.firstName && (
                <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                className={form.formState.errors.lastName ? 'border-destructive' : ''}
              />
              {form.formState.errors.lastName && (
                <p className="text-xs text-destructive">{form.formState.errors.lastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className={form.formState.errors.email ? 'border-destructive' : ''}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                {...form.register("gender")}
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-background ${form.formState.errors.gender ? 'border-destructive' : 'border-input'}`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {form.formState.errors.gender && (
                <p className="text-xs text-destructive">{form.formState.errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...form.register("dateOfBirth")}
                className={form.formState.errors.dateOfBirth ? 'border-destructive' : ''}
              />
              {form.formState.errors.dateOfBirth && (
                <p className="text-xs text-destructive">{form.formState.errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-16 w-16 rounded-full object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Label
                  htmlFor="avatar"
                  className="flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <UploadCloud className="h-4 w-4" />
                  {avatarFile ? avatarFile.name : 'Choose avatar image'}
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}