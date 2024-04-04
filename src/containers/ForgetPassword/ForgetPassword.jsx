import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "./ForgetPassword.css";
import OTPInput from "react-otp-input";
import AuthSection from "../../components/AuthSection/AuthSection";
import { useNavigate } from "react-router-dom";
import { resHandler, throttle } from "../../../helper";
import {
  sendVerificationOtpService,
  updatePasswordService,
} from "../../services";
import { toast } from "react-hot-toast";
import useInput from "../../components/useInput";
import Button5 from "../../components/Buttons/Button5/Button5";

export default function ForgetPassword() {
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const initialTime = 60;
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [otp, setOtp] = useState("");
  const {
    value: password,
    bind: bindPassword,
    setValue: setPassword,
  } = useInput("");
  const {
    value: confirmPassword,
    bind: bindConfirmPassword,
    setValue: setConfirmPassword,
  } = useInput("");
  const [invalidPatternError, setInvalidPatternError] = useState(false);
  const [mobileNumberError, setMobileNumberError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [otpError, setOtpError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (!isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(true);
    }

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const invalidPattern = /^0000000000$/;

  const handleSentOtpClick = async () => {
    setMobileNumberError(false);
    setInvalidPatternError(false);
    const phoneNumberWithoutPrefix = phoneNumber ? phoneNumber.slice(2) : "";
    if (!invalidPattern.test(phoneNumberWithoutPrefix)) {
      if (
        phoneNumberWithoutPrefix.length > 7 &&
        phoneNumberWithoutPrefix.length <= 15
      ) {
        const formData = new FormData();

        formData.append("mobile", phoneNumberWithoutPrefix);
        formData.append("resend", 0);
        formData.append("is_registration", 0);

        try {
          const res = await sendVerificationOtpService(formData);
          const { status, message } = resHandler(res);
          if (status) {
            toast.success(message);
            setOtpSent(!otpSent);
          } else {
            message && toast.error(message);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setMobileNumberError(true);
      }
    } else {
      setInvalidPatternError(true);
    }
  };

  const handleVerifyOtpClick = async () => {
    setOtpError(false);
    if (otp.length === 6) {
      const formData = new FormData();
      const phoneNumberWithoutPrefix = phoneNumber.slice(2);
      formData.append("mobile", phoneNumberWithoutPrefix);
      formData.append("resend", 0);
      formData.append("is_registration", 0);
      formData.append("otp", otp);

      try {
        const res = await sendVerificationOtpService(formData);
        const { status, message } = resHandler(res);
        if (status) {
          toast.success(message);
          setOtpVerified(true);
        } else {
          message && toast.error(message);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setOtpError(true);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const phoneNumberWithoutPrefix = phoneNumber.slice(2);
    formData.append("mobile", phoneNumberWithoutPrefix);
    formData.append("resend", 1);
    formData.append("is_registration", 1);

    try {
      const res = await sendVerificationOtpService(formData);
      const { status, message } = resHandler(res);
      if (status) {
        toast.success(message);
        setIsActive(false);
        setTimeRemaining(60);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePasswordClick = async (e) => {
    setPasswordError("");
    if (password.length >= 8) {
      if (password === confirmPassword) {
        e.preventDefault();
        const formData = new FormData();
        const phoneNumberWithoutPrefix = phoneNumber.slice(2);
        formData.append("mobile", phoneNumberWithoutPrefix);
        formData.append("otp", otp);
        formData.append("password", password);

        try {
          const res = await updatePasswordService(formData);
          const { status, message } = resHandler(res);
          if (status) {
            toast.success(message);
            navigate("/");
          } else {
            message && toast.error(message);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setPasswordError(
          "Password mismatch. Please re-enter your confirm password."
        );
      }
    } else {
      setPasswordError("Password length should be at least 8 characters.");
    }
  };

  const handleOtpChange = (newOtp) => {
    if (/^[0-9]*$/.test(newOtp)) {
      setOtp(newOtp);
    }
  };

  return (
    <AuthSection>
      {otpVerified ? (
        <div className="text-center">
          <h2 className="text-warning fw-bold mb-3">Create New Password </h2>
          <form id="form-init">
            <div className="text-center">
              <div className="input-group verification-code--inputs mb-3 mx-auto ">
                <input
                  type="password"
                  className="form-control shadow-nonwe"
                  placeholder="Password"
                  {...bindPassword}
                />
              </div>
              <div className="input-group verification-code--inputs mb-3 mx-auto ">
                <input
                  type="password"
                  className="form-control shadow-nonwe"
                  placeholder="Confirm Password"
                  {...bindConfirmPassword}
                />
              </div>
              {passwordError && <p className="error">{passwordError}</p>}
            </div>

            <div className="text-center my-3">
              <Button5
                type="button"
                name={"Continue"}
                onButtonClick={handleUpdatePasswordClick}
              />
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="text-center">
            {!otpSent ? (
              <h2 className="text-warning fw-bold">Reset your Password</h2>
            ) : (
              <h2 className="text-warning fw-bold">Enter OTP</h2>
            )}

            {!otpSent ? (
              <h6 className="text-muted">
                Reset Password with your mobile number!
              </h6>
            ) : (
              <h6 className="text-muted">
                Please enter the OTP to Verify Your Account!
              </h6>
            )}
          </div>
          <div className="py-3 ">
            <form id="form-init">
              {!otpSent ? (
                <>
                  <PhoneInput
                    countryCodeEditable={false}
                    country="in"
                    value={phoneNumber}
                    onChange={(phone) => setPhoneNumber(phone)}
                  />
                  {invalidPatternError && <p>Example: 5551234567</p>}
                  {mobileNumberError && (
                    <p className="error">Please enter your mobile number.</p>
                  )}
                </>
              ) : (
                <div className="verification-code--inputss text-center">
                  <OTPInput
                    value={otp}
                    onChange={handleOtpChange}
                    numInputs={6}
                    shouldAutoFocus={true}
                    renderInput={(props) => <input {...props} />}
                  />
                  {otpError && <p className="error">Please enter valid OTP.</p>}
                </div>
              )}
              {otpSent && (
                <div className="my-2">
                  {!isActive && (
                    <div id="countdown">{formatTime(timeRemaining)}</div>
                  )}
                  <p className="text-center">
                    Didn’t Receive OTP?{" "}
                    <button
                      className="resendotp"
                      type="button"
                      disabled={!isActive}
                      onClick={handleResendOtp}
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>
              )}
              <div className="text-center my-3">
                {!otpSent ? (
                  <Button5
                    type="button"
                    name={"Send OTP"}
                    onButtonClick={throttle(handleSentOtpClick, 2000)}
                  />
                ) : (
                  <Button5
                    type="button"
                    name={"Verify OTP"}
                    onButtonClick={throttle(handleVerifyOtpClick, 2000)}
                  />
                )}
              </div>
              <div className="mt-3 gobacklink text-center">
                <button
                  type="button"
                  className="changemobile fw-bold"
                  onClick={() => navigate("/login")}
                >
                  {" "}
                  Back To Login
                </button>
              </div>

              {otpSent && (
                <div className="mt-3 gobacklink text-center">
                  <button
                    type="button"
                    className="changemobile fw-bold"
                    onClick={() => setOtpSent(false)}
                  >
                    Change mobile number
                  </button>
                </div>
              )}
            </form>
          </div>
        </>
      )}
    </AuthSection>
  );
}
