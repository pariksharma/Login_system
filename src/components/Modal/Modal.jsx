import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, audio, children }) => {
  const close = (e) => {
    e.preventDefault();
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div>
        <div className={`custom-modal ${audio}`}>
          <div className="flex-end">
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={close}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-main">{children}</div>
        </div>
        <div className="bg" onClick={close} />
      </div>
    </>
  );
};

export default Modal;
