import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Space,
  Popconfirm,
  message,
  Tag,
  Radio,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "../../../../providers/data/axiosConfig";
import dayjs from "dayjs"; // ← thêm nếu bạn muốn xử lý ngày đẹp hơn

interface Voucher {
  id: number;
  code: string;
  discount_percent?: number;
  discount_amount?: number;
  min_price: number;
  expired_at: string;
  status: "active" | "inactive";
}

const VoucherPage: React.FC = () => {
  const [data, setData] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [form] = Form.useForm();

  /* ================= FETCH ================= */
  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/vouchers");
      setData(res.data.data ?? res.data);
    } catch {
      message.error("Không tải được danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const onFinish = async (values: any) => {
    // Chuẩn hóa dữ liệu trước khi gửi
    const payload = {
      ...values,
      // Chỉ giữ 1 trong 2 trường giảm giá
      discount_percent: values.discountType === "percent" ? values.discount_percent : null,
      discount_amount: values.discountType === "amount" ? values.discount_amount : null,
    };

    // Xóa các trường không cần thiết
    delete payload.discountType;

    try {
      if (editing) {
        await axiosInstance.put(`/vouchers/${editing.id}`, payload);
        message.success("Cập nhật voucher thành công");
      } else {
        await axiosInstance.post("/vouchers", payload);
        message.success("Tạo voucher thành công");
      }

      setOpen(false);
      setEditing(null);
      form.resetFields();
      fetchVouchers();
    } catch (err: any) {
      message.error(err.response?.data?.error?.message || "không được chùng mã voucher");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/vouchers/${id}`);
      message.success("Xóa voucher thành công");
      fetchVouchers();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (id: number) => {
    try {
      await axiosInstance.patch(`/vouchers/${id}/status`);
      message.success("Cập nhật trạng thái thành công");
      fetchVouchers();
    } catch {
      message.error("Không thể cập nhật trạng thái");
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      width: 140,
    },
    {
      title: "Giảm giá",
      width: 160,
      render: (_: any, record: Voucher) => {
        if (record.discount_percent && record.discount_percent > 0) {
          return <Tag color="blue" style={{ fontSize: 14 }}>{record.discount_percent}%</Tag>;
        }
        if (record.discount_amount && record.discount_amount > 0) {
          return (
            <Tag color="green" style={{ fontSize: 14 }}>
              {record.discount_amount.toLocaleString("vi-VN")}₫
            </Tag>
          );
        }
        return <Tag color="default">-</Tag>;
      },
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "min_price",
      width: 140,
      render: (v: number) => (v ? `${v.toLocaleString("vi-VN")}₫` : "-"),
    },
    {
      title: "Hết hạn",
      dataIndex: "expired_at",
      width: 140,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      width: 100,
      render: (_: any, r: Voucher) => (
        <Switch
          checked={r.status === "active"}
          onChange={() => toggleStatus(r.id)}
        />
      ),
    },
    {
      title: "Hành động",
      width: 100,
      render: (_: any, r: Voucher) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(r);
              setOpen(true);
              form.setFieldsValue({
                ...r,
                discountType: r.discount_percent ? "percent" : "amount",
                expired_at: dayjs(r.expired_at).format("YYYY-MM-DD"),
              });
            }}
          />
          <Popconfirm
            title="Xóa voucher này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(r.id)}
          >
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpen(true);
            setEditing(null);
            form.resetFields();
            form.setFieldsValue({ discountType: "percent" }); // mặc định chọn %
          }}
        >
          Thêm voucher
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />

      {/* ================= MODAL ================= */}
      <Modal
        title={editing ? "Cập nhật voucher" : "Thêm mới voucher"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        width={500}
      >
       <Form form={form} layout="vertical" onFinish={onFinish}>
  {/* ===== MÃ VOUCHER ===== */}
  <Form.Item
    name="code"
    label="Mã voucher"
    rules={[
      { required: true, message: "Vui lòng nhập mã voucher" },
      {
        pattern: /^[A-Z0-9]+$/,
        message: "Chỉ cho phép chữ IN HOA và số, không dấu, không khoảng trắng",
      },
      {
        min: 3,
        max: 20,
        message: "Mã voucher từ 3 đến 20 ký tự",
      },
    ]}
  >
    <Input
      placeholder="VD: SALE30, GIAM50K"
      maxLength={20}
      onChange={(e) =>
        form.setFieldValue("code", e.target.value.toUpperCase())
      }
    />
  </Form.Item>

  {/* ===== LOẠI GIẢM GIÁ ===== */}
  <Form.Item
    name="discountType"
    label="Loại giảm giá"
    rules={[{ required: true, message: "Vui lòng chọn loại giảm giá" }]}
  >
    <Radio.Group>
      <Radio value="percent">Giảm theo phần trăm</Radio>
      <Radio value="amount">Giảm số tiền cố định</Radio>
    </Radio.Group>
  </Form.Item>

  {/* ===== GIẢM GIÁ THEO LOẠI ===== */}
  <Form.Item
    noStyle
    shouldUpdate={(prev, cur) => prev.discountType !== cur.discountType}
  >
    {({ getFieldValue }) => {
      const type = getFieldValue("discountType");

      return (
        <>
          {type === "percent" && (
            <Form.Item
              name="discount_percent"
              label="Phần trăm giảm"
              rules={[
                { required: true, message: "Vui lòng nhập phần trăm giảm" },
                {
                  type: "number",
                  min: 1,
                  max: 100,
                  message: "Phần trăm giảm phải từ 1 đến 100",
                },
              ]}
            >
              <InputNumber
                min={1}
                max={100}
                style={{ width: "100%" }}
                addonAfter="%"
              />
            </Form.Item>
          )}

          {type === "amount" && (
            <Form.Item
              name="discount_amount"
              label="Số tiền giảm"
              rules={[
                { required: true, message: "Vui lòng nhập số tiền giảm" },
                {
                  type: "number",
                  min: 1000,
                  message: "Số tiền giảm tối thiểu là 1.000₫",
                },
              ]}
            >
              <InputNumber
                min={1000}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                addonAfter="₫"
              />
            </Form.Item>
          )}
        </>
      );
    }}
  </Form.Item>

  {/* ===== ĐƠN TỐI THIỂU ===== */}
  <Form.Item
    name="min_price"
    label="Đơn hàng tối thiểu"
    initialValue={0}
    rules={[
      {
        type: "number",
        min: 0,
        message: "Đơn hàng tối thiểu không được âm",
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          const discountAmount = getFieldValue("discount_amount");
          if (discountAmount && value < discountAmount) {
            return Promise.reject(
              new Error("Đơn tối thiểu phải lớn hơn số tiền giảm")
            );
          }
          return Promise.resolve();
        },
      }),
    ]}
  >
    <InputNumber
      min={0}
      style={{ width: "100%" }}
      formatter={(value) =>
        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
      addonAfter="₫"
    />
  </Form.Item>

  {/* ===== NGÀY HẾT HẠN ===== */}
  <Form.Item
    name="expired_at"
    label="Ngày hết hạn"
    rules={[
      { required: true, message: "Vui lòng chọn ngày hết hạn" },
      () => ({
        validator(_, value) {
          if (!value) return Promise.resolve();
          if (dayjs(value).isBefore(dayjs(), "day")) {
            return Promise.reject(
              new Error("Ngày hết hạn phải từ hôm nay trở đi")
            );
          }
          return Promise.resolve();
        },
      }),
    ]}
  >
    <Input type="date" />
  </Form.Item>
</Form>

      </Modal>
    </>
  );
};

export default VoucherPage;