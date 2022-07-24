import { Msg, SafeUser, User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
    user: User;
    /**
     * @example
     * ```
     * {liu: {user: { nickname, name, avatar }, chatHistory: [{ msg, name, date, unread }] }}
     * ```
     */
    chatLog: Record<string, { friend: SafeUser; chatHistory: Msg[] }>;
}

const initialState: State = {
    user: {},
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
