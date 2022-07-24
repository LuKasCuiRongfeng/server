import { SafeUser, Stranger } from "@/types";
import { request } from "../../core/service";

export function getFriends(name: string) {
    return request<{ data: { friends: SafeUser[]; strangers: Stranger[] } }>({
        url: "/user/friends",
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

export function permitFriend(data: { me: SafeUser; friend: SafeUser }) {
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
