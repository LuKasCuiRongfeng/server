import React from "react";
import { createRoot } from "react-dom/client";
import "./app.css";
import Router from "./router";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Router />
    </React.StrictMode>
);
