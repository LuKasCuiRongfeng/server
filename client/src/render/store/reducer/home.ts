import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
    user: User;
}

const initialState: State = {
    user: {},
};

export const home = createSlice({
    name: "home",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export default home.reducer;
