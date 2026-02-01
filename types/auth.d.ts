export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

export interface LoginRequest {
  email: string;
  password?: string;
  [key: string]: any;
}

export interface LoginResponse {
  token: string;
  isOnboarded:boolean;
  role:string;
}

export interface ProfileResponse extends User {
  // Add other profile fields if necessary
}
