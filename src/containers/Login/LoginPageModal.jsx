import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import "./LoginPageModal.css";
import toast from "react-hot-toast";
import { sendVerificationOtpService, userLoginService } from "../../services";
import { jwt_decode, resHandler, throttle } from "../../../helper";
import useInput from "../../components/useInput";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import OTPInput from "react-otp-input";
import "react-phone-input-2/lib/style.css";
import VerificationForm from "../../components/VerificationForm/VerificationForm";
import { useEffect } from "react";
import Button5 from "../../components/Buttons/Button5/Button5";
import ForgetPassModal from "./ForgetPassModal";
export default function LoginPageModal({ ModalOpen, CloseModal, OpenModal }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const {
    value: password,
    bind: bindPassword,
    setValue: setPassword,
  } = useInput("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [MobileNumberError, setMobileNumberError] = useState(false);
  const [InvalidPatternError, setInvalidPatternError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordlengthError, setPasswordlengthError] = useState(false);
  const [isSignUpModal, setIsSignUpModal] = useState(false);
  const navigate = useNavigate();
  const handleSentOtpClick = () => {
    setOtpSent(!otpSent);
  };

  const initialTime = 30; // 3 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [otpVerified, setOtpVerfied] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otpErrorEmpty, setOtpErrorEmpty] = useState(false);
  const invalidPattern = /^0000000000$/;
  const [isOpenForgetModal, setIsOpenForgetModal] = useState(false);
  useEffect(() => {
    let interval;
    if (otpSent) {
      if (!isActive && timeRemaining > 0) {
        interval = setInterval(() => {
          setTimeRemaining((prevTime) => prevTime - 1);
        }, 1000);
      } else if (timeRemaining === 0) {
        setIsActive(true);
      }
    }
    return () => clearInterval(interval);
  }, [timeRemaining, otpSent]);

  const handlePhoneChange = (value, country) => {
    setMobileError(false);
    const phoneNumberWithoutCountry = value.replace(`${country.dialCode}`, "");
    setPhoneNumber(phoneNumberWithoutCountry);
    setCountryCode(country.dialCode);
  };

  const handleOtpChange = (newOtp) => {
    setOtp(newOtp);
  };
  const hankdk = (e) => {
    if (e.key === "Enter") {
      handleLoginSubmit(e);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const handleSendOtpClick = (e) => {
    e.preventDefault();
    setMobileNumberError(false);
    setInvalidPatternError(false);
    if (!invalidPattern.test(phoneNumber)) {
      if (phoneNumber.length >= 7 && phoneNumber.length <= 15) {
        setMobileError(false);
        setOtpError(false);
        const formData = new FormData();
        formData.append("mobile", phoneNumber);
        formData.append("resend", 0);
        formData.append("is_registration", 1);
        formData.append("c_code", `+${countryCode}`);
        sendVerificationOtpService(formData)
          .then((res) => {
            const { status, data, message } = resHandler(res);
            !status && message && toast.error(message);
            status && toast.success(message);
            status && setOtpSent(!otpSent);
            status && setTimeRemaining(30);
            status && setIsActive(false);
          })
          .catch((err) => console.log(err));
      } else {
        setMobileNumberError(true);
      }
    } else {
      setInvalidPatternError(true);
    }
  };
  const handleVerifyOtpClick = async () => {
    setOtpError(false);

    if (otp == undefined) {
      setOtpErrorEmpty(true);
      return false;
    }
    if (otp.length >= 6) {
      const formData = new FormData();
      const phoneNumberWithoutPrefix = phoneNumber.slice(2);
      formData.append("mobile", phoneNumber);
      formData.append("resend", 0);
      formData.append("is_registration", 1);
      formData.append("c_code", countryCode);
      formData.append("otp", otp);
      await sendVerificationOtpService(formData)
        .then((res) => {
          const { status, data, message } = resHandler(res);
          !status && message && toast.error(message);
          status && toast.success(message);
          status && setOtpVerfied(true);
          !status && message && message == "OTP expired" && location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      setOtpError(true);
      setOtpErrorEmpty(false);
    }
  };
  const handleResendOtp = async (e) => {
    setOtpError(false);
    setOtpErrorEmpty(false);
    e.preventDefault();
    const formData = new FormData();
    const phoneNumberWithoutPrefix = phoneNumber.slice(2);
    formData.append("mobile", phoneNumber);
    formData.append("resend", 1);
    formData.append("is_registration", 1);
    formData.append("c_code", countryCode);
    await sendVerificationOtpService(formData)
      .then((res) => {
        const { status, data, message } = resHandler(res);
        !status && message && toast.error(message);
        if (status) {
          toast.success(message);
          setIsActive(false);
          setTimeRemaining(30);
          setOtp();
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMobileNumberError(false);
    setInvalidPatternError(false);
    setPasswordError(false);
    setPasswordlengthError(false);
    if (!invalidPattern.test(phoneNumber)) {
      if (
        phoneNumber.length > 7 &&
        phoneNumber.length <= 15 &&
        password.length >= 8
      ) {
        const formData = new FormData();
        formData.append("device_id", "0");
        formData.append("mobile", phoneNumber);
        formData.append("is_social", 0);
        formData.append("c_code", countryCode);
        formData.append("password", password);

        await userLoginService(formData)
          .then((res) => {
            let { status, data, message } = resHandler(res);
            status && localStorage.setItem("jwt", data.jwt);
            status && jwt_decode(data.jwt);
            status && navigate("/home");
            status && toast.success(message);
            !status && message && toast.error(message);
          })
          .catch((err) => console.log(err));
      } else {
        if (!password.length) {
          setPasswordError(true);
        } else if (password.length < 8) {
          setPasswordlengthError(true);
        }
        if (phoneNumber.length < 7 || phoneNumber.length > 15) {
          setMobileNumberError(true);
        }
      }
    } else {
      setInvalidPatternError(true);
    }
  };

  const handleChangePhoneNumber = (value, country) => {
    setMobileError(false);
    const phoneNumberWithoutCountry = value.replace(`${country.dialCode}`, "");
    setPhoneNumber(phoneNumberWithoutCountry);
    setCountryCode(country.dialCode);
  };

  const handleOTPVerify = (e) => {
    e.preventDefault();
    throttle(handleLoginSubmit, 2000);
  };

  return (
    <>
      {isOpenForgetModal && (
        <ForgetPassModal
          backToLogin={() => {
            setIsOpenForgetModal(false);
            OpenModal();
          }}
          ModalOpen={isOpenForgetModal}
          CloseModal={() => {
            setIsOpenForgetModal(false);
          }}
        />
      )}
      <Modal
        isOpen={ModalOpen}
        onClose={() => {
          CloseModal();
          setIsSignUpModal(false);
        }}
      >
        {isSignUpModal ? (
          <>
            {otpVerified ? (
              <VerificationForm
                phoneno={phoneNumber}
                countryCode={countryCode}
                otp={otp}
              />
            ) : (
              <>
                <div className="widthModal">
                  <div className="text-center login_content">
                    {!otpSent ? (
                      <h2 className=" fw-bold">Let’s get started!</h2>
                    ) : (
                      <h2 className=" fw-bold">OTP Verification</h2>
                    )}
                    {!otpSent ? (
                      <h6 className="text-muted px-3">
                        Signup with your mobile number to get started.
                      </h6>
                    ) : (
                      <h6 className="text-muted">
                        A verification code has been sent to your mobile +91{" "}
                        {phoneNumber}
                      </h6>
                    )}
                  </div>
                  <div className="py-3 ">
                    <form
                      className="form-init signuppage-sec"
                      onSubmit={handleOTPVerify}
                    >
                      {!otpSent ? (
                        <>
                          {" "}
                          <PhoneInput
                            countryCodeEditable={false}
                            country="in"
                            value={countryCode + phoneNumber}
                            onChange={handlePhoneChange}
                            inputProps={{
                              autoFocus: true,
                              required: true,
                            }}
                            onEnterKeyPress={throttle(
                              (e) => handleSendOtpClick(e),
                              2000
                            )}
                          />
                          {InvalidPatternError && <p>Example: 1234567890</p>}
                          {MobileNumberError && (
                            <p className="error">
                              Mobile number should be 7 to 10 digits long.
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="verification-code--inputss shadow-none">
                          <OTPInput
                            value={otp}
                            shouldAutoFocus={true}
                            onChange={handleOtpChange}
                            inputType="number"
                            numInputs={6}
                            renderInput={(props) => <input {...props} />}
                          />

                          {otpErrorEmpty && (
                            <p className="error otpErrorSen mb-0">
                              Please Enter OTP.
                            </p>
                          )}
                          {otpError && (
                            <p className="error otpErrorSen mb-0">
                              Please Enter a Valid OTP.
                            </p>
                          )}
                        </div>
                      )}
                      <div className="text-center pg-termcondition my-0 mt-2">
                        {!otpSent && (
                          <h6 className="text-muted">
                            By continuing, I agree to{" "}
                            <Link to="/termcondition" target="blank">
                              {" "}
                              Terms and Conditions
                            </Link>{" "}
                            &{" "}
                            <Link to="/privacypolicy" target="blank">
                              Privacy Policy
                            </Link>
                          </h6>
                        )}
                      </div>
                      {otpSent && (
                        <div className="my-2">
                          {!isActive ? (
                            <p className="text-end countTimerOtp">
                              <p>Resend OTP: {formatTime(timeRemaining)} </p>
                            </p>
                          ) : (
                            <p className="text-end">
                              {" "}
                              <button
                                className="resendotp"
                                type="button"
                                disabled={!isActive}
                                onClick={handleResendOtp}
                              >
                                Resend OTP
                              </button>
                            </p>
                          )}
                        </div>
                      )}
                      <div className="text-center my-3">
                        {!otpSent ? (
                          <Button5
                            type="button"
                            name={"Send OTP"}
                            onButtonClick={throttle(
                              (e) => handleSendOtpClick(e),
                              2000
                            )}
                          />
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-5 border-0 shadow-none"
                            onClick={throttle(handleVerifyOtpClick, 2000)}
                          >
                            <span>Verify OTP</span>
                          </button>
                        )}
                      </div>

                      <div className="mt-3 gobacklink text-center">
                        {!otpSent && (
                          <p>
                            Have an account?{" "}
                            <button
                              className="forgetpassword"
                              onClick={() => setIsSignUpModal(false)}
                            >
                              Login
                            </button>
                          </p>
                        )}
                      </div>
                      {otpSent && (
                        <div className="mt-3 gobacklink text-center">
                          <button
                            type="button"
                            className="changemobile fw-bold"
                            onClick={() => {
                              setOtpSent(false);
                              setOtp();
                              setPhoneNumber();
                            }}
                          >
                            Change Mobile Number
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="widthModal">
            <div className="login_content accountContent">
              <h2 className="text-center fw-bold">Login to your account!</h2>
              <p className="text-center">
                Login with your data that you entered during
                <br />
                registration.
              </p>
              <div className="py-3">
                <form
                  className="form-init"
                  onSubmit={throttle(handleLoginSubmit, 2000)}
                >
                  <div className="text-center">
                    <div className="input-group verification-code--inputs mx-auto mb-2">
                      <PhoneInput
                        countryCodeEditable={false}
                        country="in"
                        value={countryCode + phoneNumber}
                        onChange={handleChangePhoneNumber}
                        inputProps={{
                          required: true,
                          autoFocus: true,
                        }}
                      />
                      {InvalidPatternError && <p>Example: 5551234567</p>}
                      {MobileNumberError && (
                        <p className="error">
                          Please enter valid mobile number.
                        </p>
                      )}
                    </div>
                    <div className="input-group verification-code--inputs inputs-pwd mx-auto ">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control inputs-pwd shadow-none w-100 pwd"
                        placeholder="Password"
                        maxLength={20}
                        {...bindPassword}
                        onKeyDown={(e) => {
                          hankdk(e);
                        }}
                      />
                      <span
                        className="cursor"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {" "}
                        <i
                          className={`bi bi-eye${showPassword ? "-slash" : ""}`}
                          id="togglePassword"
                        ></i>
                      </span>
                      <br />
                      {passwordError && (
                        <p className="error">Please enter your password.</p>
                      )}
                      {passwordlengthError && (
                        <p className="error">
                          Password must be at least 8 characters long.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <button
                      type="button"
                      className="forgetpassword"
                      onClick={() => {
                        setIsOpenForgetModal(true);
                        CloseModal();
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="text-center my-3">
                    <button
                      type="button"
                      className="btn btn-5 border-0 shadow-none"
                      onClick={throttle(handleLoginSubmit, 2000)}
                    >
                      <span>Login</span>
                    </button>
                  </div>
                  <div className="mt-3 gobacklink text-center">
                    <p>
                      Don’t have an account?{" "}
                      <button
                        type="button"
                        className="forgetpassword"
                        onClick={() => setIsSignUpModal(true)}
                      >
                        Signup
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
