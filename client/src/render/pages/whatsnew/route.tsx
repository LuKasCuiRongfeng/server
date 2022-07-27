import React from "react";
import { CustomRoute } from "@/router";
import WhatsNew from ".";

export const WhatsNewsRoute: CustomRoute = {
    path: "/whatsnew",
    element: <WhatsNew />,
    children: [],
};
