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
import dayjs from "dayjs";

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

  const onFinish = async (values: any) => {
    // Format ngày hết hạn
    const expiredAt = values.expired_at
      ? dayjs(values.expired_at).format("YYYY-MM-DD")
      : null;

    if (!expiredAt) {
      message.error("Vui lòng chọn ngày hết hạn!");
      return;
    }

    // Backend dùng 'after:today' → ngày phải > hôm nay (không = hôm nay)
    if (!dayjs(expiredAt).isAfter(dayjs(), "day")) {
      message.error("Ngày hết hạn phải từ ngày mai trở đi!");
      return;
    }

    // Payload tối giản - chỉ gửi những field thực sự thay đổi
    const payload: any = {
      code: (values.code || "").toUpperCase().trim(),
      min_price: values.min_price ?? 0,
    };

    // Chỉ thêm field giảm giá nếu có giá trị > 0
    if (values.discountType === "percent" && values.discount_percent > 0) {
      payload.discount_percent = values.discount_percent;
    } else if (values.discountType === "amount" && values.discount_amount > 0) {
      payload.discount_amount = values.discount_amount;
    }

    // Với update: chỉ gửi expired_at nếu thay đổi (tránh validate lại)
    if (editing) {
      const oldExpired = dayjs(editing.expired_at).format("YYYY-MM-DD");
      if (expiredAt !== oldExpired) {
        payload.expired_at = expiredAt;
      }
    } else {
      // Với create: luôn gửi expired_at
      payload.expired_at = expiredAt;
    }

    console.log("Payload gửi lên server:", payload); // Debug

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
      console.error("Lỗi chi tiết từ API:", err.response?.data);
      let errorMessage = "Có lỗi xảy ra khi lưu voucher";

      if (err.response?.data?.error?.details) {
        const details = err.response.data.error.details;
        const firstError = Object.values(details)[0]?.[0] || "";
        errorMessage = firstError || errorMessage;
      } else if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      }

      message.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/vouchers/${id}`);
      message.success("Xóa voucher thành công");
      fetchVouchers();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      await axiosInstance.patch(`/vouchers/${id}/status`);
      message.success("Cập nhật trạng thái thành công");
      fetchVouchers();
    } catch {
      message.error("Không thể cập nhật trạng thái");
    }
  };

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
          return (
            <Tag color="blue" style={{ fontSize: 14 }}>
              {record.discount_percent}%
            </Tag>
          );
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
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
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
                code: r.code,
                discountType: r.discount_percent
                  ? "percent"
                  : r.discount_amount
                  ? "amount"
                  : "percent",
                discount_percent: r.discount_percent || undefined,
                discount_amount: r.discount_amount || undefined,
                min_price: r.min_price,
                expired_at: r.expired_at
                  ? dayjs(r.expired_at).format("YYYY-MM-DD")
                  : undefined,
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

  // Component cho input phần trăm với cảnh báo
  const PercentInputWithWarning = () => {
    const discountPercent = Form.useWatch("discount_percent", form);

    return (
      <div>
        <InputNumber
          min={1}
          style={{ width: "100%" }}
          addonAfter="%"
          step={5}
          onKeyDown={(e) => {
            // Chỉ cho phép nhập số, dấu chấm và các phím điều hướng
            if (
              !/[0-9]|\.|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)
            ) {
              e.preventDefault();
            }
          }}
        />
        {discountPercent > 100 && (
          <div style={{ color: "#faad14", marginTop: 4, fontSize: 12 }}>
            ⚠️ Phần trăm giảm không được vượt quá 100%
          </div>
        )}
      </div>
    );
  };

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
            form.setFieldsValue({ discountType: "percent" });
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
          {/* MÃ VOUCHER */}
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[
              { required: true, message: "Vui lòng nhập mã voucher" },
              {
                pattern: /^[A-Z0-9]+$/,
                message:
                  "Chỉ cho phép chữ IN HOA và số, không dấu, không khoảng trắng",
              },
              { min: 3, max: 20, message: "Mã voucher từ 3 đến 20 ký tự" },
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

          {/* LOẠI GIẢM GIÁ */}
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

          {/* GIẢM GIÁ THEO LOẠI */}
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
                        {
                          required: true,
                          message: "Vui lòng nhập phần trăm giảm",
                        },
                        {
                          validator: (_, value) => {
                            if (
                              value === undefined ||
                              value === null ||
                              value === ""
                            ) {
                              return Promise.reject(
                                "Vui lòng nhập phần trăm giảm"
                              );
                            }
                            if (value < 1) {
                              return Promise.reject(
                                "Phần trăm giảm tối thiểu là 1%"
                              );
                            }
                            if (value > 100) {
                              return Promise.reject(
                                "Phần trăm giảm không được vượt quá 100%"
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <PercentInputWithWarning />
                    </Form.Item>
                  )}

                  {type === "amount" && (
                    <Form.Item
                      name="discount_amount"
                      label="Số tiền giảm"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số tiền giảm",
                        },
                        {
                          type: "number",
                          min: 1000,
                          message: "Tối thiểu 1.000₫",
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

          {/* ĐƠN TỐI THIỂU */}
          <Form.Item
            name="min_price"
            label="Đơn hàng tối thiểu"
            initialValue={0}
            rules={[
              { type: "number", min: 0, message: "Không được âm" },
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

          {/* NGÀY HẾT HẠN */}
          <Form.Item
            name="expired_at"
            label="Ngày hết hạn"
            rules={[
              { required: true, message: "Vui lòng chọn ngày hết hạn" },
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  if (dayjs(value).isBefore(dayjs().add(1, "day"), "day")) {
                    return Promise.reject(
                      new Error("Ngày hết hạn phải từ ngày mai trở đi")
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
