import { IAuthError, ILoginForm, IUser } from "../../interfaces/auth";

// Use relative /api in dev so Vite proxy handles CORS; in production fall back to VITE_API_URL or localhost
const API_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000/api');

interface AuthState {
  token: string;
  role: string;
  id: number;
  name: string;
  email: string;
}

export const authProvider = {
  login: async ({ email, password }: ILoginForm) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
  // Debug logs for dev: response status and body
  // NOTE: remove or lower verbosity in production
  // eslint-disable-next-line no-console
  console.debug('[authProvider] login response', { status: response.status, body: data });

      if (!response.ok) {
        return {
          success: false,
          error: {
            name: 'Login Error',
            message: data.message || 'Email hoặc mật khẩu không đúng'
          } as IAuthError
        };
      }

      // Xoá thông tin auth cũ nếu có
      localStorage.removeItem('auth');

      // Lưu thông tin auth mới (lưu role để dùng cho redirect)
      const token = data.token.startsWith('Bearer ') ? data.token : `Bearer ${data.token}`;
      const authState: AuthState = {
        ...data.user,
        token
      };
      localStorage.setItem('auth', JSON.stringify(authState));

      // Redirect theo role: admin -> /admin (dashboard), client -> /
      const role = data.user?.role || 'client';
  const redirectTo = role === 'admin' ? '/admin/dashboard' : '/';

      return {
        success: true,
        redirectTo,
        notification: {
          type: 'success',
          messageType: 'success',
          message: 'Đăng nhập thành công',
          notificationType: 'toast',
          duration: 2000,
          autoHideDuration: 2000
        }
      };

    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'Login Error',
          message: error.message || 'Đã có lỗi xảy ra'
        } as IAuthError
      };
    }
  },

  logout: async () => {
    try {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const { token } = JSON.parse(auth) as AuthState;
        
        // Gọi API logout
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Accept': 'application/json'
          }
        });
      }
      
      // Xóa dữ liệu local sau khi logout thành công
      localStorage.removeItem('auth');
      return {
        success: true,
        redirectTo: '/',
        notification: {
          type: 'success',
          messageType: 'success',
          message: 'Đăng xuất thành công',
          notificationType: 'toast',
          duration: 2000,
          autoHideDuration: 2000
        }
      };
    } catch (error) {
      // Xóa dữ liệu local ngay cả khi có lỗi
      localStorage.removeItem('auth');
      return {
        success: true,
        redirectTo: '/',
        notification: {
          type: 'success',
          messageType: 'success',
          message: 'Đăng xuất thành công',
          notificationType: 'toast',
          duration: 2000,
          autoHideDuration: 2000
        }
      };
    }
  },

  check: async () => {
    const auth = localStorage.getItem('auth');
    
    if (!auth) {
      return {
        authenticated: false,
        redirectTo: '/login'
      };
    }

    try {
      // If auth exists consider user authenticated. Role-based guards should be
      // handled by route-level checks if needed.
      return {
        authenticated: true
      };

    } catch (error) {
      localStorage.removeItem('auth');
      return {
        authenticated: false,
        redirectTo: '/login'
      };
    }
  },

  getIdentity: async () => {
    try {
      const auth = localStorage.getItem('auth');
      if (!auth) return null;

      const data = JSON.parse(auth) as AuthState;
      return data as IUser;
    } catch (err) {
      localStorage.removeItem('auth');
      return null;
    }
  },

  onError: async (error: IAuthError) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('auth');
      return {
        logout: true,
        redirectTo: '/login'
      };
    }
    return { error };
  }
};