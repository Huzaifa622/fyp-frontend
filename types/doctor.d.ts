export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface TimeSlot {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OnBoardingDoctorRequest {
  licenseNumber: string;
  experienceYears: number;
  consultationFee: number;
  bio?: string;
  clinicAddress?: string;
  timeSlots: TimeSlot[];
  degree: File;
  certificate?: File;
}

export interface UpdateDoctorProfileRequest {
  licenseNumber?: string;
  experienceYears?: number;
  consultationFee?: number;
  bio?: string;
  clinicAddress?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  };
}

export interface CreateTimeSlotRequest {
  slots: {
    date: string;
    timeRanges: { startTime: string; endTime: string }[];
  }[];
}

export interface FindDoctorQueryDto {
  search?: string;
  isVerified?: boolean;
}

export interface Doctor {
  id: number;
  licenseNumber: string;
  experienceYears: number;
  consultationFee: number;
  bio?: string;
  clinicAddress?: string;
  isVerified: boolean;
  degreePath?: string;
  certificatePath?: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  timeSlots?: TimeSlot[];
}
