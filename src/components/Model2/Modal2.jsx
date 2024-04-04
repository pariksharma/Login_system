import React from "react";
import "./Model2.css";

const Modal2 = ({ isOpen, onClose, children }) => {
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
    <div>
      <div className="custom-modal1">
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
  );
};

export default Modal2;
