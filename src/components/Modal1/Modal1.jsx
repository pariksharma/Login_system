import React from "react";
import "./Modal1.css";

const Modal1 = ({ isOpen, onClose, modalCenter, modalCenter1, children }) => {
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
        <div className={`custom-modal1 ${modalCenter}`}>
          <div className={`modal-main ${modalCenter1}`}>{children}</div>
        </div>
        <div className="bg" onClick={close} />
      </div>
    </>
  );
};

export default Modal1;
