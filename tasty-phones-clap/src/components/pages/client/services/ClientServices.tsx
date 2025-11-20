import React, { useEffect, useState } from "react";
import { Spin, Alert, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ClientServices.css";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image: string;
}

const ClientServices: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/services")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setServices(data);
      })
      .catch(() => setError("Không thể tải dịch vụ."))
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (path: string) => {
    if (!path) return "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg";
    if (path.startsWith("http")) return path;
    return `http://localhost:8000${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <div className="services-page">
      {/* ==================== HERO BANNER – GIỐNG HỆT TRANG ROOMS ==================== */}
      <section className="services-hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Dịch Vụ</h1>
          <p className="hero-subtitle">Trải nghiệm đẳng cấp thượng lưu</p>
        </div>
      </section>

      {/* ==================== DANH SÁCH DỊCH VỤ ==================== */}
      <section className="services-templatemo">
        {loading ? (
          <div className="loading-wrapper">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message="Lỗi" description={error} type="error" showIcon className="max-w-2xl mx-auto my-20" />
        ) : services.length === 0 ? (
          <Empty description="Chưa có dịch vụ nào" className="py-40" />
        ) : (
          services.map((sv, index) => (
            <div
              key={sv.id}
              className={`service-block ${index % 2 === 1 ? "reverse" : ""}`}
              onClick={() => {
                navigate(`/client/services/${sv.id}`);
                window.scrollTo(0, 0);
              }}
            >
              {/* Ảnh */}
              <div className="block-image">
                <img
                  src={getImageUrl(sv.image)}
                  alt={sv.name}
                  onError={(e) => (
                    (e.target as HTMLImageElement).src =
                      "https://ruedelamourhotel.com/wp-content/uploads/2025/05/spa1.jpg"
                  )}
                />
              </div>

              {/* Khung nội dung trắng kem */}
              <div
                className="block-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3>{sv.name}</h3>
                <p>
                  {sv.description.length > 150
                    ? sv.description.substring(0, 150) + "..."
                    : sv.description}
                </p>
                <button
                  className="learn-more"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/client/services/${sv.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  learn more
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ClientServices;