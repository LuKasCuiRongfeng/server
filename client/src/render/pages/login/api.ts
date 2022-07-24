import { request } from "@/core/service";
import { User } from "@/types";

export function userLogin(user: User) {
    return request<{ data: string }>({
        url: "/user/login",
        method: "post",
        data: user,
    });
}

export function userReg(user: User) {
    return request({
        url: "/user/register",
        method: "post",
        data: user,
    });
}
