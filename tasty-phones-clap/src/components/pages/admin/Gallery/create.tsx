import React, { useState, useEffect } from "react";
import { Create } from "@refinedev/antd";
import {
  useForm,
  useApiUrl,
  useNotification,
  useList,
  useNavigation,
} from "@refinedev/core";
import { Form, Input, Select, Upload, Button, Row, Col, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  RcFile,
  UploadFile,
  UploadChangeParam,
} from "antd/lib/upload/interface";

const { TextArea } = Input;

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) message.error("Chỉ được upload JPG/PNG!");
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) message.error("Ảnh phải nhỏ hơn 5MB!");
  return isJpgOrPng && isLt5M;
};

const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

export const GalleryCreate: React.FC = () => {
  const apiUrl = useApiUrl();
  const { open } = useNotification();
  const { list } = useNavigation();

  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);

  const { formProps, saveButtonProps, onFinish } = useForm({
    resource: "galleries",
    action: "create",
    form,
    onMutationSuccess: () => {
      message.success("Tạo ảnh mới thành công!");
      list("galleries");
    },
  });

  // Lấy category từ API
  const { data } = useList({
    resource: "galleries",
    pagination: { pageSize: 1 }, // chỉ cần 1 record để lấy category
  });

  useEffect(() => {
    if (data?.data) {
      setCategories(Object.keys(data.data)); // Lấy các key từ data
    }
  }, [data]);

  const uploadImage = async (file: RcFile) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${apiUrl}/galleries/upload`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      return result.path || "";
    } catch (err) {
      console.error(err);
      open({
        type: "error",
        message: "Lỗi upload ảnh",
        description: "Không thể upload ảnh.",
      });
      return "";
    }
  };

  const handleFormSubmit = async (values: any) => {
    let imagePath = "";

    if (values.file?.length > 0 && values.file[0].originFileObj) {
      imagePath = await uploadImage(values.file[0].originFileObj);
    }

    // Gửi dữ liệu lên Refine
    onFinish?.({
      gallery_category: values.gallery_category,
      caption: values.caption || "",
      image_path: imagePath,
    });
  };

  return (
    <Create title="Tạo ảnh mới" saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Form.Item
              label="Danh mục ảnh"
              name="gallery_category"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((cat) => (
                  <Select.Option key={cat} value={cat}>
                    {cat}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Mô tả (Caption)" name="caption">
              <TextArea rows={4} placeholder="Nhập mô tả ảnh (tùy chọn)" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              label="Ảnh"
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
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
