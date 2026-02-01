"use client";

import React, { useState } from "react";
import {
  useGetAllPendingDoctorsQuery,
  useVerifyDoctorMutation,
} from "@/services/doctor";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building,
  GraduationCap,
  Calendar,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PendingDoctors() {
  const {
    data: pendingDoctors,
    isLoading,
    refetch,
  } = useGetAllPendingDoctorsQuery();
  const [verifyDoctor, { isLoading: isVerifying }] = useVerifyDoctorMutation();

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);

  const handleVerify = async (id: number) => {
    try {
      await verifyDoctor(id).unwrap();
      toast.success("Doctor verified successfully");
      setIsVerifyDialogOpen(false);
      setSelectedDoctor(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to verify doctor");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Pending Approvals
        </h1>
        <p className="text-muted-foreground">
          Review credentials and approve registration requests from medical
          professionals.
        </p>
      </div>

      {pendingDoctors && pendingDoctors.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {pendingDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-muted/30 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20 group-hover:scale-105 transition-transform">
                        {doctor.user.firstName[0]}
                        {doctor.user.lastName[0]}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white border-4 border-card">
                        <Clock className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-foreground">
                      Dr. {doctor.user.firstName} {doctor.user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {doctor.user.email}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/5 text-primary border-primary/10"
                      >
                        {doctor.experienceYears} Years Exp.
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/5 text-green-600 border-green-500/10"
                      >
                        License: {doctor.licenseNumber}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          <ShieldCheck className="h-4 w-4" />
                          Professional Bio
                        </h4>
                        <p className="text-sm leading-relaxed text-foreground/80 bg-muted/20 p-4 rounded-xl italic">
                          "{doctor.bio || "No biography provided."}"
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <Building className="h-3.5 w-3.5" />
                            Clinic Address
                          </h4>
                          <p className="text-sm font-medium">
                            {doctor.clinicAddress || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <GraduationCap className="h-3.5 w-3.5" />
                            Degree
                          </h4>
                          <a
                            href={doctor?.degreePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline group/link"
                          >
                            View Document
                            <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-muted/10 border border-border/50 text-center">
                          <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">
                            Consultation Fee
                          </h5>
                          <p className="text-2xl font-black text-foreground">
                            PKR {doctor.consultationFee}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/10 border border-border/50 text-center">
                          <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">
                            Uploaded On
                          </h5>
                          <p className="text-lg font-bold text-foreground">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl h-11 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                          onClick={() => {
                            toast.info("Rejection feature coming soon");
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          className="flex-1 rounded-xl h-11 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all"
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setIsVerifyDialogOpen(true);
                          }}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve Registration
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-muted/5 py-24">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShieldCheck className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              All caught up!
            </h3>
            <p className="max-w-sm mt-2 text-muted-foreground">
              There are no pending doctor registration requests at the moment.
            </p>
            <Button
              variant="outline"
              className="mt-8"
              onClick={() => refetch()}
            >
              Refresh Dashboard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Verification Confirmation Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Medical Practitioner</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve **Dr.{" "}
              {selectedDoctor?.user.firstName} {selectedDoctor?.user.lastName}
              **? This will grant them full access to the platform and allow
              them to accept appointments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsVerifyDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleVerify(selectedDoctor?.id)}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm Approval"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
