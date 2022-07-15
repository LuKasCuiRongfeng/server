import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
    userInfo: { sessionId?: string; name?: string };
}

const initialState: State = {
    userInfo: {},
};

export const home = createSlice({
    name: "home",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
    },
});

export default home.reducer;
