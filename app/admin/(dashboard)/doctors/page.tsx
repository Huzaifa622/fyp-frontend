"use client";

import React, { useState } from "react";
import { Search, Loader2, MapPin, Award, Clock, Eye } from "lucide-react";
import {
  useGetAllDoctorsQuery,
  useGetDoctorByIdQuery,
} from "@/services/doctor";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDoctorsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { data: doctors, isLoading } = useGetAllDoctorsQuery({
    search: searchTerm || "",
  });

  const { data: selectedDoctor, isLoading: isDoctorLoading } =
    useGetDoctorByIdQuery(selectedDoctorId!, { skip: !selectedDoctorId });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            All Doctors
          </h1>
          <p className="text-muted-foreground">
            View and manage all verified doctors on the platform
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
                    variant="outline"
                    onClick={() => {
                      setSelectedDoctorId(doctor.id);
                      setIsDetailsModalOpen(true);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-24 text-center">
          <p className="text-muted-foreground">
            No verified doctors found matching your criteria.
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

      {/* Doctor Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Doctor Details</DialogTitle>
            <DialogDescription>
              Complete information about this verified doctor.
            </DialogDescription>
          </DialogHeader>

          {isDoctorLoading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedDoctor ? (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedDoctor.user.avatar} />
                  <AvatarFallback className="text-lg font-bold">
                    {selectedDoctor.user.firstName[0]}
                    {selectedDoctor.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-xl font-bold">
                    Dr. {selectedDoctor.user.firstName} {selectedDoctor.user.lastName}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedDoctor.user.email}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">
                      License: {selectedDoctor.licenseNumber}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedDoctor.experienceYears} Years Exp.
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-muted-foreground mb-2">
                      CONSULTATION FEE
                    </h5>
                    <p className="text-2xl font-bold text-primary">
                      PKR {selectedDoctor.consultationFee.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-muted-foreground mb-2">
                      CLINIC ADDRESS
                    </h5>
                    <p className="text-sm">
                      {selectedDoctor.clinicAddress || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-muted-foreground mb-2">
                      VERIFICATION STATUS
                    </h5>
                    <Badge variant="default" className="bg-green-500">
                      Verified Doctor
                    </Badge>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-muted-foreground mb-2">
                      SPECIALIZATION
                    </h5>
                    <p className="text-sm">Dermatology</p>
                  </div>
                </div>
              </div>

              {selectedDoctor.bio && (
                <div>
                  <h5 className="text-sm font-semibold text-muted-foreground mb-2">
                    BIOGRAPHY
                  </h5>
                  <p className="text-sm leading-relaxed bg-muted/20 p-4 rounded-lg">
                    {selectedDoctor.bio}
                  </p>
                </div>
              )}

              {selectedDoctor.timeSlots && selectedDoctor.timeSlots.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-muted-foreground mb-2">
                    AVAILABLE TIME SLOTS
                  </h5>
                  <div className="text-sm text-muted-foreground">
                    {selectedDoctor.timeSlots.filter(slot => !slot.isBooked).length} slots available
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
