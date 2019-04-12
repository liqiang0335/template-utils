const Qs = require("querystring");
const axios = require("axios");
import ErrorCodes from "./ErrorCodes.json";
import { BASE_URL } from "./const";

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  },
  transformRequest: params => Qs.stringify(params)
});

export default http;

/**
 * 拦截请求
 */
http.interceptors.request.use(config => {
  // 处理config
  return config;
});

/**
 * 拦截响应
 */
http.interceptors.response.use(
  /**
   * 成功 : err.code >=200 || err.code <=300
   */
  function(res) {
    const body = res.data;
    if (body.status != 1) {
      const errorMessage = ErrorCodes[body.status]
        ? ErrorCodes[body.status]
        : body.status;
      console.log("HTTP: 处理服务器返回的错误码", errorMessage);
      return Promise.reject();
    }
    // 处理服务器返回的数据
    return Promise.resolve(body);
  },
  /**
   * 失败: status > 300
   */
  function(err) {
    if (err.code === "ECONNABORTED") {
      console.log("HTTP: 处理网络超时");
    }
    if (err.response) {
      const res = err.response;
      console.log(res.status); // 404, 500...
      if (res.status == "500") {
        console.log("HTTP: 处理服务器异常");
      }
    }
    return Promise.reject(err);
  }
);
