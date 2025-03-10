import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  userId: string;
}

const initialState: AuthState = {
  userId: crypto.randomUUID(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export const {} = authSlice.actions;
export default authSlice.reducer;
