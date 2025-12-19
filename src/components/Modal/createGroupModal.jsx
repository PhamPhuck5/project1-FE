import React, { useState, useImperativeHandle, forwardRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import api from "../../axios.js";
import "./createGroupModal.scss";

const CreateGroupModal = forwardRef(({ onSuccess }, ref) => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
  });

  const handleClose = () => {
    setShow(false);
    setGroupData({ name: "", description: "" });
  };

  const handleShow = () => setShow(true);

  // Cho phép component cha gọi hàm show()
  useImperativeHandle(ref, () => ({
    show() {
      handleShow();
    },
  }));

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!groupData.name || !groupData.description) {
      alert("Vui lòng điền đầy đủ tên nhóm và mô tả.");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        name: groupData.name,
        description: groupData.description,
        createDate: new Date(),
      };

      const res = await api.post("/api/group/create", payload);

      if (res) {
        handleClose();
        if (res.success) {
          onSuccess();
        }
      } else {
        alert(res.data?.message || "Tạo nhóm thất bại");
      }
    } catch (error) {
      console.error("Create group error:", error);
      alert(error.response?.data?.message || "Lỗi server khi tạo nhóm");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="create-group-modal"
      centered
    >
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>
          <i className="fa-solid fa-users-rectangle"></i>
          Tạo Nhóm Mới
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>
              Tên nhóm <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-signature"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="name"
                value={groupData.name}
                onChange={handleOnChange}
                placeholder="VD: Cộng đồng ReactJS..."
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Mô tả <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-file-pen"></i>
              </span>
              <textarea
                className="form-control"
                name="description"
                value={groupData.description}
                onChange={handleOnChange}
                rows="3"
                placeholder="Mô tả mục đích hoạt động của nhóm..."
              ></textarea>
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          className="btn-confirm"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <span>
              <i className="fa-solid fa-spinner fa-spin"></i> Đang tạo...
            </span>
          ) : (
            <span>
              <i className="fa-solid fa-check"></i> Xác nhận
            </span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateGroupModal;
