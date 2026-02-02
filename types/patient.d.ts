export interface CreatePatientProfileRequest {
  gender: string;
  dateOfBirth: string;
  phone: string;
  [key: string]: any;
}

export interface UpdatePatientProfileRequest {
  gender?: string;
  dateOfBirth?: string;
  phone?: string;
}

export interface CreateAIReportRequest {
  description: string;
  images: File[];
}

export interface AIReport {
  id: number;
  description: string;
  imagePaths: string[];
  confidenceScore: string;
  diseaseName: string;
  createdAt: string;
}

export interface Patient {
  id: number;
  gender: string;
  dateOfBirth: string;
  phone: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
}
