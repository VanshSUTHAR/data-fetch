import { createSlice } from '@reduxjs/toolkit';

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    registeredUsers: [],
  },
  reducers: {
    registerUser: (state, action) => {
      const sanitizedUser = {
        ...action.payload,
        // Remove or transform any non-serializable fields here
        register: undefined, // or delete sanitizedUser.register if needed
      };
      state.registeredUsers.push(sanitizedUser);
    },
  },
});

export const { registerUser } = registerSlice.actions;
export default registerSlice.reducer;
