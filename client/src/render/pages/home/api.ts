import { request } from "../../core/service";

export interface CommonResponse {
    status: "success" | "failed";
    error: string;
}

export function getUserInfo(id: string) {
    return request<CommonResponse & { data: { name: string } }>({
        url: "/user/userinfo",
        method: "post",
        data: id,
    });
}
