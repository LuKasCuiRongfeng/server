import React from "react";
import { Outlet } from "react-router-dom";
export { Item as Basketball } from "./basketabll";
export { Item as Footabll } from "./football";
export { Item as Tennis } from "./tennis";

export const PE: React.FC<Record<string, any>> = () => {
    return (
        <div>
            <div>体育</div>
            <Outlet />
        </div>
    );
};
