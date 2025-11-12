// src/components/pages/admin/services/Create.tsx
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch } from "antd";
import { useNavigate } from "react-router-dom";

export const ServicesCreate = () => {
  const navigate = useNavigate();

  const { formProps, saveButtonProps } = useForm({
    resource: "services",

    // CÁCH VIẾT ĐÚNG CHO REFINE V3
    redirect: false,
    successNotification: () => ({
      message: "Thành công",
      description: "Thêm dịch vụ thành công!",
      type: "success",
    }),
    errorNotification: () => ({
      message: "Lỗi",
      description: "Thêm dịch vụ thất bại!",
      type: "error",
    }),

    // Xử lý sau khi tạo thành công
    onMutationSuccess: () => {
      navigate("/admin/services");
    },
  });

  // Fix lỗi price là string → ép về number
  const handleFinish = (values: any) => {
    const dataToSend = {
      ...values,
      price: Number(values.price),
      isActive: values.isActive ?? true,
    };
    formProps.onFinish?.(dataToSend);
  };

  return (
    <Create
      saveButtonProps={{
        ...saveButtonProps,
        children: "Thêm dịch vụ",
      }}
    >
      <Form {...formProps} onFinish={handleFinish} layout="vertical">
        <Form.Item
          label="Tên dịch vụ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
        >
          <Input placeholder="VD: Massage thư giãn" />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              value ? `₫${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
            }
            parser={(value) => value?.replace(/\₫\s?|(,*)/g, "") as any}
          />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} placeholder="Mô tả chi tiết dịch vụ..." />
        </Form.Item>

       
      </Form>
    </Create>
  );
};