import { jwtDecode } from "jwt-decode";
import no_image from "./src/assets/images/no_image.png";

export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const isLogin = localStorage.getItem("jwt");
export const resHandler = (response) => {
  let status = response.data.status;
  let data;
  let message;
  if (status) {
    try {
      data = response.data.data;
      message = response.data.message;
    } catch (err) {
      console.log(err);
    }
  } else {
    message = response.data.message;

    if (response.data.auth_code == 100100) {
      localStorage.clear();
    }
  }
  return { status, data, message };
};

export const stringToFloat = (value) => {
  return Number(value).toFixed(2);
};

export const formatNumberWithCommasAndDecimals = (number) => {
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  return Number(number).toLocaleString(undefined, options);
};

export function convertToNestedStructure(inputArray) {
  const parentArray = inputArray.filter((item) => item.parent_id === "0");
  parentArray.map((item) => {
    item.id;
  });
}

export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const jwt_decode = async (token) => {
  const jwt_data = await jwtDecode(token);
  localStorage.setItem("user_id", jwt_data.id);
};

export const formatTimestampToDateString = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};

export function blobToURL(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? " PM" : " AM";

  return `${month}-${day}-${year} ${hours}:${minutes}${ampm}`;
}
export function formatTimestamponly(timestamp) {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? " PM" : " AM";

  return `${day}-${month}-${year} `;
}
export function formatOnlyTime(timestamp) {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? " PM" : " AM";

  return `${hours}:${minutes}${ampm}`;
}

export const parseJson = (json) => {
  return JSON.parse(json);
};

export const calculateTotalCoursePrice = (data) => {
  if (data && data.cartdata.length) {
    return data.cartdata.reduce((total, item) => {
      return total + parseFloat(item.course_price);
    }, 0);
  } else {
    return 0;
  }
};

export const calculateTotalDeliveryCharge = (data) => {
  if (data && data.cartdata.length) {
    return data.cartdata.reduce((total, item) => {
      return total + parseFloat(item.delivery);
    }, 0);
  } else {
    return 0;
  }
};

export const calculateTotalTaxCharge = (data) => {
  if (data && data.cartdata.length) {
    return data.cartdata.reduce((total, item) => {
      return total + parseFloat(item.tax);
    }, 0);
  } else {
    return 0;
  }
};

export function courseBulkArray(originalData) {
  return (
    originalData &&
    originalData.map((item) => ({
      course_id: item.course_id,
      course_price: item.course_price,
      tax: item.tax,
    }))
  );
}

export function convertTo12HourFormat(time24) {
  const [hours, minutes] = time24.split(":");
  const period = hours >= 12 ? "PM" : "AM";
  format;
  let hours12 = hours % 12;
  hours12 = hours12 === 0 ? 12 : hours12; // Handle midnight (0:00) as 12 AM
  const time12 = `${hours12}:${minutes} ${period}`;

  return time12;
}

export function isCurrentTimeBefore(upcomingTimestamp) {
  const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
  return currentTimestamp < upcomingTimestamp;
}

export function aesCbcEncryption(string) {
  const cbcKey = "1171086418644515_" + import.meta.env.VITE_APP_ID;
  const iniVector =
    "117#Nerglnw3@@OI)30@I*Dm'@@_" + import.meta.env.VITE_APP_ID;
  const encrypted = CryptoJS.AES.encrypt(string, cbcKey, {
    iv: iniVector,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const encryptedString = encrypted.toString();
  const additionalData = "1234567890123456";

  return `${encryptedString}:${additionalData}`;
}

export function image_check(url) {
  return !url ? no_image : url;
}
