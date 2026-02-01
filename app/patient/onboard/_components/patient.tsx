"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UploadCloud, Loader2, X } from 'lucide-react'
import { useCreateProfileMutation, useGenerateAIReportMutation } from '@/services/patient'

// Step 1 Schema: Personal Details
const personalDetailsSchema = z.object({
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  bloodGroup: z.string().min(1, "Blood group is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
})

// Step 2 Schema: Medical Details
const medicalDetailsSchema = z.object({
  description: z.string().min(10, "Please provide a detailed description (min 10 chars)"),
})

type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>
type MedicalDetailsValues = z.infer<typeof medicalDetailsSchema>

export default function PatientOnboarding() {
  const router = useRouter()
  const [createProfile, { isLoading: isCreatingProfile }] = useCreateProfileMutation()
  const [generateReport, { isLoading: isGeneratingReport }] = useGenerateAIReportMutation()
  
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [images, setImages] = useState<File[]>([])
  
  // Forms
  const personalForm = useForm<PersonalDetailsValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      dob: '',
      gender: undefined,
      bloodGroup: '',
      phone: '',
      address: '',
    }
  })

  const medicalForm = useForm<MedicalDetailsValues>({
    resolver: zodResolver(medicalDetailsSchema),
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImages(prev => [...prev, ...newFiles])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const onPersonalSubmit = async (data: PersonalDetailsValues) => {
    setError(null)
    try {
      const payload = {
        gender: data.gender,
        dateOfBirth: data.dob,
        phone: data.phone,
        address: data.address,
        bloodGroup: data.bloodGroup,
      }
      await createProfile(payload).unwrap()
      setStep(2)
    } catch (err: any) {
      console.error("Profile creation failed:", err)
      setError(err?.data?.message || "Failed to create profile. Please try again.")
    }
  }

  const onMedicalSubmit = async (data: MedicalDetailsValues) => {
    if (images.length === 0) {
      setError("Please upload at least one image of the affected area.")
      return
    }

    setError(null)
    try {
      await generateReport({
        description: data.description,
        images: images
      }).unwrap()
      router.push('/patient/dashboard')
    } catch (err: any) {
      console.error("Report generation failed:", err)
      setError(err?.data?.message || "Failed to generate AI report. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Patient Onboarding</h1>
          <p className="text-muted-foreground">Step {step} of 2: {step === 1 ? "Personal Details" : "Medical Details"}</p>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out" 
            style={{ width: step === 1 ? '50%' : '100%' }} 
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Date of Birth</label>
                <input 
                  type="date"
                  {...personalForm.register("dob")}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-background ${personalForm.formState.errors.dob ? 'border-destructive' : 'border-input'}`}
                />
                {personalForm.formState.errors.dob && <p className="text-xs text-destructive">{personalForm.formState.errors.dob.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Gender</label>
                <select 
                  {...personalForm.register("gender")}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-background ${personalForm.formState.errors.gender ? 'border-destructive' : 'border-input'}`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {personalForm.formState.errors.gender && <p className="text-xs text-destructive">{personalForm.formState.errors.gender.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Blood Group</label>
                <select 
                  {...personalForm.register("bloodGroup")}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-background ${personalForm.formState.errors.bloodGroup ? 'border-destructive' : 'border-input'}`}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                {personalForm.formState.errors.bloodGroup && <p className="text-xs text-destructive">{personalForm.formState.errors.bloodGroup.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Phone Number</label>
                <input 
                  type="tel"
                  {...personalForm.register("phone")}
                  placeholder="+92 3XX XXXXXXX"
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-background ${personalForm.formState.errors.phone ? 'border-destructive' : 'border-input'}`}
                />
                {personalForm.formState.errors.phone && <p className="text-xs text-destructive">{personalForm.formState.errors.phone.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium leading-none">Address</label>
                <textarea 
                  {...personalForm.register("address")}
                  className={`flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm bg-background ${personalForm.formState.errors.address ? 'border-destructive' : 'border-input'}`}
                  placeholder="123 Main St, City, Country"
                />
                {personalForm.formState.errors.address && <p className="text-xs text-destructive">{personalForm.formState.errors.address.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isCreatingProfile}>
              {isCreatingProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : "Next Step"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={medicalForm.handleSubmit(onMedicalSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Description of Issue</label>
              <textarea 
                {...medicalForm.register("description")}
                className={`flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm bg-background ${medicalForm.formState.errors.description ? 'border-destructive' : 'border-input'}`}
                placeholder="Please describe your symptoms, how long you've had them, etc."
              />
              {medicalForm.formState.errors.description && <p className="text-xs text-destructive">{medicalForm.formState.errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Affected Area Images <span className="text-destructive">*</span></label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {images.map((file, index) => (
                  <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`upload-${index}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 border-input transition-colors">
                  <div className="flex flex-col items-center justify-center p-2 text-center">
                    <UploadCloud className="w-6 h-6 mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Add Image</p>
                  </div>
                  <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">Back</Button>
              <Button type="submit" className="w-2/3" disabled={isGeneratingReport}>
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : "Complete Onboarding"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
