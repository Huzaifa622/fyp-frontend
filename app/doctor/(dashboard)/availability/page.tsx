"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetProfileQuery,
  useGetDoctorTimeSlotsQuery,
  useAddTimeSlotsMutation,
  useDeleteTimeSlotMutation,
} from "@/services/doctor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

// Add Availability Schema
const addAvailabilitySchema = z.object({
  timeSlots: z.array(dateSlotSchema).min(1, "At least one date is required"),
});

type AddAvailabilityValues = z.infer<typeof addAvailabilitySchema>;
type DateSlot = z.infer<typeof dateSlotSchema>;
type TimeRange = z.infer<typeof timeRangeSchema>;

export default function AvailabilityPage() {
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const {
    data: timeSlots,
    isLoading: isSlotsLoading,
    refetch,
  } = useGetDoctorTimeSlotsQuery();
  const [addSlots, { isLoading: isAdding }] = useAddTimeSlotsMutation();
  const [deleteSlot, { isLoading: isDeletingSlot }] =
    useDeleteTimeSlotMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form setup
  const [dateSlots, setDateSlots] = useState<DateSlot[]>([
    { date: "", timeRanges: [{ startTime: "", endTime: "" }] },
  ]);

  const { handleSubmit, setValue, reset } = useForm<AddAvailabilityValues>({
    resolver: zodResolver(addAvailabilitySchema),
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

  const onSubmit = async (data: AddAvailabilityValues) => {
    setError(null);
    try {
      // Convert dates and times to ISO timestamps
      const formattedTimeSlots = data.timeSlots.map((slot) => ({
        date: slot.date,
        timeRanges: slot.timeRanges.map((range) => {
          // IMPORTANT: Create dates in local time then convert to ISO
          // This ensures they match the intended wall clock time
          const startDateTime = new Date(`${slot.date}T${range.startTime}:00`);
          const endDateTime = new Date(`${slot.date}T${range.endTime}:00`);

          return {
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
          };
        }),
      }));

      await addSlots({ slots: formattedTimeSlots }).unwrap();
      setIsDialogOpen(false);
      reset();
      setDateSlots([
        { date: "", timeRanges: [{ startTime: "", endTime: "" }] },
      ]);
      refetch();
      toast.success("Availability added successfully");
    } catch (err: any) {
      console.error("Failed to add time slots:", err);
      setError(
        err?.data?.message || "Failed to add availability. Please try again.",
      );
    }
  };

  const handleDeleteSlot = async (id: string | number, isBooked: boolean) => {
    if (isBooked) {
      toast.error("Cannot delete a booked slot");
      return;
    }

    if (confirm("Are you sure you want to delete this time slot?")) {
      try {
        await deleteSlot(id).unwrap();
        toast.success("Time slot deleted successfully");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete time slot");
      }
    }
  };

  // Group slots by date for display
  const groupedSlots = timeSlots?.reduce((acc: any, slot: any) => {
    const date = slot.date.split("T")[0]; // Use just the date part for grouping
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {});

  const sortedDates = groupedSlots ? Object.keys(groupedSlots).sort() : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Work Availability
          </h1>
          <p className="text-muted-foreground">
            Manage your consultation hours and time slots
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Available Slots</DialogTitle>
              <DialogDescription>
                Select dates and multiple time ranges for your availability.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

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
                          onChange={(e) =>
                            updateDate(dateIndex, e.target.value)
                          }
                          className="flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-background border-input"
                          required
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
                        Remove
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
                          size="sm"
                          onClick={() => addTimeRange(dateIndex)}
                          className="h-7 text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
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
                              required
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
                              required
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeTimeRange(dateIndex, rangeIndex)
                            }
                            disabled={dateSlot.timeRanges.length === 1}
                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDateSlot}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Date
                </Button>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Availability"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isSlotsLoading || isProfileLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sortedDates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDates.map((dateString) => (
            <Card key={dateString} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">
                      {format(new Date(dateString), "PPP")}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    Available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {groupedSlots[dateString].map((slot: any) => (
                    <div
                      key={slot.id}
                      className={`flex items-center justify-between p-3 rounded-lg border border-border transition-colors ${
                        slot.isBooked
                          ? "bg-muted/50 border-primary/20"
                          : "bg-card hover:bg-muted/10 group"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            slot.isBooked
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Clock className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {format(parseISO(slot.startTime), "hh:mm a")} -{" "}
                            {format(parseISO(slot.endTime), "hh:mm a")}
                          </span>
                          {slot.isBooked && (
                            <span className="text-[10px] text-primary font-bold">
                              BOOKED
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!slot.isBooked && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                            onClick={() =>
                              handleDeleteSlot(slot.id, slot.isBooked)
                            }
                            disabled={isDeletingSlot}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-24 text-center bg-card">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No availability set</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-sm">
            You haven't added any consultation hours yet. New patients won't be
            able to book appointments with you until you set your availability.
          </p>
          <Button className="mt-6" onClick={() => setIsDialogOpen(true)}>
            Set Your Availability
          </Button>
        </div>
      )}
    </div>
  );
}
