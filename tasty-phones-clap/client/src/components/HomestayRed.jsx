import React from "react";
import { assets, cities } from "../assets/assets";
import { Card, Row, Col, Form, Input, InputNumber, Select, Button, Typography } from "antd";

const HomestayRed = () => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70">
      <Card className="max-w-4xl w-full max-md:mx-2 rounded-xl overflow-hidden">
        <Row gutter={0}>
          <Col md={12} className="hidden md:block">
            <img src={assets.regImage} alt="reg-image" className="w-full h-full object-cover" />
          </Col>
          <Col xs={24} md={12}>
            <div className="p-8 md:p-10">
              <Typography.Title level={3} style={{ marginTop: 8 }}>
                Register Your Homestay
              </Typography.Title>
              <Form layout="vertical" requiredMark={false} style={{ marginTop: 8 }}>
                <Form.Item label="Homestay Name" name="name" rules={[{ required: true, message: "Please enter homestay name" }]}>
                  <Input placeholder="Type here" />
                </Form.Item>
                <Form.Item label="Phone" name="contact" rules={[{ required: true, message: "Please enter phone" }]}>
                  <InputNumber min={0} style={{ width: "100%" }} placeholder="Type here" />
                </Form.Item>
                <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter address" }]}>
                  <Input placeholder="Type here" />
                </Form.Item>
                <Form.Item label="City" name="city" rules={[{ required: true, message: "Please select city" }]}>
                  <Select placeholder="Select City" options={cities.map((c) => ({ label: c, value: c }))} />
                </Form.Item>
                <Button type="primary">Register</Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default HomestayRed;
