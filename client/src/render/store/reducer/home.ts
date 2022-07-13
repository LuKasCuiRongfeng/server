import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
    value: number;
}

const initialState: State = {
    value: 12,
};

export const home = createSlice({
    name: "home",
    initialState,
    reducers: {
        increment: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
    },
});

export default home.reducer;
