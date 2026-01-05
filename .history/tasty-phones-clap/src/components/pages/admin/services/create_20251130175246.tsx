// src/components/pages/admin/services/Create.tsx
import React, { useState } from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import axiosInstance from "../../../../providers/data/axiosConfig";

export const ServicesCreate = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { formProps, saveButtonProps } = useForm({
    resource: "services",
    redirect: false,
  });

  const handleFinish = async (values: any) => {
    if (fileList.length === 0 || !fileList[0]?.originFileObj) {
      message.error("Vui lòng chọn ảnh dịch vụ!");
      return;
    }

    const formData = new FormData();
    formData.append("service_name", values.name.trim());
    formData.append("service_price", parseFloat(values.price || 0).toFixed(2));
    if (values.description?.trim()) {
      formData.append("description", values.description.trim());
    }
    formData.append("service_image", fileList[0].originFileObj as RcFile);

    try {
      const response = await axiosInstance.post("/services", formData);
      const newService = response.data.data || response.data; // Laravel thường trả data.data

      message.success("Thêm dịch vụ thành công!");

      // GỬI DỮ LIỆU MỚI VỀ TRANG LIST ĐỂ HIỆN NGAY Ở ĐẦU
      window.dispatchEvent(
        new CustomEvent("serviceAdded", { detail: newService })
      );

      navigate("/admin/services");
    } catch (error: any) {
      console.error("Lỗi:", error.response?.data);
      const errs = error.response?.data?.errors;
      if (errs) {
        Object.values(errs).forEach((msg: any) =>
          message.error(Array.isArray(msg) ? msg[0] : msg)
        );
      } else {
        message.error(
          error.response?.data?.message || "Thêm dịch vụ thất bại!"
        );
      }
    }
  };

  return (
    <Create saveButtonProps={{ ...saveButtonProps, children: "Thêm dịch vụ" }}>
      <Form {...formProps} onFinish={handleFinish} layout="vertical">
        <Form.Item
          label="Tên dịch vụ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
        >
          <Input placeholder="VD: Ăn sáng buffet" />
        </Form.Item>

        <Form.Item
          label="Giá (VNĐ)"
          name="price"
          rules={[{ required: true, type: "number", min: 0 }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            step={1000}
            formatter={(v) =>
              v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
            }
            parser={(v) => (v ? v.replace(/,/g, "") : "") as any}
          />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Ảnh dịch vụ"
          rules={[{ required: true, message: "Vui lòng tải lên ảnh!" }]}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList: newFileList }) =>
              setFileList(newFileList.slice(-1))
            }
            beforeUpload={() => false}
            accept="image/*"
          >
            {fileList.length === 0 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Create>
  );
};
