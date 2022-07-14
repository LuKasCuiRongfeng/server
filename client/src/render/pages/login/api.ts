import { request } from "@/core/service";
import { CommonResponse } from "../home/api";

export type User = {
    name: string;
    password: string;
};

export function userLogin(user: User) {
    return request<CommonResponse>({
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
