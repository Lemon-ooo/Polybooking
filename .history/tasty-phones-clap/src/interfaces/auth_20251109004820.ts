export interface IUser {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "user";
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IAuthError {
  name: string;
  message: string;
  status?: number;
}
