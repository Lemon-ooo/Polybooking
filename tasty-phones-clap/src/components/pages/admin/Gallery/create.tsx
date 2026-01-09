// src/components/pages/admin/gallery/Create.tsx

import React, { useState } from "react";
import { Create, useForm } from "@refinedev/antd";
import { Button, Form, Input, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import axiosInstance from "../../../../providers/data/axiosConfig";
import axios, { AxiosError } from "axios";

export const GalleryCreate = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { formProps, saveButtonProps } = useForm({
    resource: "galleries",
    redirect: false,
  });

  const handleFinish = async (values: any) => {
    if (fileList.length === 0 || !fileList[0]?.originFileObj) {
      message.error("Vui lòng chọn ảnh để thêm vào thư viện!");
      return;
    }

    const formData = new FormData();

    if (values.gallery_category?.trim()) {
      formData.append("gallery_category", values.gallery_category.trim());
    }
    if (values.caption?.trim()) {
      formData.append("caption", values.caption.trim());
    }

    formData.append("image", fileList[0].originFileObj as RcFile);

    try {
      const response = await axiosInstance.post("/galleries", formData);
      const newGallery = response.data.data || response.data;

      message.success("Thêm ảnh vào thư viện thành công!");

      window.dispatchEvent(
        new CustomEvent("galleryAdded", { detail: newGallery })
      );

      navigate("/admin/galleries"); // Cập nhật đường dẫn chuyển hướng nếu cần
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const axiosError = error as AxiosError;
        console.error("Lỗi Axios:", axiosError.response?.data);

        const errs = axiosError.response?.data?.errors;
        if (errs) {
          Object.values(errs).forEach((msg: any) =>
            message.error(Array.isArray(msg) ? msg[0] : msg)
          );
        } else {
          message.error(
            axiosError.response?.data?.message ||
              "Thêm ảnh thất bại! (Lỗi Server)"
          );
        }
      } else {
        console.error("Lỗi không xác định:", error);
        message.error("Đã xảy ra lỗi mạng hoặc lỗi không xác định!");
      }
    }
  };

  return (
   <Create
      title="Thêm ảnh vào thư viện"
      saveButtonProps={{ ...saveButtonProps, children: "Thêm ảnh" }}
      // Override nút quay lại mặc định để chắc chắn click được
      goBack={
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/galleries")}
          style={{ fontSize: 16 }}
        />
      }
    >
      <Form {...formProps} onFinish={handleFinish} layout="vertical">
        <Form.Item label="Nhóm ảnh" name="gallery_category">
          <Input placeholder="VD: Sự kiện, Dự án, Món ăn..." />
        </Form.Item>

        <Form.Item label="Chú thích (Caption)" name="caption">
          <Input.TextArea
            rows={4}
            placeholder="Nhập mô tả ngắn cho bức ảnh..."
          />
        </Form.Item>

        <Form.Item
          label="Ảnh"
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
