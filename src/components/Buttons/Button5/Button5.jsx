import React from "react";
import "./Button5.css";

export default function Button5({ type, disabled, onButtonClick, name }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="btn btn-5 border-0 shadow-none"
      onClick={onButtonClick}
    >
      <span>{name}</span>
    </button>
  );
}
