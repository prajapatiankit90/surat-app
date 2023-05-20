import axios from "axios";
import config from "./config";

const axiosApi = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Origin': 'http://localhost:8100',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  },
  dataType: 'json',
  timeout: 35000,

});



export const setAuthHeader = (token) => {
  axiosApi.defaults.headers.common.Authorization =
    token || localStorage.getItem("token");
};


// If Unauthorized Person then Remove token
axiosApi.interceptors.response.use(
  function (response) {
    if (config.API_URL) {

      return response;
    }

  },

  function (error) {
    if ((error && error.response && error.response.status === 401) || (error.response.status === 409)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);


setAuthHeader(localStorage.getItem("token"));

export default axiosApi;
