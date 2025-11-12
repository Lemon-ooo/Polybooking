import React from "react";
import { Create, useForm, useSelect } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Row,
  Col,
  Divider,
} from "antd";
import { useNavigation } from "@refinedev/core";
import { Room, RoomType, Amenity } from "../../../../interfaces/rooms";

const { Option } = Select;
const { TextArea } = Input;

export const RoomCreate: React.FC = () => {
  const { list } = useNavigation();
  const { formProps, saveButtonProps } = useForm<Room>({
    resource: "rooms",
    redirect: "list",
  });

  // Lấy danh sách room types
  const { selectProps: roomTypeSelectProps } = useSelect<RoomType>({
    resource: "room-types",
    optionLabel: "name",
    optionValue: "id",
  });

  // Lấy danh sách amenities
  const { selectProps: amenitiesSelectProps } = useSelect<Amenity>({
    resource: "amenities",
    optionLabel: "name",
    optionValue: "id",
  });

  // Xử lý format giá trước khi gửi
  const handleFormSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      price: values.price.toString(),
      amenities: values.amenities || [],
    };

    if (formProps.onFinish) {
      formProps.onFinish(formattedValues);
    }
  };

  return (
    <Create
      title="Tạo phòng mới"
      headerButtons={[
        <Button key="list" onClick={() => list("rooms")}>
          Quay lại danh sách
        </Button>,
      ]}
      saveButtonProps={saveButtonProps}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          status: "trống",
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Số phòng"
              name="room_number"
              rules={[
                { required: true, message: "Vui lòng nhập số phòng" },
                {
                  pattern: /^[A-Za-z0-9-]+$/,
                  message:
                    "Số phòng chỉ được chứa chữ cái, số và dấu gạch ngang",
                },
              ]}
            >
              <Input placeholder="VD: 101, A201, 12-B" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Loại phòng"
              name="room_type_id"
              rules={[{ required: true, message: "Vui lòng chọn loại phòng" }]}
            >
              <Select
                {...roomTypeSelectProps}
                placeholder="Chọn loại phòng"
                loading={roomTypeSelectProps.loading}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giá phòng (VND)"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá phòng" },
                {
                  type: "number",
                  min: 1000,
                  message: "Giá phòng phải lớn hơn 1,000 VND",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "") || ""}
                min={0}
                placeholder="Nhập giá phòng"
                step={1000}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="trống">Trống</Option>
                <Option value="đang sử dụng">Đang sử dụng</Option>
                <Option value="maintenance">Bảo trì</Option>
                <Option value="occupied">Đã đặt</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            {
              max: 500,
              message: "Mô tả không được vượt quá 500 ký tự",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập mô tả về phòng, view, đặc điểm nổi bật..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Tiện nghi"
          name="amenities"
          help="Chọn các tiện nghi có sẵn trong phòng"
        >
          <Select
            {...amenitiesSelectProps}
            mode="multiple"
            placeholder="Chọn tiện nghi"
            allowClear
            style={{ width: "100%" }}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Divider />

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" {...saveButtonProps}>
              Tạo phòng
            </Button>
            <Button onClick={() => list("rooms")}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Create>
  );
};
