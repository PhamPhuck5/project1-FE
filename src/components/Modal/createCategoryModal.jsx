import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
} from "react"; // 1. Thêm useRef, useEffect
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import api from "../../axios.js";
import "./createCategoryModal.scss";
import { handleCreateCategory } from "../../containers/category.js";

const CreateCategoryModal = forwardRef(({ onSuccess }, ref) => {
  const [show, setShow] = useState(false);
  const [groupId, setGroupId] = useState(null);

  // 2. Khởi tạo abortControllerRef
  const abortControllerRef = useRef(new AbortController());

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // 3. Cleanup: Hủy request nếu component bị unmount đột ngột
  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  const handleClose = () => {
    console.log("aaaaa");
    // Hủy request đang chạy (nếu có) khi đóng modal
    abortControllerRef.current.abort();
    // Tạo lại controller mới cho lần mở modal tiếp theo
    abortControllerRef.current = new AbortController();
    console.log("bbbbbbbb");

    setShow(false);
    resetForm();
  };

  const handleShow = (selectedGroupId) => {
    setGroupId(selectedGroupId);
    setCategoryData({
      name: "",
      description: "",
    });
    setShow(true);
  };

  const resetForm = () => {
    setCategoryData({
      name: "",
      description: "",
    });
    setGroupId(null);
  };

  useImperativeHandle(ref, () => ({
    show(groupId) {
      handleShow(groupId);
    },
  }));

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!categoryData.name) {
      alert("Please enter category name");
      return;
    }
    if (!groupId) {
      alert("Group ID is missing");
      return;
    }

    try {
      setIsLoading(true);
      console.log("aaaaaaaaaaaaaaaa");
      const res = await handleCreateCategory(
        groupId,
        categoryData.name,
        categoryData.description
        // abortControllerRef.current.signal
      );
      console.log(res);

      if (res) {
        if (onSuccess) {
          await onSuccess(groupId);
        }
        handleClose();
      } else {
        // Lưu ý: Nếu request bị cancel, hàm handleCreateCategory
        // trả về undefined hoặc false tùy logic bạn viết
        // Chỉ alert khi thực sự có lỗi từ server
      }
    } catch (error) {
      if (error.name === "CanceledError") return; // Bỏ qua nếu là lỗi do chủ động hủy
      console.error("Create category error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="create-category-modal"
      centered
    >
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>
          <i className="fa-solid fa-folder-plus me-2"></i>
          Create New Category
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>
              Category Name <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-tag"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="name"
                value={categoryData.name}
                onChange={handleOnChange}
                placeholder="Enter category name..."
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-align-left"></i>
              </span>
              <textarea
                className="form-control"
                name="description"
                value={categoryData.description}
                onChange={handleOnChange}
                rows="3"
                placeholder="Optional description..."
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
              <i className="fa-solid fa-spinner fa-spin"></i> Creating...
            </span>
          ) : (
            <span>
              <i className="fa-solid fa-check"></i> Create Category
            </span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateCategoryModal;
