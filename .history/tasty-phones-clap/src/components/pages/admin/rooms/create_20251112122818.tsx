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
  Checkbox,
  Card,
  List,
  Typography,
  Alert,
} from "antd";
import { useNavigation } from "@refinedev/core";
import { Room, RoomType, Amenity } from "../../interfaces/rooms";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

export const RoomCreate: React.FC = () => {
  const { list } = useNavigation();
  const { formProps, saveButtonProps, onFinish } = useForm<Room>({
    resource: "rooms",
    redirect: "list",
    onMutationSuccess: () => {
      console.log("Tạo phòng thành công!");
    },
    onMutationError: (error) => {
      console.error("Lỗi tạo phòng:", error);
    },
  });

  // Lấy danh sách room types
  const { selectProps: roomTypeSelectProps } = useSelect<RoomType>({
    resource: "room-types",
    optionLabel: "name",
    optionValue: "id",
  });

  // Lấy danh sách amenities với useSelect
  const { selectProps: amenitiesSelectProps, queryResult: amenitiesQuery } =
    useSelect<Amenity>({
      resource: "amenities",
      optionLabel: "name",
      optionValue: "id",
    });

  const amenitiesData = amenitiesQuery?.data?.data || [];

  // Xử lý submit form
  const handleFormSubmit = async (values: any) => {
    console.log("Form values:", values);

    const formattedValues = {
      room_number: values.room_number,
      room_type_id: values.room_type_id,
      price: values.price?.toString(),
      status: values.status,
      description: values.description || "",
      amenities: values.amenities || [],
    };

    console.log("Sending data:", formattedValues);

    try {
      if (onFinish) {
        await onFinish(formattedValues);
      }
    } catch (error) {
      console.error("Submit error:", error);
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
      saveButtonProps={{
        ...saveButtonProps,
        children: "Tạo phòng",
      }}
    >
      {/* Hiển thị lỗi nếu có */}
      {formProps.form?.getFieldError?.("global")?.[0] && (
        <Alert
          message="Lỗi"
          description={formProps.form.getFieldError("global")?.[0]}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        {...formProps}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          status: "trống",
          amenities: [],
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
          <Card
            size="small"
            style={{ maxHeight: 300, overflow: "auto" }}
            loading={amenitiesQuery.isLoading}
          >
            {amenitiesQuery.isError && (
              <Alert message="Lỗi tải tiện nghi" type="error" />
            )}

            <Checkbox.Group style={{ width: "100%" }}>
              <Row gutter={[8, 8]}>
                {amenitiesData.map((amenity: Amenity) => (
                  <Col span={8} key={amenity.amenity_id}>
                    <Checkbox value={amenity.amenity_id}>
                      <Text>{amenity.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {amenity.category}
                      </Text>
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>

            {amenitiesData.length === 0 && !amenitiesQuery.isLoading && (
              <Text type="secondary">Không có tiện nghi nào</Text>
            )}
          </Card>
        </Form.Item>

        <Divider />

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={saveButtonProps.loading}
            >
              Tạo phòng
            </Button>
            <Button
              onClick={() => list("rooms")}
              disabled={saveButtonProps.loading}
            >
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Create>
  );
};
