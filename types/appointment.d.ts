import { Doctor } from "./doctor";
import { Patient } from "./patient";

 enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

 interface Appointment {
  id: number;
  appointmentDate: string;
  status: AppointmentStatus;
  doctor: Doctor;
  patient: Patient;
  slot: {
    id: number;
    startTime: string;
    endTime: string;
    date: string;
  };
  createdAt: string;
  updatedAt: string;
}

 interface BookAppointmentRequest {
  doctorId: number;
  slotId: number;
}
