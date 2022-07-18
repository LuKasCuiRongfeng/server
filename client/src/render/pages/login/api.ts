import { request } from "@/core/service";
import { CommonResponse, User } from "@/types";

export function userLogin(user: User) {
    return request<CommonResponse & { data: User }>({
        url: "/user/login",
        method: "post",
        data: user,
    });
}

export function userReg(user: User) {
    return request<CommonResponse>({
        url: "/user/register",
        method: "post",
        data: user,
    });
}
