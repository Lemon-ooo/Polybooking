// src/hooks/useRooms.ts
import {
  useList,
  useOne,
  useCreate,
  useUpdate,
  useDelete,
} from "@refinedev/core";

export const useRooms = () => {
  // Lấy danh sách phòng
  const list = useList({ resource: "rooms" });

  // Lấy chi tiết 1 phòng
  const one = useOne({ resource: "rooms" });

  // Thêm mới
  const create = useCreate({ resource: "rooms" });

  // Cập nhật
  const update = useUpdate({ resource: "rooms" });

  // Xóa
  const remove = useDelete({ resource: "rooms" });

  return {
    list,
    one,
    create,
    update,
    remove,
  };
};
