import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./reducer/home";
import loginReducer from "./reducer/login";

const store = configureStore({
    reducer: {
        home: homeReducer,
        login: loginReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
