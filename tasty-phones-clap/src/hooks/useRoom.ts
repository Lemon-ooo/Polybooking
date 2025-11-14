// src/hooks/useRooms.ts
import {
  useList,
  useOne,
  useCreate,
  useUpdate,
  useDelete,
} from "@refinedev/core";

export const useRooms = (id?: number) => {
  // Lấy danh sách phòng - kết nối API thực
  const {
    data: roomsData,
    isLoading: isLoadingList,
    isError: isErrorList,
  } = useList({
    resource: "rooms",
    pagination: { current: 1, pageSize: 10 },
  });

  // Lấy chi tiết 1 phòng
  const {
    data: roomDetail,
    isLoading: isLoadingOne,
    isError: isErrorOne,
  } = useOne({
    resource: "rooms",
    id: id,
  });

  // Thêm mới phòng
  const { mutate: createRoom, isLoading: isCreating } = useCreate();

  // Cập nhật phòng
  const { mutate: updateRoom, isLoading: isUpdating } = useUpdate();

  // Xóa phòng
  const { mutate: deleteRoom, isLoading: isDeleting } = useDelete();

  return {
    // List
    rooms: roomsData?.data || [],
    total: roomsData?.total || 0,
    isLoadingList,
    isErrorList,

    // Detail
    room: roomDetail?.data,
    isLoadingOne,
    isErrorOne,

    // Mutations
    createRoom: (variables: any) =>
      createRoom({ resource: "rooms", values: variables }),
    updateRoom: (id: number, variables: any) =>
      updateRoom({ resource: "rooms", id, values: variables }),
    deleteRoom: (id: number) => deleteRoom({ resource: "rooms", id }),

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
  };
};
