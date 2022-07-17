import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { CSGO, Dota, EPE, LOL } from "@/pages/home/views/epe";
import { Classic, Jazz, Music, Pop } from "@/pages/home/views/music";
import { PE, Basketball, Footabll, Tennis } from "@/pages/home/views/pe";
import Home from ".";
import Recommend from "./Recommend";
import { CustomRoute } from "@/router";
import Chat from "./views/chat";

// 每个页面维护自己的routes
export const homeRoute: CustomRoute = {
    path: "/home",
    element: <Home />,
    icon: <HomeOutlined />,
    children: [
        {
            path: "",
            label: "首页推荐",
            element: <Recommend />,
        },
        {
            path: "pe",
            label: "体育",
            element: <PE />,
            children: [
                {
                    path: "football",
                    label: "足球",
                    element: <Footabll />,
                },
                {
                    path: "basketball",
                    label: "篮球",
                    element: <Basketball />,
                },
                { path: "tennis", label: "网球", element: <Tennis /> },
            ],
        },
        {
            path: "epe",
            label: "电子竞技",
            element: <EPE />,
            children: [
                { path: "lol", label: "英雄联盟", element: <LOL /> },
                { path: "csgo", label: "CS:GO", element: <CSGO /> },
                { path: "dota", label: "DOTA", element: <Dota /> },
            ],
        },
        {
            path: "music",
            label: "音乐",
            element: <Music />,
            children: [
                { path: "pop", label: "流行音乐", element: <Pop /> },
                {
                    path: "classic",
                    label: "古典音乐",
                    element: <Classic />,
                },
                { path: "jazz", label: "爵士音乐", element: <Jazz /> },
            ],
        },
        {
            path: "chat",
            label: "聊天",
            element: <Chat />,
        },
    ],
};
