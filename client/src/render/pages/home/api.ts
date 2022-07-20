import { request } from "../../core/service";
import { Hero } from "@/types";

export function getLolHeroList() {
    return request<{ data: Hero[] }>({
        url: "/lol/list",
    });
}

export function addHero(data: Hero) {
    return request({
        url: "/lol/add",
        method: "post",
        data,
    });
}

export function getFriends(name: string) {
    return request<{ data: string[] }>({
        url: "/user/friends",
        params: { name },
    });
}

export function addFriend(data: { me: string; friend: string }) {
    return request({
        url: "/user/addfriend",
        params: data,
    });
}

export function getAvatar(name: string) {
    return request<{ data: string }>({
        url: "/user/getavatar",
        params: { name },
    });
}
