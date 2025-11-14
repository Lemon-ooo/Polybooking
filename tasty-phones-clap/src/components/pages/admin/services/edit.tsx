// src/components/pages/admin/services/Edit.tsx
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { useState, useEffect } from "react";

export const ServicesEdit = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "services",
    action: "edit",
    redirect: false,
    onMutationSuccess: () => {
      message.success("Cập nhật dịch vụ thành công!");
      navigate("/admin/services");
    },
    onMutationError: () => {
      message.error("Cập nhật thất bại!");
    },
  });

  // LẤY DỮ LIỆU CŨ TỪ API
  const service = queryResult?.data?.data;

  // HIỂN THỊ ẢNH CŨ KHI LOAD TRANG
  useEffect(() => {
    if (service?.image_url && fileList.length === 0) {
      setFileList([
        {
          uid: "-1",
          name: "current-image.jpg",
          status: "done",
          url: service.image_url,
          thumbUrl: service.image_url,
        },
      ]);
    }
  }, [service?.image_url, fileList.length]);

  const handleFinish = (values: any) => {
    const formData = new FormData();

    // Thêm các field
    formData.append("name", values.name);
    formData.append("price", String(values.price));
    if (values.description) {
      formData.append("description", values.description);
    }

    // GỬI ẢNH MỚI (nếu có)
    const newFile = fileList[0]?.originFileObj;
    if (newFile) {
      formData.append("image", newFile as RcFile);
    }

    // GỬI FormData → dataProvider dùng PATCH
    formProps.onFinish?.(formData);
  };

  return (
    <Edit
      saveButtonProps={{
        ...saveButtonProps,
        children: "Cập nhật dịch vụ",
      }}
    >
      <Form {...formProps} onFinish={handleFinish} layout="vertical">
        {/* TÊN DỊCH VỤ */}
        <Form.Item
          label="Tên dịch vụ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
        >
          <Input placeholder="VD: Massage thư giãn" />
        </Form.Item>

        {/* GIÁ */}
        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
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

        {/* MÔ TẢ */}
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} placeholder="Mô tả chi tiết dịch vụ..." />
        </Form.Item>

        {/* ẢNH DỊCH VỤ */}
        <Form.Item label="Ảnh dịch vụ" name="image">
          <Upload
            listType="picture-card"
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList: newFileList }) => {
              const filtered = newFileList
                .filter((f) => f.status !== "error")
                .map((f) => ({
                  ...f,
                  originFileObj: f.originFileObj,
                }));
              setFileList(filtered);
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

          {/* HIỂN THỊ ẢNH CŨ NẾU KHÔNG CÓ ẢNH MỚI */}
          {fileList.length === 0 && service?.image_url && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
              Ảnh hiện tại:{" "}
              <a href={service.image_url} target="_blank" rel="noreferrer">
                Xem ảnh
              </a>
            </div>
          )}
        </Form.Item>
      </Form>
    </Edit>
  );
};