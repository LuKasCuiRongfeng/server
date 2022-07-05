import { CustomRoute } from "@/router";
import { CSGO, Dota, EPE, LOL } from "@/views/epe";
import { Classic, Jazz, Music, Pop } from "@/views/music";
import { PE, Basketball, Footabll, Tennis } from "@/views/pe";
import React from "react";

export const headerRoutes: CustomRoute[] = [
    {
        path: "pe",
        title: "体育",
        element: <PE />,
        children: [
            {
                path: "football",
                title: "足球",
                element: <Footabll />,
                children: [{ path: "engaland", title: "英超" }],
            },
            { path: "basketball", title: "篮球", element: <Basketball /> },
            { path: "tennis", title: "网球", element: <Tennis /> },
        ],
    },
    {
        path: "epe",
        title: "电子竞技",
        element: <EPE />,
        children: [
            { path: "lol", title: "英雄联盟", element: <LOL /> },
            { path: "csgo", title: "CS:GO", element: <CSGO /> },
            { path: "dota", title: "DOTA", element: <Dota /> },
        ],
    },
    {
        path: "music",
        title: "音乐",
        element: <Music />,
        children: [
            { path: "pop", title: "流行音乐", element: <Pop /> },
            { path: "classic", title: "古典音乐", element: <Classic /> },
            { path: "jazz", title: "爵士音乐", element: <Jazz /> },
        ],
    },
];
