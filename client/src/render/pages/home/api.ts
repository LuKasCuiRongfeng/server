import { request } from "../../core/service";
import { CommonResponse, Hero, User } from "@/types";

export function getLolHeroList() {
    return request<CommonResponse & { data: Hero[] }>({
        url: "/lol/list",
    });
}

export function addHero(data: Hero) {
    return request<CommonResponse>({
        url: "/lol/add",
        method: "post",
        data,
    });
}

export function getFriends(name: string) {
    return request<CommonResponse & { data: User[] }>({
        url: "/user/friends",
        params: { name },
    });
}

export function addFriend(me: string, friend: string) {
    return request<CommonResponse>({
        url: "/user/addfriend",
        params: {
            me,
            friend,
        },
    });
}
