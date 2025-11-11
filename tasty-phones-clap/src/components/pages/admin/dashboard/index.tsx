import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { useList } from "@refinedev/core";

export const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard Quản Trị</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng phòng" value={25} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Đặt phòng hôm nay" value={8} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Doanh thu" value={12500000} suffix="₫" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Khách hàng" value={45} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
