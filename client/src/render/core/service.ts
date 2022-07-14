import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const instance = axios.create({
    baseURL: "http://localhost:12345/api",
    timeout: 30000,
});

instance.interceptors.request.use(
    config => {
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

instance.interceptors.response.use(
    res => {
        return res;
    },
    err => {
        let message = "";
        if (err.response == null) {
            message = "请求没有响应";
        } else {
            const {
                response: { status },
            } = err;
            switch (status) {
                case 400:
                    return (message = "客户端请求的语法错误，服务器无法理解");
                case 401:
                    return (message = "请求要求用户的身份认证");
                case 403:
                    return (message =
                        "服务器理解请求客户端的请求，但是拒绝执行此请求");
                case 404:
                    return (message = "服务器无法根据客户端的请求找到资源");
                case 405:
                    return (message = "客户端请求中的方法被禁止");
                case 500:
                    return (message = "服务器内部错误，无法完成请求");
                case 502:
                    return (message =
                        "充当网关或代理的服务器，从远端服务器接收到了一个无效的请求");
                case 504:
                    return (message =
                        "充当网关或代理的服务器，未及时从远端服务器获取请求");
                case 505:
                    return (message =
                        "服务器不支持请求的HTTP协议的版本，无法完成处理");
                default:
                    message = "未知错误";
            }
        }
        return Promise.reject(message);
    }
);

export async function request<T>(config: AxiosRequestConfig) {
    const res: AxiosResponse<T> = await instance.request(config);
    return res;
}
