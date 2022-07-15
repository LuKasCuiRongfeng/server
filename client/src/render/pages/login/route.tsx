import React from "react";
import { CustomRoute } from "@/router";
import Login from ".";
import Login_login from "./login";
import Login_reg from "./register";

export const LoginRoute: CustomRoute = {
    path: "/login",
    element: <Login />,
    children: [
        { path: "", element: <Login_login /> },
        { path: "register", element: <Login_reg /> },
    ],
};
