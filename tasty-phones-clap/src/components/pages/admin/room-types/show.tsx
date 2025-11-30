// import React from "react";
// import { Show, useShow, DateField } from "@refinedev/antd";
// import { Typography, Image, Tag } from "antd";

// const { Title, Text } = Typography;

// export const RoomTypeShow: React.FC = () => {
//   const { queryResult } = useShow();
//   const { data, isLoading } = queryResult;
//   const record = data?.data;

//   if (!record) return null;

//   return (
//     <Show isLoading={isLoading}>
//       <Title level={5}>ID</Title>
//       <Text>{record?.room_type_id}</Text>

//       <Title level={5}>Tên loại phòng</Title>
//       <Text>{record?.room_type_name}</Text>

//       <Title level={5}>Giá cơ bản</Title>
//       <Text>{Number(record?.base_price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Text>

//       <Title level={5}>Số khách tối đa</Title>
//       <Text>{record?.max_guests} người</Text>

//       <Title level={5}>Mô tả</Title>
//       <Text>{record?.description || "Không có mô tả"}</Text>

//       <Title level={5}>Số phòng hiện có</Title>
//       <Text>{record?.rooms_count}</Text>

//       <Title level={5}>Hình ảnh</Title>
//       <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
//         {record?.images && record.images.length > 0 ? (
//           record.images.map((img) => (
//             <Image
//               key={img.image_id}
//               src={img.image_url}
//               alt={record.room_type_name}
//               width={120}
//               height={80}
//               style={{ objectFit: "cover", borderRadius: 4 }}
//             />
//           ))
//         ) : (
//           <Text>Không có hình ảnh</Text>
//         )}
//       </div>

//       <Title level={5}>Ngày tạo</Title>
//       <DateField value={record?.created_at} />
//     </Show>
//   );
// };
