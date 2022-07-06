import React from "react";
import { Routes, HashRouter, Route } from "react-router-dom";
import { homeRoute } from "./pages/home/route";
import { LoginRoute } from "./pages/login/route";

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

const Router: React.FC<Record<string, any>> = () => {
    return (
        <HashRouter>
            <Routes>
                {generateSingleNestRoute(homeRoute)}
                {generateSingleNestRoute(LoginRoute)}
            </Routes>
        </HashRouter>
    );
};

export default Router;
