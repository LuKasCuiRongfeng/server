import React, { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./header";

const Home: React.FC<Record<string, unknown>> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/home", { replace: true });
        }
    }, []);
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default Home;
