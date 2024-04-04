import React, { useEffect, useState } from "react";
import "./SignUp.css";
import AuthSection from "../../components/AuthSection/AuthSection";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// import Button4 from '../../components/Buttons/Button4/Button4';
import OTPInput from "react-otp-input";
import VerificationForm from "../../components/VerificationForm/VerificationForm";
import { sendVerificationOtpService } from "../../services";
import { resHandler, throttle } from "../../../helper";
import { toast } from "react-hot-toast";
import Button5 from "../../components/Buttons/Button5/Button5";
export default function SignUp() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const initialTime = 30; // 3 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerfied] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [InvalidPatternError, setInvalidPatternError] = useState(false);
  const [MobileNumberError, setMobileNumberError] = useState(false);
  const navigate = useNavigate();
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
    const phoneNumberWithoutCountry = value.replace(`${country.dialCode}`, "");
    setPhoneNumber(phoneNumberWithoutCountry);
    setCountryCode(country.dialCode);
  };

  const handleOtpChange = (newOtp) => {
    const numericOtp = newOtp.replace(/\D/g, "");
    setOtp(numericOtp);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const invalidPattern = /^0000000000$/;
  const handleSendOtpClick = (e) => {
    e.preventDefault();
    setMobileNumberError(false);
    setInvalidPatternError(false);
    if (!invalidPattern.test(phoneNumber)) {
      if (phoneNumber.length > 7 && phoneNumber.length <= 15) {
        setMobileError(false);
        setOtpError(false);
        const formData = new FormData();

        formData.append("mobile", phoneNumber);
        formData.append("resend", 0);
        formData.append("is_registration", 1);
        formData.append("c_code", ` +${countryCode}`);
        sendVerificationOtpService(formData)
          .then((res) => {
            const { status, data, message } = resHandler(res);
            !status && message && toast.error(message);
            status && toast.success(message);
            status && setOtpSent(!otpSent);
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
    console.log("first");
    setOtpError(false);
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
    }
  };
  const handleResendOtp = async (e) => {
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
          setTimeRemaining(60);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <AuthSection>
        {otpVerified ? (
          <VerificationForm phoneno={phoneNumber} otp={otp} />
        ) : (
          <>
            <div className="text-center">
              {!otpSent ? (
                <h2 className="text-warning fw-bold">Let’s get started</h2>
              ) : (
                <h2 className="text-warning fw-bold">OTP Verification</h2>
              )}

              {!otpSent ? (
                <h6 className="text-muted">
                  Sign Up with your mobile number to get started!
                </h6>
              ) : (
                <h6 className="text-muted">
                  Please enter the OTP to Verify Your Account!
                </h6>
              )}
            </div>
            <div className="py-3 ">
              <form id="form-init" className="signuppage-sec">
                {!otpSent ? (
                  <>
                    {" "}
                    <PhoneInput
                      countryCodeEditable={false}
                      country="in"
                      value={countryCode + phoneNumber}
                      onChange={handlePhoneChange}
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
                      onChange={handleOtpChange}
                      numInputs={6}
                      inputType="number"
                      renderInput={(props) => <input {...props} />}
                    />
                    {otpError && (
                      <p className="error mb-0">Please enter a valid OTP.</p>
                    )}
                  </div>
                )}
                <div className="text-center pg-termcondition my-4">
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
                      <p className="text-center">
                        Resend OTP in{" "}
                        <div id="countdown">{formatTime(timeRemaining)}</div>{" "}
                      </p>
                    ) : (
                      <p className="text-center">
                        {" "}
                        <button
                          className="resendotp"
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
                    <Button5
                      type="button"
                      name={"Verify OTP"}
                      onButtonClick={throttle(handleVerifyOtpClick, 2000)}
                    />
                  )}
                </div>

                <div className="mt-3 gobacklink text-center">
                  {!otpSent && (
                    <div>
                      Have an account?{" "}
                      <button
                        className="forgetpassword"
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>
                {otpSent && (
                  <div className="mt-3 gobacklink text-center">
                    <button
                      className="changemobile fw-bold"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp();
                        setPhoneNumber();
                      }}
                    >
                      {" "}
                      Change mobile number
                    </button>
                  </div>
                )}
              </form>
            </div>
          </>
        )}
      </AuthSection>
    </>
  );
}
