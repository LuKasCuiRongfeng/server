import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./reducer/home";
import loginReducer from "./reducer/login";
import usersetReducer from "./reducer/userset";

const store = configureStore({
    reducer: {
        home: homeReducer,
        login: loginReducer,
        userset: usersetReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
