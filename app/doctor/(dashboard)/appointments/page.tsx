"use client";

import React from "react";
import {
  useGetDoctorAppointmentsQuery,
  useCancelAppointmentMutation,
  useCompleteAppointmentMutation,
} from "@/services/appointment";
import {
  Calendar,
  Clock,
  User,
  MoreVertical,
  XCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export default function DoctorAppointments() {
  const {
    data: appointments,
    isLoading,
    refetch,
  } = useGetDoctorAppointmentsQuery();
  const [cancelAppointment, { isLoading: isCancelling }] =
    useCancelAppointmentMutation();
  const [completeAppointment, { isLoading: isCompleting }] =
    useCompleteAppointmentMutation();

  const handleComplete = async (id: number) => {
    try {
      await completeAppointment(id).unwrap();
      toast.success("Appointment marked as completed");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to complete appointment");
    }
  };

  const handleCancel = async (id: number) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id).unwrap();
        toast.success("Appointment cancelled successfully");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to cancel appointment");
      }
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case AppointmentStatus.PENDING:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">
            <Clock3 className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case AppointmentStatus.CANCELLED:
        return (
          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      case AppointmentStatus.COMPLETED:
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Patient Appointments
        </h1>
        <p className="text-muted-foreground">
          Manage your upcoming consultations with patients
        </p>
      </div>

      {appointments && appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">
                      {format(new Date(appointment.appointmentDate), "PPP")}
                    </CardTitle>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {appointment.patient.user.firstName[0]}
                      {appointment.patient.user.lastName[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">
                        {appointment.patient.user.firstName}{" "}
                        {appointment.patient.user.lastName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Patient ID: #{appointment.patient.id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border mt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {format(
                          new Date(appointment.slot.startTime),
                          "hh:mm a",
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>Audio/Video</span>
                    </div>
                  </div>

                  {appointment.status === AppointmentStatus.CONFIRMED && (
                    <div className="flex items-center justify-between pt-4 gap-3">
                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={() => handleComplete(appointment.id)}
                        disabled={isCompleting}
                      >
                        {isCompleting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Start Consultation
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleCancel(appointment.id)}
                            disabled={isCancelling}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-24 text-center bg-card">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <User className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No appointments scheduled</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-sm">
            You don't have any upcoming consultations at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
