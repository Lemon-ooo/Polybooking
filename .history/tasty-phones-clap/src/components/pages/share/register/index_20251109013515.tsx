import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Form, message } from "antd";
import { IRegisterForm } from "../../interfaces/auth";
import { authProvider } from "../../providers/authProvider";

// ======================
// Zod schema validation
// ======================
const registerSchema = z
  .object({
    name: z.string().min(2, "Tên phải ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
    password_confirmation: z.string().min(6, "Xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["password_confirmation"],
  });

export const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: IRegisterForm) => {
    try {
      const result = await authProvider.register?.(data);
      if (result?.success) {
        message.success("Đăng ký thành công! Chuyển tới trang đăng nhập...");
        window.location.href = "/login"; // Redirect
      } else {
        message.error(result?.error?.message || "Đăng ký thất bại");
      }
    } catch (err: any) {
      message.error(err.message || "Đã xảy ra lỗi khi đăng ký");
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <Form.Item
        label="Tên"
        validateStatus={errors.name ? "error" : ""}
        help={errors.name?.message}
      >
        <Input {...register("name")} placeholder="Nhập tên của bạn" />
      </Form.Item>

      <Form.Item
        label="Email"
        validateStatus={errors.email ? "error" : ""}
        help={errors.email?.message}
      >
        <Input {...register("email")} placeholder="Nhập email" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        validateStatus={errors.password ? "error" : ""}
        help={errors.password?.message}
      >
        <Input.Password {...register("password")} placeholder="Mật khẩu" />
      </Form.Item>

      <Form.Item
        label="Xác nhận mật khẩu"
        validateStatus={errors.password_confirmation ? "error" : ""}
        help={errors.password_confirmation?.message}
      >
        <Input.Password
          {...register("password_confirmation")}
          placeholder="Nhập lại mật khẩu"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};
