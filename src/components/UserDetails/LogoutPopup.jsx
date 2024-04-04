import React from "react";
import { toast } from "react-hot-toast";
import { userLogoutService } from "../../services";
import { resHandler } from "../../../helper";
import { useNavigate } from "react-router-dom";
import "./LogoutPopup.css";
import Modal1 from "../Modal1/Modal1";

export default function LogoutPopup({ ModalOpen, CloseModal }) {
  const navigate = useNavigate();

  const handleLogoutButtonClick = async (e) => {
    e.preventDefault();
    try {
      const res = await userLogoutService();
      const { status, message } = resHandler(res);
      if (status) {
        localStorage.clear();
        navigate("/");
        location.reload();
        toast.success(message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal1
      isOpen={ModalOpen}
      onClose={CloseModal}
      modalCenter={"modal-center"}
      modalCenter1={"md-main"}
    >
      <div className="row d-flex align-items-center justify-content-center">
        <div className="col-lg-12 col-md-12">
          <div className="cntrdiv text-center">
            <h4>Logout</h4>
            <h5>Are you sure you want to logout?</h5>
          </div>

          <div className="bilngdiv d-flex justify-content-center align-items-center pt-2 ">
            <div className="bilngdivfrst">
              <button onClick={CloseModal}>Cancel</button>
            </div>
            <div>
              <button className="btn1" onClick={handleLogoutButtonClick}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal1>
  );
}
