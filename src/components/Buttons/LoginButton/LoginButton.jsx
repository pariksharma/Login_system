import React from "react";
import "./LoginButton.css";

export default function LoginButton({ LoginClick }) {
  const handleClick = () => {
    LoginClick();
  };

  return (
    <div className="mx-2 log log3 pg-login">
      <button
        type="button"
        className="custom-btn btn-3 shadow font-heading"
        id="loginbtn"
        onClick={handleClick}
      >
        <span>Login/Register</span>
      </button>
    </div>
  );
}
