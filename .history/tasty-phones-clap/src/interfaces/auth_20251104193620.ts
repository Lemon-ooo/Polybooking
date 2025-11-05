import { User } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  redirect_to: string;
}

export interface PersonalAccessToken {
  id: number;
  tokenable_type: string;
  tokenable_id: number;
  name: string;
  token: string;
  abilities: string[];
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PasswordResetToken {
  email: string;
  token: string;
  created_at: string;
}
