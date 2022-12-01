import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInstance,
} from "axios";
import { message as Message } from "ant-design-vue";

// 服务器返回数据的类型
export interface Result<T = any> {
  code: number;
  message: string;
  data: T;
}

const service: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 3000,
});

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    Message.error(error.message);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, data } = response.data;
    // 根据自定义错误码判断请求是否成功
    if (code === 0) {
      // 将组件用的数据返回
      return data;
    } else {
      // 处理业务错误。
      Message.error(message);
      return Promise.reject(new Error(message));
    }
  },
  (error: AxiosError) => {
    // 处理 HTTP 网络错误
    let message = "";
    // HTTP 状态码
    const status = error.response?.status;
    switch (status) {
      case 401:
        message = "token 失效，请重新登录";
        // 这里可以触发退出的 action
        break;
      case 403:
        message = "拒绝访问";
        break;
      case 404:
        message = "请求地址错误";
        break;
      case 500:
        message = "服务器故障";
        break;
      default:
        message = "网络连接故障";
    }
    Message.error(message);
    return Promise.reject(error);
  }
);

// 封装的请求
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },
  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },
  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig) :Promise<T> {
    return service.put(url, data, config)
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig) : Promise<T> {
    return service.delete(url, config)
  }
}

export default service;