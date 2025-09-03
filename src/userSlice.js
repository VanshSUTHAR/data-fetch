import { addListener, createSlice } from "@reduxjs/toolkit";
import { use } from "react";

const userSlice = createSlice({
    name:'users',
    initialState:{
        list:[],
    },
    reducers:{
        registerUser:(state,action)=>{
            state.list.push(action.payload);
        }
    }

});

export const { registerUser } = userSlice.actions;
export default userSlice.reducer;