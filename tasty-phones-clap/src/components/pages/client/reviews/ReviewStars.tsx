import { Rate } from "antd";

interface Props {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const ReviewStars = ({ value, onChange, disabled }: Props) => {
  return <Rate value={value} onChange={onChange} disabled={disabled} />;
};

export default ReviewStars;