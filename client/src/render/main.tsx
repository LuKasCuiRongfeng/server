import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "antd/dist/antd.css";
import "./vars.css";
import "./theme.css";
import "./app.css";
import Router from "./router";
import store from "./store";
import { changeTheme } from "./core/utils";
import "./locales";
import "./core/socket";
import { registerIpcEvent } from "./core/ipc";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <Router />
        </Provider>
    </React.StrictMode>
);

registerIpcEvent();
changeTheme("dark");
