import React, { useEffect, useState } from "react";
import { Card, Spin, Button, Table, message, Modal } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../providers/data/axiosConfig";

export const DamageShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<any>(null);
  const [invoices, setInvoices] = useState([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get(`/damage-types/${id}`);
      setItem(res.data.data.type);
      setInvoices(res.data.data.invoices || []);
    } catch (err) {
      message.error("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Spin />;

  return (
    <div style={{ padding: 24 }}>
      <Button
        onClick={() => navigate(-1)}
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Card title="Thông tin Thiệt Hại" style={{ marginBottom: 20 }}>
        <p><b>Tên:</b> {item.name}</p>
        <p><b>Giá phạt:</b> {item.price.toLocaleString("vi-VN")}đ</p>

        {item.description && (
          <p><b>Mô tả:</b> {item.description}</p>
        )}

        <p>
          <b>Ngày tạo:</b> {new Date(item.created_at).toLocaleDateString("vi-VN")}
        </p>

        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/admin/damages/edit/${item.id}`)}
        >
          Sửa
        </Button>
      </Card>

      <Card title="Lịch sử phạt" bordered={false}>
        <Table rowKey="id" dataSource={invoices} pagination={{ pageSize: 10 }}>
          <Table.Column
            title="Booking"
            dataIndex={["booking", "id"]}
            render={(id) => `#${id}`}
          />

          <Table.Column
            title="Tiền phạt"
            dataIndex="amount"
            render={(v) => v.toLocaleString("vi-VN") + "đ"}
          />

          <Table.Column
            title="Ảnh"
            dataIndex="image_url"
            render={(url) =>
              url ? (
                <img
                  src={url}
                  alt="damage"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 6,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => setPreviewImage(url)}
                />
              ) : (
                <i>Không có</i>
              )
            }
          />

          <Table.Column
            title="Ngày"
            dataIndex="created_at"
            render={(date) => new Date(date).toLocaleString("vi-VN")}
          />
        </Table>
      </Card>

      {/* Modal Preview */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        centered
        width={500}
      >
        <img
          src={previewImage || ""}
          style={{
            width: "100%",
            borderRadius: 8,
            objectFit: "contain",
          }}
        />
      </Modal>
    </div>
  );
};

export default DamageShow;
