import React from "react";
import { Routes, HashRouter, Route } from "react-router-dom";
import { homeRoute } from "./pages/home/route";
import { LoginRoute } from "./pages/login/route";
import { UserSetRoute } from "./pages/userset/route";

export interface CustomRoute {
    label?: string;
    path: string;
    redirect?: string;
    element?: JSX.Element;
    children?: CustomRoute[];
    icon?: React.ReactNode;
}

type ItemType = {
    label?: string;
    key: string;
    icon?: React.ReactNode;
    children?: ItemType[];
};

/** 把routes结构转为antd menu组件所需要的结构 */
export const generateAntdMenuItems = (routes: CustomRoute[]) => {
    return routes.map(d => {
        const obj: ItemType = {
            key: d.path,
            label: d.label,
            icon: d.icon,
        };
        if (d.children?.length > 0) {
            obj.children = generateAntdMenuItems(d.children);
        }
        return obj;
    });
};

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
                {generateSingleNestRoute(UserSetRoute)}
            </Routes>
        </HashRouter>
    );
};

export default Router;
