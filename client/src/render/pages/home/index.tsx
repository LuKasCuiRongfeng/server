import { ElectronWindow } from "@/components";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";

const Home: React.FC<Record<string, unknown>> = () => {
    return (
        <ElectronWindow>
            <Header />
            <Outlet />
        </ElectronWindow>
    );
};

export default Home;
