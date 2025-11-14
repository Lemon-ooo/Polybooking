import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import Filters, { FilterConfig } from "../Common/Filters";
//import { useList } from "@refinedev/core";

export const AdminDashboard: React.FC = () => {
  const testFilters: FilterConfig[] = [
    {
      type: "input",
      name: "search",
      placeholder: "moi nhap vao",
      label: "Tim kiem",
    },
    {
      type: "select",
      name: "isActive",
      placeholder: "moi chon",
      options: [
        { label: "all", value: 0 },
        { label: "hoat dong", value: 1 },
      ],
      label: "Trang thai",
    },
  ];
  const handleGetValueFilter = (valueFIlter) => {
    console.log(valueFIlter);
  };
  return (
    <div>
      <h1>Dashboard Quản Trị</h1>
      <Filters filters={testFilters} onchange={handleGetValueFilter} />
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
