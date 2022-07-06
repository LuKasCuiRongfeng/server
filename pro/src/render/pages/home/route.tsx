import React from "react";
import { CSGO, Dota, EPE, LOL } from "@/pages/home/views/epe";
import { Classic, Jazz, Music, Pop } from "@/pages/home/views/music";
import { PE, Basketball, Footabll, Tennis } from "@/pages/home/views/pe";
import Home from ".";
import Recommend from "./Recommend";
import { Route } from "react-router-dom";

export interface CustomRoute {
    title?: string;
    path: string;
    redirect?: string;
    element?: JSX.Element;
    children?: CustomRoute[];
}

const DefaultElement = () => <h1>这里什么也没有</h1>;

/** 生产单个嵌套的路由 */
export const generateSingleNestRoute = (route: CustomRoute) => {
    return (
        <Route
            key={route.path}
            path={route.path}
            element={route.element || <DefaultElement />}
        >
            {route.children?.map(d => generateSingleNestRoute(d))}
        </Route>
    );
};

// 每个页面维护自己的routes
export const homeRoute: CustomRoute = {
    path: "/",
    element: <Home />,
    children: [
        {
            path: "pe",
            title: "体育",
            element: <PE />,
            children: [
                {
                    path: "football",
                    title: "足球",
                    element: <Footabll />,
                    children: [{ path: "england", title: "英超" }],
                },
                {
                    path: "basketball",
                    title: "篮球",
                    element: <Basketball />,
                },
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
                {
                    path: "classic",
                    title: "古典音乐",
                    element: <Classic />,
                },
                { path: "jazz", title: "爵士音乐", element: <Jazz /> },
            ],
        },
        {
            path: "home",
            title: "主页",
            element: <Recommend />,
        },
    ],
};

const HomeRoute = generateSingleNestRoute(homeRoute);

export default HomeRoute;
