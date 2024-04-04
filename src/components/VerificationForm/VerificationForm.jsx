import React, { useEffect, useState } from "react";
import "./VerificationForm.css";
import useInput from "../useInput";
import {
  cityListService,
  countryListService,
  stateListService,
  userRegisterService,
} from "../../services";
import { jwt_decode, resHandler, throttle } from "../../../helper";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function VerificationForm(props) {
  const { value: name, bind: bindName, setValue: setName } = useInput("");
  const { value: email, bind: bindEmail, setValue: setEmail } = useInput("");
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
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState({
    name: false,
    email: false,
    state: false,
    city: false,
    pass: false,
    cpass: false,
  });
  const [errMessage, setErrorMessage] = useState({
    name: "",
    email: "",
    state: "",
    city: "",
    pass: "",
    cpass: "",
  });
  const [countryList, setCountryList] = useState();
  const [countryId, setCountryId] = useState("in");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrorTwo, setPasswordErrorTwo] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);
  const [stateList, setStateList] = useState();
  const [stateId, setStateId] = useState();
  const [cityList, setCityList] = useState();
  const [cityId, setCityId] = useState();

  const naviagate = useNavigate();
  useEffect(() => {
    getStateList(101);
  }, []);
  const getCountryList = async () => {
    await countryListService()
      .then((res) => {
        let { data, status, message } = resHandler(res);
        status && setCountryList(data);
      })
      .catch((err) => console.log(err));
  };

  const getStateList = async (params) => {
    const formData = new FormData();
    formData.append("country_id", params);
    await stateListService(formData)
      .then((res) => {
        let { data, status, message } = resHandler(res);
        status && setStateList(data);
      })
      .catch((err) => console.log(err));
  };
  const getcity = async (params) => {
    const formData = new FormData();
    formData.append("state_id", params);
    await cityListService(formData)
      .then((res) => {
        let { data, status, message } = resHandler(res);
        status && setCityList(data);
      })
      .catch((err) => console.log(err));
  };

  const handleCountry = (e) => {
    const selectedValue = e.target.value;
    const selectedOptionData = JSON.parse(selectedValue);
    setCountryId(selectedOptionData.name);
    getStateList(selectedOptionData.id);
  };

  const handleStateChnage = (e) => {
    const selectedValue = e.target.value;
    const selectedOptionData = JSON.parse(selectedValue);
    setStateId(selectedOptionData.name);
    getcity(selectedOptionData.id);
  };
  const handleCityChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOptionData = JSON.parse(selectedValue);
    setCityId(selectedOptionData.name);
  };

  const handleContinueClick = async (e) => {
    e.preventDefault();
    setPasswordError(false);
    setPasswordErrorTwo(false);
    setNameError(false);
    if (
      password == confirmPassword &&
      name.length >= 2 &&
      password.length >= 8
    ) {
      setPasswordError(false);
      setPasswordErrorTwo(false);
      let formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("mobile", props.phoneno);
      formData.append("password", password);
      formData.append("country", countryId);
      formData.append("state", stateId);
      formData.append("city", cityId);
      formData.append("device_id", 0);
      formData.append("is_social", 0);
      formData.append("device_token", 0);
      formData.append("otp", props.otp);
      await userRegisterService(formData).then((res) => {
        let { data, status, message } = resHandler(res);
        !status && message && toast.error(message);
        status && message && toast.success(message);
        status && jwt_decode(data.jwt);
        if(status){
          naviagate('/home')
        }
        status && localStorage.setItem("jwt", data.jwt);
        status &&
          setTimeout(() => {
            location.reload();
          }, 700);
      });
    } else {
      if (name.replace(/\s/g, "").length == 0) {
        setError({ ...error, name: true });
        setErrorMessage({ ...errMessage, name: "Enter your name" });
        return false;
      }

      if (email.replace(/\s/g, "").length == 0) {
        setError({ ...error, name: false, email: true });
        setErrorMessage({ ...errMessage, email: "Enter your Email ID" });
        return false;
      }
      const re = /\S+@\S+\.\S+/;
      if (re.test(email) == false) {
        setError({ ...error, name: false, email: true });
        setErrorMessage({ ...errMessage, email: "Enter valid Email ID" });
        return false;
      }

      if (stateId === undefined) {
        setError({ ...error, name: false, email: false, state: true });
        setErrorMessage({ ...errMessage, state: "Select your state" });
        return false;
      }
      if (cityId == undefined) {
        setError({
          ...error,
          name: false,
          email: false,
          state: false,
          city: true,
        });
        setErrorMessage({ ...errMessage, city: "Select your city" });
        return false;
      }

      if (password.replace(/\s/g, "").length == 0) {
        setError({
          ...error,
          name: false,
          email: false,
          state: false,
          city: false,
          pass: true,
        });
        setErrorMessage({ ...errMessage, pass: "Enter password" });
        return false;
      }

      if (password.length < 8) {
        setError({
          ...error,
          name: false,
          email: false,
          state: false,
          city: false,
          pass: true,
        });
        setErrorMessage({
          ...errMessage,
          pass: "Password should be at least 8 characters",
        });
        return false;
      }

      const p_pattern = /^(?!\s)(.*\S)?(?<!\s)$/;
      if (!p_pattern.test(password)) {
        setError({
          ...error,
          name: false,
          email: false,
          state: false,
          city: false,
          pass: true,
        });
        setErrorMessage({
          ...errMessage,
          pass: "Password not start & end with white space",
        });
        return false;
      }
      if (confirmPassword.replace(/\s/g, "").length == 0) {
        setError({
          name: false,
          email: false,
          state: false,
          city: false,
          pass: false,
          cpass: true,
        });
        setErrorMessage({ ...errMessage, cpass: "Enter confirm password" });
        return false;
      }
      if (password != confirmPassword) {
        setError({
          name: false,
          email: false,
          state: false,
          city: false,
          pass: false,
          cpass: true,
        });
        setErrorMessage({
          ...errMessage,
          cpass:
            "Password and confirm password not matched.. Please enter again",
        });
        return false;
      }
    }
  };

  const handleNameInput = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^A-Za-z\s'-.]/g, "");
    setName(sanitizedValue);
  };
  const checkName = (e) => {
    setName(name.trim());
    if (name.replace(/\s/g, "").length == 0) {
      setError({ ...error, name: true });
      setErrorMessage({ ...errMessage, name: "Enter your name" });
      return false;
    } else {
      setError({ ...error, name: false });
    }
  };

  const checkEmail = (e) => {
    setEmail(email.trim());
    if (email.replace(/\s/g, "").length == 0) {
      setError({ ...error, name: false, email: true });
      setErrorMessage({ ...errMessage, email: "Enter your Email ID" });
      return false;
    }
    const re = /\S+@\S+\.\S+/;
    if (re.test(email) == false) {
      setError({ ...error, name: false, email: true });
      setErrorMessage({ ...errMessage, email: "Enter valid Email ID" });
      return false;
    } else {
      setError({ ...error, email: false });
    }
  };

  const checkPassword = (e) => {
    if (password.replace(/\s/g, "").length == 0) {
      setError({
        ...error,
        name: false,
        email: false,
        state: false,
        city: false,
        pass: true,
      });
      setErrorMessage({ ...errMessage, pass: "Enter password" });
      return false;
    }

    if (password.length < 8) {
      setError({
        ...error,
        name: false,
        email: false,
        state: false,
        city: false,
        pass: true,
      });
      setErrorMessage({
        ...errMessage,
        pass: "Password should be at least 8 characters",
      });
      return false;
    }

    const p_pattern = /^(?!\s)(.*\S)?(?<!\s)$/;
    if (!p_pattern.test(password)) {
      setError({
        ...error,
        name: false,
        email: false,
        state: false,
        city: false,
        pass: true,
      });
      setErrorMessage({
        ...errMessage,
        pass: "Password not start & end with white space",
      });
      return false;
    } else {
      setError({ ...error, pass: false });
    }
  };
  const checkConformPassword = (e) => {
    if (confirmPassword.replace(/\s/g, "").length == 0) {
      setError({
        name: false,
        email: false,
        state: false,
        city: false,
        pass: false,
        cpass: true,
      });
      setErrorMessage({ ...errMessage, cpass: "Enter confirm password" });
      return false;
    }
    if (password != confirmPassword) {
      setError({
        name: false,
        email: false,
        state: false,
        city: false,
        pass: false,
        cpass: true,
      });
      setErrorMessage({
        ...errMessage,
        cpass: "Password and confirm password not matched.. Please enter again",
      });
      return false;
    } else {
      setError({ ...error, cpass: false });
    }
  };
  return (
    <div className="text-center widthModal">
      <h5 className=" fw-bold mb-3">Complete Your Profile!</h5>
      <form onSubmit={throttle(handleContinueClick, 2000)}>
        <div className="text-center">
          <div className="input-group verification-code--inputs mb-3 mx-auto">
            <input
              type="text"
              className="form-control shadow-none w-100 border"
              placeholder="Full Name"
              maxLength={30}
              value={name}
              onBlur={checkName}
              onChange={handleNameInput}
              pattern="^[A-Za-z\s]+$"
              autoFocus
            />
            {error.name && (
              <span className="error mb-0">{errMessage.name}</span>
            )}
          </div>
          <div className="input-group verification-code--inputs mb-3 mx-auto">
            <input
              type="email"
              className="form-control shadow-none w-100 border"
              placeholder="Email Address"
              maxLength={30}
              onBlur={checkEmail}
              {...bindEmail}
            />
            {error.email && (
              <span className="error mb-0">{errMessage.email}</span>
            )}
          </div>
          <div className="input-group verification-code--inputs mb-3 mx-auto">
            <input
              type="tel"
              className="form-control shadow-none w-100 border"
              placeholder="Mobile Number"
              value={`+91 ${props.phoneno}`}
              disabled
            />
          </div>
          <div className="input-group verification-code--inputs mb-3 mx-auto">
            <select
              className="form-select shadow-none border w-100"
              onChange={handleStateChnage}
              placeholder="state"
              defaultValue={""}
            >
              <option value="" disabled>
                State
              </option>
              {stateList &&
                stateList.map((item, i) => {
                  return (
                    <option value={JSON.stringify(item)} key={item.id}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
            {error.state && (
              <span className="error mb-0 statError">{errMessage.state}</span>
            )}
          </div>

          <div className="input-group verification-code--inputs mb-3 mx-auto">
            <select
              className="form-select shadow-none border w-100"
              placeholder="city"
              onChange={handleCityChange}
              defaultValue={""}
            >
              <option value="" disabled>
                City
              </option>
              {cityList &&
                cityList.map((item, i) => {
                  return (
                    <option value={JSON.stringify(item)} key={item.id}>
                      {item.name}
                    </option>
                  );
                })}
            </select>

            {error.city && (
              <span className="error mb-0">{errMessage.city}</span>
            )}
          </div>
          <div className="input-group verification-code--inputs inputs-pwd mb-3 mx-auto">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control inputs-pwd shadow-none w-100 pwd"
              placeholder="Password"
              onBlur={checkPassword}
              {...bindPassword}
            />
            <span
              className="cursor"
              onClick={(e) => {
                e.stopPropagation();
                setShowPassword(!showPassword);
              }}
            >
              {" "}
              <i
                className={`bi bi-eye${showPassword ? "-slash" : ""}`}
                id="togglePassword"
              ></i>
            </span>
            <br />
            {error.pass && (
              <span className="error mb-0">{errMessage.pass}</span>
            )}
          </div>
          <div className="input-group verification-code--inputs inputs-pwd mb-3 mx-auto d-block">
            <input
              type={showPasswordTwo ? "text" : "password"}
              className="form-control inputs-pwd shadow-none w-100 border pwd"
              name="confirmPassword"
              placeholder="Confirm Password"
              onBlur={checkConformPassword}
              {...bindConfirmPassword}
            />
            <span
              className="cursor"
              onClick={(e) => {
                e.stopPropagation();
                setShowPasswordTwo(!showPasswordTwo);
              }}
            >
              {" "}
              <i
                className={`bi bi-eye${showPasswordTwo ? "-slash" : ""}`}
                id="togglePasswordTwo"
              ></i>
            </span>

            {error.cpass && (
              <span className="error mb-0 errorPass">{errMessage.cpass}</span>
            )}
          </div>
        </div>

        <div className="text-center my-3">
          <input
            type="submit"
            className="btn btn-5 border-0 shadow-none"
            value="Submit"
            onClick={throttle(handleContinueClick, 2000)}
          />
        </div>
      </form>
    </div>
  );
}
