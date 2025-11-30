onConfirm={() => handleDelete(record.amenity_id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button danger size="small">Xóa</Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      {/* Modal Thêm / Sửa */}
      <Modal
        title={editing ? "Cập nhật tiện ích" : "Thêm tiện ích mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          setFileList([]);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Tên tiện ích"
            name="amenity_name"
            rules={[{ required: true, message: "Vui lòng nhập tên tiện ích!" }]}
          >
            <Input placeholder="VD: Wifi miễn phí" />
          </Form.Item>

          <Form.Item
            label="Ảnh tiện ích"
            rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList: newFileList }) => {
                setFileList(newFileList.slice(-1)); // chỉ giữ 1 ảnh
              }}
              beforeUpload={() => false} // ngăn upload tự động
              accept="image/*"
            >
              {fileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="Mô tả (không bắt buộc)" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả về tiện ích..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Amenities;