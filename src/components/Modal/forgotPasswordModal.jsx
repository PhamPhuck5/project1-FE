import { useState, useImperativeHandle, forwardRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import "./forgotPasswordModal.scss";
import { FormattedMessage } from "react-intl";
import { changePassword } from "../../containers/auth/authContainer";
const ForgotPasswordModal = forwardRef((prop, ref) => {
  const [email, setEmail] = useState();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useImperativeHandle(ref, () => ({
    show() {
      handleShow();
    },
  }));

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>
          <div className="ConfirmModal">
            <div style={{ padding: "0em" }}>
              <FormattedMessage id="common.forgotpassword" />
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body">
        <div className="ConfirmModal">
          <form onSubmit={(e) => e.preventDefault()} style={{ padding: "1em" }}>
            <label>Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="ConfirmModal" style={{ width: "100%" }}>
          <Button
            style={{
              width: "100%",
              maxWidth: "150px",
              backgroundColor: "blue",
              color: "white",
              height: "3em",
              margin: "auto",
              display: "block",
            }}
            onClick={async () => {
              let res = await changePassword(email);
              if (!res.ok) {
                alert(res.message);
              }
              handleClose();
            }}
          >
            <FormattedMessage id="common.forgotpassword" />
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
});

export default ForgotPasswordModal;
