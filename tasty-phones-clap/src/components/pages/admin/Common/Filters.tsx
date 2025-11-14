import { Input, Select, Space } from "antd";
import { Form } from "antd/lib";
import React, { useState } from "react";

type BaseFilter = {
  name: string;
  placeholder?: string;
  label?: string;
};

type InputFilter = BaseFilter & {
  type: "input";
};

type FilterOptions = {
  label: string;
  value: string | number;
};

type SelectFilter = BaseFilter & {
  type: "select";
  options: FilterOptions[];
};

export type FilterConfig = SelectFilter | InputFilter;

type FilterProps = {
  filters: FilterConfig[];
  onchange: (values: Record<string, any>) => void;
};

const Filters: React.FC<FilterProps> = ({ filters, onchange }) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const handleChange = (name: string, value: any) => {
    const newValues = {
      ...values,
      [name]: value,
    };
    setValues(newValues);
    onchange(newValues);
  };
  return (
    <Space wrap>
      {filters.map((filter) => {
        if (filter.type === "input") {
          return (
            <>
              <Form.Item
                key={filter.name}
                label={filter.label || ""}
                style={{ marginBottom: 0 }}
                layout="vertical"
              >
                <Input
                  placeholder={filter.placeholder}
                  allowClear
                  onChange={(e) => {
                    handleChange(filter.name, e.target.value);
                  }}
                  style={{ width: "200px" }}
                />
              </Form.Item>
            </>
          );
        }

        if (filter.type === "select") {
          return (
            <>
              <Form.Item
                key={filter.name}
                label={filter.label || ""}
                style={{ marginBottom: 0 }}
                layout="vertical"
              >
                <Select
                  placeholder={filter.placeholder}
                  allowClear
                  options={filter.options}
                  style={{
                    width: "200px",
                  }}
                  onChange={(value) => {
                    handleChange(filter.name, value);
                  }}
                />
              </Form.Item>
            </>
          );
        }
      })}
    </Space>
  );
};

export default Filters;
