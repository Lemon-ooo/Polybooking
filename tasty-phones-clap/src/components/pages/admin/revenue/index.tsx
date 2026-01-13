import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  DatePicker,
  Table,
  message,
  Statistic,
  Divider,
  Spin,
} from "antd";
import {
  BarChartOutlined,
  CalendarOutlined,
  FundOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const RevenuePage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [rangeRevenue, setRangeRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [topRooms, setTopRooms] = useState([]);

  const fetchSummary = async () => {
    try {
      const res = await axios.get("/api/revenue/summary");
      if (res.data?.data) setSummary(res.data.data);
    } catch (err) {
      message.error("Lỗi tải thống kê!");
    }
  };

  const fetchTopRooms = async () => {
    try {
      const res = await axios.get("/api/revenue/top-room-types");
      if (res.data?.data) setTopRooms(res.data.data);
    } catch (err) {
      message.error("Lỗi tải top phòng!");
    }
  };

  const handleRange = async (values: any) => {
    if (!values) return;
    setLoading(true);

    try {
      const res = await axios.get("/api/revenue/range", {
        params: {
          from: values[0].format("YYYY-MM-DD"),
          to: values[1].format("YYYY-MM-DD"),
        },
      });

      if (res.data?.data) setRangeRevenue(res.data.data);
    } catch (err) {
      message.error("Lỗi lọc doanh thu!");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
    fetchTopRooms();

    // Load mặc định doanh thu tháng hiện tại
    handleRange([
      dayjs().startOf("month"),
      dayjs().endOf("month"),
    ]);
  }, []);

  const formatMoney = (v: number) => (v ? v.toLocaleString() + " đ" : "0 đ");

  const columns = [
    { title: "Loại phòng", dataIndex: "name" },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      render: (v: number) => <b style={{ color: "#1677ff" }}>{formatMoney(v)}</b>,
    },
    {
      title: "Số lượt đặt",
      dataIndex: "total_bookings",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3} style={{ marginBottom: 10 }}>
        <BarChartOutlined style={{ marginRight: 10 }} />
        Thống kê doanh thu
      </Title>

      {summary ? (
        <>
          <Row gutter={16}>
            <Col span={8}>
              <Card style={{ borderLeft: "4px solid #52c41a" }}>
                <Statistic
                  title="Doanh thu hôm nay"
                  value={summary.today.total_revenue}
                  valueStyle={{ color: "#52c41a" }}
                  prefix={<CalendarOutlined />}
                  formatter={(v) => formatMoney(Number(v))}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ borderLeft: "4px solid #1677ff" }}>
                <Statistic
                  title="Doanh thu tháng này"
                  value={summary.this_month.total_revenue}
                  valueStyle={{ color: "#1677ff" }}
                  prefix={<FundOutlined />}
                  formatter={(v) => formatMoney(Number(v))}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ borderLeft: "4px solid #fa8c16" }}>
                <Statistic
                  title="Doanh thu năm nay"
                  value={summary.this_year.total_revenue}
                  valueStyle={{ color: "#fa8c16" }}
                  prefix={<DollarOutlined />}
                  formatter={(v) => formatMoney(Number(v))}
                />
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Spin />
      )}

      <Divider />

      <Card>
        <Title level={5}>Lọc theo khoảng ngày</Title>
        <RangePicker
          defaultValue={[dayjs().startOf("month"), dayjs().endOf("month")]}
          onChange={handleRange}
          style={{ marginBottom: 10 }}
        />
      </Card>

      {rangeRevenue && (
        <Card style={{ marginTop: 20 }}>
          <Title level={5}>Kết quả lọc</Title>

          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Doanh thu phòng" value={rangeRevenue.room_revenue} formatter={(v) => formatMoney(Number(v))} />
            </Col>
            <Col span={8}>
              <Statistic title="Doanh thu dịch vụ" value={rangeRevenue.service_revenue} formatter={(v) => formatMoney(Number(v))} />
            </Col>
            <Col span={8}>
              <Statistic title="Tổng doanh thu" value={rangeRevenue.total_revenue} valueStyle={{ color: "#1677ff" }} formatter={(v) => formatMoney(Number(v))} />
            </Col>
          </Row>
        </Card>
      )}

      <Card style={{ marginTop: 20 }}>
        <Title level={5}>Top 10 loại phòng doanh thu cao nhất</Title>
        <Table columns={columns} dataSource={topRooms} rowKey="id" pagination={false} style={{ marginTop: 10 }} />
      </Card>
    </div>
  );
};

export default RevenuePage;
