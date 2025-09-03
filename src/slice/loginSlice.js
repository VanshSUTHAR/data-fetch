import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
    name: "login",
    initialState: {
        currentUser: null,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        logoutUser: (state) => { state.currentUser = null; }
    }
}
)

export const { logoutUser }  = loginSlice.actions;
export const { setCurrentUser } = loginSlice.actions;
export default loginSlice.reducer; 