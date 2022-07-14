import { request } from "@/core/service";
import { CommonResponse } from "@/pages/home/api";

export type Hero = {
    name: string;
    role: "top" | "jungle" | "middle" | "AD" | "sup";
    stars: 1 | 2 | 3 | 4 | 5;
    difficult: "normal" | "easy" | "difficult" | "hell";
};

export function getLolHeroList() {
    return request<CommonResponse & { data: Hero[] }>({
        url: "/lol/herolist",
    });
}

export function addHero(data: Hero) {
    return request<CommonResponse>({
        url: "/lol/addhero",
        method: "post",
        data,
    });
}
