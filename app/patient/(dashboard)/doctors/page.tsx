"use client";

import React, { useState } from "react";
import { Search, Loader2, MapPin, Award, Clock, Calendar } from "lucide-react";
import {
  useGetAllDoctorsQuery,
  useGetDoctorByIdQuery,
} from "@/services/doctor";
import { useBookAppointmentMutation } from "@/services/appointment";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";

export default function DoctorsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const { data: doctors, isLoading } = useGetAllDoctorsQuery({
    search: searchTerm || "",
  });

  const { data: selectedDoctor, isLoading: isDoctorLoading } =
    useGetDoctorByIdQuery(selectedDoctorId!, { skip: !selectedDoctorId });

  const [bookAppointment, { isLoading: isBooking }] =
    useBookAppointmentMutation();

  const handleBookAppointment = async () => {
    if (!selectedDoctorId || !selectedSlotId) return;

    try {
      await bookAppointment({
        doctorId: selectedDoctorId,
        slotId: selectedSlotId,
      }).unwrap();
      toast.success("Appointment booked successfully!");
      setIsBookingModalOpen(false);
      setSelectedSlotId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to book appointment");
    }
  };

  const groupSlotsByDate = (slots: any[]) => {
    if (!slots) return {};
    return slots.reduce((acc: any, slot: any) => {
      const date = format(new Date(slot.date), "yyyy-MM-dd");
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {});
  };

  const groupedSlots = selectedDoctor?.timeSlots
    ? groupSlotsByDate(selectedDoctor.timeSlots.filter((s: any) => !s.isBooked))
    : {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Verified Doctors
          </h1>
          <p className="text-muted-foreground">
            Browse and book appointments with verified dermatologists
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name..."
            className="pl-10"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={doctor.user.avatar} />
                  <AvatarFallback className="text-lg font-bold">
                    {doctor.user.firstName[0]}
                    {doctor.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-xl">
                    Dr. {doctor.user.firstName} {doctor.user.lastName}
                  </CardTitle>
                  <p className="text-sm text-primary font-medium">
                    Dermatologist
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4" />
                    <span>{doctor.experienceYears} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">
                      {doctor.clinicAddress || "Address not listed"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      PKR {doctor.consultationFee.toLocaleString()} Consultation
                      Fee
                    </span>
                  </div>
                </div>

                {doctor.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {doctor.bio}
                  </p>
                )}

                <div className="pt-4 flex gap-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedDoctorId(doctor.id);
                      setIsBookingModalOpen(true);
                      setSelectedSlotId(null);
                    }}
                  >
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-24 text-center">
          <p className="text-muted-foreground">
            No verified doctors found matches your criteria.
          </p>
          {searchTerm && (
            <Button
              variant="link"
              onClick={() => setSearchTerm("")}
              className="mt-2"
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Select an available time slot for your consultation.
            </DialogDescription>
          </DialogHeader>

          {isDoctorLoading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedDoctor ? (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedDoctor.user.avatar} />
                  <AvatarFallback>
                    {selectedDoctor.user.firstName[0]}
                    {selectedDoctor.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">
                    Dr. {selectedDoctor.user.firstName}{" "}
                    {selectedDoctor.user.lastName}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    PKR {selectedDoctor.consultationFee.toLocaleString()} Fee
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Available Slots
                </h5>

                {Object.keys(groupedSlots).length > 0 ? (
                  Object.keys(groupedSlots)
                    .sort()
                    .map((date) => (
                      <div key={date} className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">
                          {format(new Date(date), "EEEE, MMM dd")}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {groupedSlots[date].map((slot: any) => (
                            <Button
                              key={slot.id}
                              variant={
                                selectedSlotId === slot.id
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="text-xs"
                              onClick={() => setSelectedSlotId(slot.id)}
                            >
                              {format(new Date(slot.startTime), "hh:mm a")} -{" "}
                              {format(new Date(slot.endTime), "hh:mm a")}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="py-8 text-center border rounded-lg border-dashed">
                    <p className="text-sm text-muted-foreground">
                      No available slots found for this doctor.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBookingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBookAppointment}
              disabled={!selectedSlotId || isBooking}
            >
              {isBooking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
