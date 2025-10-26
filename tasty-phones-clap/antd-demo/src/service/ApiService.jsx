import axios from "axios";

export class ApiService {
  static BASE_URL = "http://localhost:4040";

  // --- PHƯƠNG THỨC XÁC THỰC GIẢ LẬP ---

  // 1. Kiểm tra xem người dùng đã đăng nhập chưa
  static isAuthenticated() {
    // Giả lập: Đã đăng nhập nếu có token trong localStorage
    return localStorage.getItem("token") !== null;
  }

  // 2. Kiểm tra vai trò Admin
  static isAdmin() {
    const role = localStorage.getItem("role");
    // Người dùng phải đăng nhập VÀ role phải là "ADMIN"
    return this.isAuthenticated() && role === "ADMIN";
  }

  // 3. KIỂM TRA VAI TRÒ USER (CẦN THIẾT ĐỂ KHẮC PHỤC LỖI)
  static isUser() {
    const role = localStorage.getItem("role");
    // Người dùng phải đăng nhập VÀ role phải là "USER"
    return this.isAuthenticated() && role === "USER";
  }

  // Phương thức lưu token và role sau khi đăng nhập thành công
  static saveAuthInfo(token, role) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role); // Ví dụ: "USER" hoặc "ADMIN"
  }

  // Phương thức xóa thông tin khi đăng xuất
  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  // ----------------------------------------

  /* Lấy danh sách loại phòng (Đã sửa cho JSON Server) */
  static async getRoomTypes() {
    try {
      const response = await axios.get(`${this.BASE_URL}/roomTypes`);
      return response.data;
    } catch (error) {
      console.error("Error fetching room types:", error.message);
      return [];
    }
  }

  /* Lấy tất cả các phòng có sẵn */
  static async getAllAvailableRooms() {
    try {
      // SỬA ĐƯỜNG DẪN TỪ /rooms/all THÀNH /rooms
      const response = await axios.get(`${this.BASE_URL}/rooms`);

      // SỬA ĐIỂM NÀY: Thay vì trả về mảng đã lọc, ta bọc nó trong một object có khóa 'roomList'
      const availableRooms = response.data.filter((room) => room.isAvailable);

      // TRẢ VỀ CẤU TRÚC OBJECT mà Frontend mong đợi
      return { roomList: availableRooms };
    } catch (error) {
      console.error("Error fetching rooms:", error.message);
      return { roomList: [] }; // Trả về cấu trúc lỗi khớp
    }
  }
  static async getRoomById(roomId) {
    try {
      if (!roomId) {
        // Thêm kiểm tra
        throw new Error("Room ID is required.");
      }
      // Đảm bảo URL là chuỗi (dù roomId có thể là string hoặc number)
      const url = `${this.BASE_URL}/rooms/${roomId}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room ${roomId}:`, error.message);
      // Lỗi 404 thường trả về lỗi này
      throw new Error(
        error.response?.data?.message ||
          `Request failed with status code ${
            error.response?.status || "unknown"
          }`
      );
    }
  }
  // ------AUTH METHODS FOR JSON SERVER SIMULATION------

  /* Đăng ký người dùng (Đã sửa cho JSON Server) */
  static async registerUser(registration) {
    try {
      const response = await axios.post(`${this.BASE_URL}/users`, registration);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.message);
      throw error;
    }
  }

  /* Đăng nhập người dùng */
  static async loginUser(credentials) {
    // <--- HÀM ĐƯỢC GỌI BỞI LOGINPAGE
    try {
      // NOTE: JSON Server không có endpoint /login, nên ta giả lập
      // Tìm kiếm user trong db.json dựa trên email và password
      const response = await axios.get(
        `${this.BASE_URL}/users?email=${credentials.email}&password=${credentials.password}`
      );
      const user = response.data[0];

      if (user) {
        // Giả lập trả về token và role cho ứng dụng frontend
        return {
          statusCode: 200,
          token: "fake_jwt_token_" + user.id, // Tạo token giả
          role: user.role,
        };
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      throw error;
    }
  }
}
