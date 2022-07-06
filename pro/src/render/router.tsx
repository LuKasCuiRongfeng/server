import React from "react";
import { Routes, HashRouter } from "react-router-dom";
import HomeRoute from "./pages/home/route";

const Router: React.FC<Record<string, any>> = () => {
    return (
        <HashRouter>
            <Routes>{HomeRoute}</Routes>
        </HashRouter>
    );
};

export default Router;
