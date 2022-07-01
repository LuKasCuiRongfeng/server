import App from "@/App";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { headerRoutes } from "./header/config";
import Home from "./Home";

export interface CustomRoute {
    title?: string;
    path: string;
    redirect?: string;
    element?: JSX.Element;
    children?: CustomRoute[];
}

const DefaultElement = () => <h1>这里什么也没有</h1>;

export const routes: CustomRoute[] = [
    {
        path: "/",
        redirect: "/home",
        element: <App />,
        children: [
            { path: "home", title: "首页", element: <Home /> },
            ...headerRoutes,
            { path: "*", element: <DefaultElement /> },
        ],
    },
];

const generateRoutes = (routes: CustomRoute[]) => {
    const arr: JSX.Element[] = [];
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const children = route.children;
        arr.push(
            <Route
                key={route.path}
                path={route.path}
                element={route.element || <DefaultElement />}
            >
                {children?.length > 0 ? generateRoutes(children) : ""}
            </Route>
        );
    }
    return arr;
};
const Router: React.FC<Record<string, any>> = () => {
    return (
        <BrowserRouter>
            <Routes>{generateRoutes(routes)}</Routes>
        </BrowserRouter>
    );
};

export default Router;
