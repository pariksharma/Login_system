import { createSlice } from "@reduxjs/toolkit";

export const footerSlice = createSlice({
    name: 'footer',
    initialState: {
        version: ''
    },
    reducers: {
        footerAction: (state, action) => {
            state.version = action?.payload;
        }
    }
})

export const { footerAction } = footerSlice.actions;
export default footerSlice.reducer;