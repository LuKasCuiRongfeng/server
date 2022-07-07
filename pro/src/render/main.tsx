import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./app.css";
import { registerIpcEvent } from "./core/ipcEvent";
import Router from "./router";
import store from "./store";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <Router />
        </Provider>
    </React.StrictMode>
);

registerIpcEvent();
