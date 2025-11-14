import React, { useState, useEffect } from "react";
import {
  Typography,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
} from "antd";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import heroImage from "../../../../assets/heroImage.png";

// @ts-ignore - assets.js không có type definitions
import { cities, assets } from "../../../../assets/assets";

const { Title, Paragraph, Text } = Typography;

export const ClientDashboard: React.FC = () => {
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onFinish = (values: any) => {
    // TODO: hook search action
    console.log("Search params:", values);
  };

  return <div></div>;
};
