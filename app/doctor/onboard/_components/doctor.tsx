"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UploadCloud, Plus, Trash2, Loader2 } from "lucide-react";
import { useOnboardMutation } from "@/services/doctor";

// TimeRange Schema
const timeRangeSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

// DateSlot Schema
const dateSlotSchema = z.object({
  date: z.string().min(1, "Date is required"),
  timeRanges: z
    .array(timeRangeSchema)
    .min(1, "At least one time range is required"),
});

// Doctor Onboarding Schema
const doctorOnboardingSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  experienceYears: z.coerce
    .number()
    .min(0, "Experience must be a positive number"),
  consultationFee: z.coerce.number().min(0, "Fee must be a positive number"),
  bio: z.string().min(20, "Bio must be at least 20 characters").optional(),
  clinicAddress: z
    .string()
    .min(10, "Clinic address must be at least 10 characters")
    .optional(),
  timeSlots: z.array(dateSlotSchema).min(1, "At least one date is required"),
});

type DoctorOnboardingValues = z.infer<typeof doctorOnboardingSchema>;
type DateSlot = z.infer<typeof dateSlotSchema>;
type TimeRange = z.infer<typeof timeRangeSchema>;

export default function DoctorOnboarding() {
  const router = useRouter();
  const [onboard, { isLoading }] = useOnboardMutation();
  const [error, setError] = useState<string | null>(null);
  const [degreeFile, setDegreeFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);

  const [dateSlots, setDateSlots] = useState<DateSlot[]>([
    { date: "", timeRanges: [{ startTime: "", endTime: "" }] },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DoctorOnboardingValues>({
    resolver: zodResolver(doctorOnboardingSchema),
    defaultValues: {
      timeSlots: [{ date: "", timeRanges: [{ startTime: "", endTime: "" }] }],
    },
  });

  const addDateSlot = () => {
    const newSlots = [
      ...dateSlots,
      { date: "", timeRanges: [{ startTime: "", endTime: "" }] },
    ];
    setDateSlots(newSlots);
    setValue("timeSlots", newSlots);
  };

  const removeDateSlot = (index: number) => {
    if (dateSlots.length > 1) {
      const newSlots = dateSlots.filter((_, i) => i !== index);
      setDateSlots(newSlots);
      setValue("timeSlots", newSlots);
    }
  };

  const updateDate = (index: number, date: string) => {
    const newSlots = [...dateSlots];
    newSlots[index].date = date;
    setDateSlots(newSlots);
    setValue("timeSlots", newSlots);
  };

  const addTimeRange = (dateIndex: number) => {
    const newSlots = [...dateSlots];
    newSlots[dateIndex].timeRanges.push({ startTime: "", endTime: "" });
    setDateSlots(newSlots);
    setValue("timeSlots", newSlots);
  };

  const removeTimeRange = (dateIndex: number, rangeIndex: number) => {
    if (dateSlots[dateIndex].timeRanges.length > 1) {
      const newSlots = [...dateSlots];
      newSlots[dateIndex].timeRanges = newSlots[dateIndex].timeRanges.filter(
        (_, i) => i !== rangeIndex,
      );
      setDateSlots(newSlots);
      setValue("timeSlots", newSlots);
    }
  };

  const updateTimeRange = (
    dateIndex: number,
    rangeIndex: number,
    field: keyof TimeRange,
    value: string,
  ) => {
    const newSlots = [...dateSlots];
    newSlots[dateIndex].timeRanges[rangeIndex][field] = value;
    setDateSlots(newSlots);
    setValue("timeSlots", newSlots);
  };

  const onSubmit = async (data: DoctorOnboardingValues) => {
    if (!degreeFile) {
      setError("Please upload your degree or diploma.");
      return;
    }

    setError(null);
    try {
      // Convert dates and times to ISO timestamps
      const formattedTimeSlots = data.timeSlots.map((slot) => ({
        date: slot.date,
        timeRanges: slot.timeRanges.map((range) => {
          // Combine date and time string into a Date object, then to ISO string
          // range.startTime is "HH:mm", slot.date is "YYYY-MM-DD"
          const startDateTime = new Date(`${slot.date}T${range.startTime}:00Z`);
          const endDateTime = new Date(`${slot.date}T${range.endTime}:00Z`);

          return {
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
          };
        }),
      }));

      const payload: any = {
        ...data,
        timeSlots: formattedTimeSlots,
        degree: degreeFile,
      };
      if (certFile) payload.certificate = certFile;

      await onboard(payload).unwrap();
      router.push("/doctor/dashboard");
    } catch (err: any) {
      console.error("Onboarding failed:", err);
      setError(
        err?.data?.message ||
          "Failed to submit onboarding application. Please try again.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Doctor Onboarding
          </h1>
          <p className="text-muted-foreground">
            Please provide your professional details and verification documents.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                License Number <span className="text-destructive">*</span>
              </label>
              <input
                {...register("licenseNumber")}
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.licenseNumber ? "border-destructive focus:ring-destructive" : "border-input"}`}
                placeholder="DOC-12345"
              />
              {errors.licenseNumber && (
                <p className="text-xs text-destructive">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Experience (Years) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                {...register("experienceYears")}
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.experienceYears ? "border-destructive" : "border-input"}`}
                placeholder="5"
              />
              {errors.experienceYears && (
                <p className="text-xs text-destructive">
                  {errors.experienceYears.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Consultation Fee <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                {...register("consultationFee")}
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.consultationFee ? "border-destructive" : "border-input"}`}
                placeholder="1500"
              />
              {errors.consultationFee && (
                <p className="text-xs text-destructive">
                  {errors.consultationFee.message}
                </p>
              )}
            </div>

            <div className="hidden md:block"></div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium leading-none">
                Professional Bio
              </label>
              <textarea
                {...register("bio")}
                className={`flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.bio ? "border-destructive" : "border-input"}`}
                placeholder="Experienced cardiologist specializing in heart diseases..."
              />
              {errors.bio && (
                <p className="text-xs text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium leading-none">
                Clinic Address
              </label>
              <textarea
                {...register("clinicAddress")}
                className={`flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.clinicAddress ? "border-destructive" : "border-input"}`}
                placeholder="123 Medical Plaza, Karachi"
              />
              {errors.clinicAddress && (
                <p className="text-xs text-destructive">
                  {errors.clinicAddress.message}
                </p>
              )}
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none">
                Available Time Slots <span className="text-destructive">*</span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDateSlot}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Date
              </Button>
            </div>

            <div className="space-y-6">
              {dateSlots.map((dateSlot, dateIndex) => (
                <div
                  key={dateIndex}
                  className="space-y-4 p-4 border border-border rounded-lg bg-muted/20"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 max-w-[200px]">
                      <label className="text-xs font-medium mb-1.5 block">
                        Date
                      </label>
                      <input
                        type="date"
                        value={dateSlot.date}
                        onChange={(e) => updateDate(dateIndex, e.target.value)}
                        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-background border-input"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDateSlot(dateIndex)}
                      disabled={dateSlots.length === 1}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Date
                    </Button>
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Time Ranges
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => addTimeRange(dateIndex)}
                        className="h-7 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Range
                      </Button>
                    </div>

                    {dateSlot.timeRanges.map((range, rangeIndex) => (
                      <div key={rangeIndex} className="flex items-end gap-3">
                        <div className="flex-1 space-y-1.5">
                          <label className="text-[10px] font-medium text-muted-foreground">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={range.startTime}
                            onChange={(e) =>
                              updateTimeRange(
                                dateIndex,
                                rangeIndex,
                                "startTime",
                                e.target.value,
                              )
                            }
                            className="flex h-9 w-full rounded-md border px-3 py-2 text-sm bg-background border-input"
                          />
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <label className="text-[10px] font-medium text-muted-foreground">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={range.endTime}
                            onChange={(e) =>
                              updateTimeRange(
                                dateIndex,
                                rangeIndex,
                                "endTime",
                                e.target.value,
                              )
                            }
                            className="flex h-9 w-full rounded-md border px-3 py-2 text-sm bg-background border-input"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeTimeRange(dateIndex, rangeIndex)}
                          disabled={dateSlot.timeRanges.length === 1}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {errors.timeSlots && (
              <p className="text-xs text-destructive">
                {errors.timeSlots.message}
              </p>
            )}
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Degree / Diploma <span className="text-destructive">*</span>
              </label>
              <label
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 ${degreeFile ? "border-primary bg-primary/5" : "border-input"}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {degreeFile ? (
                    <p className="text-sm font-medium text-primary">
                      {degreeFile.name}
                    </p>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Upload Degree</span>
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => setDegreeFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Certificate (Optional)
              </label>
              <label
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 ${certFile ? "border-primary bg-primary/5" : "border-input"}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {certFile ? (
                    <p className="text-sm font-medium text-primary">
                      {certFile.name}
                    </p>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">
                          Upload Certificate
                        </span>
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Application...
              </>
            ) : (
              "Submit for Review"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
