import React from "react";
import { Outlet } from "react-router-dom";
export { Item as LOL } from "./lol";
export { Item as Dota } from "./dota";
export { Item as CSGO } from "./csgo";

export const EPE: React.FC<Record<string, any>> = () => {
    return (
        <div>
            <div>电子竞技</div>
            <Outlet />
        </div>
    );
};
