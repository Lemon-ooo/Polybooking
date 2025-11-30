// src/components/pages/admin/services/Create.tsx
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { useState } from "react";

export const ServicesCreate = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // XÓA meta.headers → không cần nữa (dataProvider đã xử lý)
  const { formProps, saveButtonProps } = useForm({
    resource: "services",
    redirect: false,
    onMutationSuccess: () => {
      navigate("/admin/services");
    },
  });

  const handleFinish = (values: any) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("price", String(Number(values.price)));
    if (values.description) {
      formData.append("description", values.description);
    }

    // Gửi file ảnh
    if (fileList.length === 0 || !fileList[0].originFileObj) {
      message.error("Vui lòng chọn ảnh dịch vụ!");
      return;
    }

    formData.append("image", fileList[0].originFileObj as RcFile);

    // Gửi FormData
    formProps.onFinish?.(formData);
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

        <Form.Item
          label="Ảnh dịch vụ"
          name="image"
          rules={[{ required: true, message: "Vui lòng tải lên ảnh dịch vụ!" }]}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList: newFileList }) => {
              setFileList(newFileList.filter((f) => f.status !== "error"));
            }}
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