import React from "react";
import { CustomRoute } from "@/router";
import Login from ".";

export const LoginRoute: CustomRoute = {
    path: "/login",
    element: <Login />,
};
