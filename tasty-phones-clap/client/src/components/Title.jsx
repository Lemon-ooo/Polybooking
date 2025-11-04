import React from "react";
import { Typography } from "antd";

const Title = ({ title, subTitle, align, font }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center ${
        align === "left" && "md:items-start md:text-left"
      }`}
    >
      <Typography.Title level={2} style={{ marginBottom: 8 }} className={font || "font-playfair"}>
        {title}
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginTop: 0, maxWidth: 696 }}>
        {subTitle}
      </Typography.Paragraph>
    </div>
  );
};

export default Title;
