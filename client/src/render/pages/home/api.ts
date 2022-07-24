import { Stranger, User } from "@/types";
import { request } from "../../core/service";

export function getUser(name: string) {
    return request<{ data: User }>({
        url: "/user/getuser",
        params: { name },
    });
}

export function addFriendRequest(data: { me: Stranger; friend: string }) {
    return request({
        url: "/user/addfriendrequest",
        method: "post",
        data,
    });
}

export function permitFriend(data: { me: string; friend: string }) {
    return request({
        url: "/user/permitfriend",
        method: "post",
        data,
    });
}

export function getAvatar(name: string) {
    return request<{ data: string }>({
        url: "/user/getavatar",
        params: { name },
    });
}
