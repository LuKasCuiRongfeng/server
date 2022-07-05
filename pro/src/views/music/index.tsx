import React from "react";
import { Outlet } from "react-router-dom";
export { Item as Pop } from "./pop";
export { Item as Jazz } from "./jazz";
export { Item as Classic } from "./classic";

export const Music: React.FC<Record<string, any>> = () => {
    return (
        <div>
            <div>音乐</div>
            <Outlet />
        </div>
    );
};
