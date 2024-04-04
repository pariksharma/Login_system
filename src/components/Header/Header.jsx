import React, { useEffect, useState } from "react";
import "./Header.css";
import galaxy_logo from "../../assets/images/galaxy-logo.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import LoginButton from "../Buttons/LoginButton/LoginButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogoutService } from "../../services";
import { resHandler } from "../../../helper";
import UserProfileImage from "../../assets/images/user (4).png";
import toast from "react-hot-toast";
import { Nav, NavDropdown } from "react-bootstrap";
import LogoutPopup from "../UserDetails/LogoutPopup";
import LoginPageModal from "../../containers/Login/LoginPageModal";

export default function Header() {
  let isLoggedIn = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", changeWidth);
    return () => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);

  const handleLoginClick = () => {
    const close = document.querySelector('[data-bs-dismiss="offcanvas"]');
    setOpenLoginModal(true);
    close && close.click();
  };

  const handleLogoutButtonClick = async (e) => {
    e.preventDefault();
    await userLogoutService()
      .then((res) => {
        const { status, message } = resHandler(res);
        status && localStorage.clear();
        navigate('/');
        status && location.reload();
        status && dispatch(logoutAction());
        status &&
          setTimeout(() => {
            location.reload();
            toast.success(message);
          }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  $(document).ready(function () {
    $('[data-bs-toggle="offcanvas"]').on('click', function () {
      const target = $(this).data('bs-target');
      const overflow = $(this).data('bs-overflow');

      if ($(target).hasClass('show')) {
        if (overflow === 'scroll') {
          $('body').css('overflow', 'auto');
        } else {
          $('body').css('overflow', 'hidden');
        }
      } else {
        $('body').css('overflow', 'auto');
      }
    });
  });

  return (
    <>
      <LoginPageModal ModalOpen={openLoginModal} OpenModal={() => setOpenLoginModal(true)} CloseModal={() => setOpenLoginModal(false)} />
      <LogoutPopup ModalOpen={isOpenModal} CloseModal={() => setIsOpenModal(false)} />
      <header className="pg-top-header">
        <div className="container">
          <div className="row">
            <nav className="navbar backgroung-gif bg-body-tertiary navbar-expand-lg">
              <div className="h-logo p-1">
                <NavLink to='/' className="navbar-brand logo">
                  <img src={galaxy_logo} style={{ width: '150px' }} alt="Physics Galaxy" />
                </NavLink>
              </div>
              {screenWidth < 991 && (
                <button
                  className="navbar-toggler me-2"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasNavbar"
                  data-bs-overflow="scroll"
                  aria-controls="offcanvasNavbar"
                  aria-label="Toggle navigation"
                  aria-expanded="true"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              )}
              <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
              >
                <div className="offcanvas-header bg-grey">
                  <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                    <div className="h-logo p-1">
                      <Link className="navbar-brand logo" to="/">
                        <img src={galaxy_logo} alt="Physics Galaxy" />
                      </Link>
                    </div>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <ul className="navbar-nav mt-1 mx-3 pg-navigation">
                  <li className="nav-item">
                    <Link className="nav-link" to="/about-us">
                      About Us
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/privacypolicy">
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/refund-policies">
                      Refund Policies
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/termcondition">
                      Terms Condition
                    </Link>
                  </li>
                </ul>
                <div className="header-asdz">
                  {!isLoggedIn ? (
                    <LoginButton LoginClick={handleLoginClick} />
                  ) : (
                    <div className="pg-user-login-section">
                      <div className="d-flex align-items-center mx-2 log2 hidesn">
                        <Nav className="dropdown profile-navdropdown">
                          <NavDropdown
                            title={
                              <img
                                src={
                                  profilePicture
                                    ? profilePicture
                                    : UserProfileImage
                                }
                                alt="userprofile"
                                className="shadow"
                              />
                            }
                          >
                            <NavDropdown.Item
                              onClick={handleLogoutButtonClick}
                              className="dropdown-item drop-item"
                            >
                              <i
                                className="fa fa-sign-out me-2"
                                aria-hidden="true"
                              ></i>
                              Logout
                            </NavDropdown.Item>
                          </NavDropdown>
                        </Nav>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
