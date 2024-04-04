import React, { useState } from "react";
import "./Login.css";
import AuthSection from "../../components/AuthSection/AuthSection";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useInput from "../../components/useInput";
import { userLoginService } from "../../services";
import { resHandler, throttle } from "../../../helper";
import toast from "react-hot-toast";
export default function Login() {
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
  const navigate = useNavigate();
  const handleSentOtpClick = () => {
    setOtpSent(!otpSent);
  };
  const invalidPattern = /^0000000000$/;
  const handleVerifyOtpClick = async (e) => {
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
            const redirectUrl = localStorage.getItem("redirect");
            status &&
              (redirectUrl
                ? (window.location.href = redirectUrl)
                : (window.location.href = "/"));
            status && toast.success(message);
            !status && message && toast.error(message);
            status && localStorage.removeItem("redirect");
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
    const phoneNumberWithoutCountry = value.replace(`${country.dialCode}`, "");
    setPhoneNumber(phoneNumberWithoutCountry);
    setCountryCode(country.dialCode);
  };
  return (
    <>
      <AuthSection>
        <div className="text-center">
          <h2 className="text-warning fw-bold">Login to your account</h2>

          <h6 className="text-muted">
            Login with your data that you entered during registration!
          </h6>
        </div>
        <div className="py-3">
          <form id="form-init" onSubmit={throttle(handleVerifyOtpClick, 2000)}>
            <div className="text-center">
              <div className="input-group verification-code--inputs mb-3 mx-auto">
                <PhoneInput
                  countryCodeEditable={false}
                  country="in"
                  value={countryCode + phoneNumber}
                  onChange={handleChangePhoneNumber}
                />
                {InvalidPatternError && <p>Example: 5551234567</p>}
                {MobileNumberError && (
                  <p className="error">Please enter valid mobile number.</p>
                )}
              </div>
              <div className="input-group verification-code--inputs inputs-pwd mb-3 mx-auto">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control inputs-pwd shadow-none w-100 pwd"
                  placeholder="Password"
                  maxLength={20}
                  {...bindPassword}
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
                onClick={() => navigate("/forget_password")}
              >
                Forgot Password?
              </button>
            </div>
            <div className="text-center my-3">
              <button
                type="submit"
                className="btn btn-5 border-0 shadow-none"
                onClick={throttle(handleVerifyOtpClick, 2000)}
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
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </AuthSection>
    </>
  );
}
