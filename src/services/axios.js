import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosClient.interceptors.request.use(
  (req) => {
    const jwt = localStorage.getItem("jwt");
    const user_id = localStorage.getItem("user_id");

    const headers = {
      Devicetype: 4,
      Version: import.meta.env.VITE_VERSION,
      Lang: 1,
      Appid: import.meta.env.VITE_APP_ID,
      Userid: user_id ? user_id : 0,
      ...(jwt && { Jwt: jwt }),
    };

    req.headers = headers;

    return req;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
