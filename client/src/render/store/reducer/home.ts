import { Msg, User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
    user: User;
    /**
     * @example
     * ```
     * { liu: [], xxx: [] }
     * ```
     */
    chatLog: Record<string, Msg[]>;
}

const initialState: State = {
    user: { name: "" },
    chatLog: {},
};

export const home = createSlice({
    name: "home",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setChatLog: (state, action) => {
            state.chatLog = action.payload;
        },
    },
});

export default home.reducer;
