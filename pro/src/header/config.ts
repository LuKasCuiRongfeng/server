import { CustomRoute } from "@/router";

export const headerRoutes: CustomRoute[] = [
    {
        path: "pe",
        title: "体育",
        redirect: "pe/football",
        children: [
            {
                path: "football",
                title: "足球",
                children: [{ path: "engaland", title: "英超" }],
            },
            { path: "basketball", title: "篮球" },
            { path: "tennis", title: "网球" },
        ],
    },
    {
        path: "epe",
        title: "电子竞技",
        children: [
            { path: "lol", title: "英雄联盟" },
            { path: "csgo", title: "CS:GO" },
            { path: "dota", title: "DOTA" },
        ],
    },
    {
        path: "music",
        title: "音乐",
        children: [
            { path: "pop", title: "流行音乐" },
            { path: "classic", title: "古典音乐" },
            { path: "jaz", title: "爵士音乐" },
        ],
    },
];
