import React, { useState, useImperativeHandle, forwardRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import api from "../../axios.js";
import { FormattedMessage } from "react-intl";
import "./addTaskModal.scss";

const CreateTaskModal = forwardRef(({ onSuccess }, ref) => {
  const [show, setShow] = useState(false);

  const [taskData, setTaskData] = useState({
    name: "",
    date: "",
    time: "",
    length: 60,
    note: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = () => {
    const now = moment();
    setTaskData({
      name: "",
      date: now.format("YYYY-MM-DD"),
      time: now.format("HH:mm"),
      length: 60,
      note: "",
    });
    setShow(true);
  };

  const resetForm = () => {
    setTaskData({
      name: "",
      date: "",
      time: "",
      length: 60,
      note: "",
    });
  };

  // Expose hàm show cho component cha
  useImperativeHandle(ref, () => ({
    show() {
      handleShow();
    },
  }));

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate cơ bản
    if (!taskData.name || !taskData.date || !taskData.time) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);

      // Gộp date và time thành chuẩn ISO string cho backend
      const dateTimeString = `${taskData.date}T${taskData.time}`;
      const isoDate = new Date(dateTimeString).toISOString();

      const payload = {
        name: taskData.name,
        date: isoDate,
        length: parseInt(taskData.length),
        note: taskData.note,
      };

      const res = await api.post("/api/task/create", payload);
      console.log(res);
      if (res && res.data && res.success) {
        if (onSuccess) {
          onSuccess();
        }
        handleClose();
      } else {
        alert("Failed to create task");
      }
    } catch (error) {
      console.error("Create task error:", error);
      alert(error.response?.data?.message || "Error creating task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="create-task-modal"
      centered
    >
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>
          <i className="fa-solid fa-calendar-plus me-2"></i>
          Create New Task
          {/* <FormattedMessage id="task.create_new" /> */}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Task Name */}
          <div className="form-group">
            <label>
              Task Name <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-heading"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="name"
                value={taskData.name}
                onChange={handleOnChange}
                placeholder="Enter task name..."
                autoFocus
              />
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Date <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-regular fa-calendar"></i>
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={taskData.date}
                    onChange={handleOnChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Time <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-regular fa-clock"></i>
                  </span>
                  <input
                    type="time"
                    className="form-control"
                    name="time"
                    value={taskData.time}
                    onChange={handleOnChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="form-group">
            <label>
              Duration (minutes) <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-hourglass-half"></i>
              </span>
              <input
                type="number"
                className="form-control"
                name="length"
                value={taskData.length}
                onChange={handleOnChange}
                min="15"
                step="15"
              />
            </div>
          </div>

          {/* Note */}
          <div className="form-group">
            <label>Note</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-sticky-note"></i>
              </span>
              <textarea
                className="form-control"
                name="note"
                value={taskData.note}
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
              <i className="fa-solid fa-check"></i> Create Task
            </span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateTaskModal;
