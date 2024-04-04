import { createSlice } from "@reduxjs/toolkit";

export const logoutSlice = createSlice({
    name: 'logout',
    initialState: {
    },
    reducers: {
        logoutAction: (state) => { }
    }
})

export const { logoutAction } = logoutSlice.actions;
export default logoutSlice.reducer;