export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  password?: string; // Chỉ dùng khi tạo mới
  remember_token: string | null;
  role: "admin" | "client";
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "client";
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: "admin" | "client";
}
