import React, { useState } from "react";
import { Create } from "@refinedev/antd";
import {
  useForm,
  useApiUrl,
  useNotification,
  useNavigation,
} from "@refinedev/core";
import {
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  Row,
  Col,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  RcFile,
  UploadFile,
  UploadChangeParam,
} from "antd/lib/upload/interface";

const { TextArea } = Input;

// Validate file upload
const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) message.error("Chỉ được upload JPG/PNG!");
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) message.error("Ảnh phải nhỏ hơn 5MB!");
  return isJpgOrPng && isLt5M;
};

// Lấy fileList từ event
const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

export const EventCreate: React.FC = () => {
  const apiUrl = useApiUrl();
  const { open } = useNotification();
  const { list } = useNavigation();

  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string>("");

  const { formProps, saveButtonProps, onFinish } = useForm({
    resource: "events",
    action: "create",
    form,
    onMutationSuccess: () => {
      message.success("Tạo sự kiện thành công!");
      list("events");
    },
  });

  // Upload ảnh trước, trả về image_path
  const uploadImage = async (file: RcFile) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${apiUrl}/events/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.path || ""; // backend trả về path hoặc URL
    } catch (err) {
      console.error(err);
      open({
        type: "error",
        message: "Lỗi upload ảnh",
        description: "Không thể upload ảnh bìa.",
      });
      return "";
    }
  };

  const handleFormSubmit = async (values: any) => {
    let imagePath = "";

    if (values.file?.length > 0 && values.file[0].originFileObj) {
      imagePath = await uploadImage(values.file[0].originFileObj);
    }

    // Submit object chuẩn cho Refine
    onFinish?.({
      name: values.name,
      location: values.location,
      description: values.description || "",
      date: dayjs(values.date).format("YYYY-MM-DD"),
      image: imagePath,
    });
  };

  return (
    <Create title="Tạo sự kiện mới" saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Form.Item
              label="Tên sự kiện"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên sự kiện!" },
              ]}
            >
              <Input placeholder="Ví dụ: Hội nghị khách hàng 2025" />
            </Form.Item>

            <Form.Item
              label="Địa điểm"
              name="location"
              rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
            >
              <Input placeholder="Ví dụ: Khách sạn Mường Thanh" />
            </Form.Item>

            <Form.Item
              label="Ngày diễn ra"
              name="date"
              rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              label="Ảnh bìa"
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={beforeUpload}
                customRequest={({ onSuccess }) => onSuccess?.({} as any)}
                onChange={(info: UploadChangeParam<UploadFile>) => {
                  form.setFieldsValue({ file: info.fileList });
                  if (info.fileList[0]?.originFileObj) {
                    setPreviewImage(
                      URL.createObjectURL(info.fileList[0].originFileObj)
                    );
                  }
                }}
              >
                <Button icon={<UploadOutlined />}>
                  Chọn ảnh (JPG/PNG, max 5MB)
                </Button>
              </Upload>
            </Form.Item>
            {previewImage && (
              <img
                src={previewImage}
                alt="preview"
                style={{ width: "100%", marginTop: 16, borderRadius: 8 }}
              />
            )}
          </Col>
        </Row>
      </Form>
    </Create>
  );
};
