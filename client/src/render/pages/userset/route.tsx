import React from "react";
import { CustomRoute } from "@/router";
import UserSet from ".";

export const UserSetRoute: CustomRoute = {
    path: "/userset",
    element: <UserSet />,
    children: [],
};
