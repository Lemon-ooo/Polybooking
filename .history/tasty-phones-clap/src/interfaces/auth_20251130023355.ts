export interface IUser {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "customer" | string;
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

export interface IRegisterForm {
  user_name: string;
  email: string;
  password: string;
  password_confirmation: string; // để xác nhận mật khẩu
}
