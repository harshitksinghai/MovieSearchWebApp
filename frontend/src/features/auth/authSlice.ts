import { RootState } from "@/app/store";
import { UserDetailsItem, UserFormItem } from "@/types/authTypes";
import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";


const MODE = import.meta.env.MODE || "development";
const BACKEND_URL =
  MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;
interface AuthState {
  userId: string | null;
  userDetails: UserDetailsItem;
}

const initialState: AuthState = {
  userId: null,
  userDetails: {
    firstName: null,
    middleName: null,
    lastName: null,
    dateOfBirth: null,
    phone: null,
    updatedAt: null
  }
};

export const fetchCurrentUserDetails = createAsyncThunk(
  'auth/fetchCurrentUserDetails',
  async (userId: string) => {
    console.log("authSlice => fetchCurrentUserDetails asyncThunk => requestBody ", userId);

    const dbFetchUrl = `${BACKEND_URL}/api/users/details`;
    const dbResponses = await axios.post<{
      success: boolean;
      userDetails: UserDetailsItem;
    }>(dbFetchUrl, { userId });

    return dbResponses.data.userDetails;
  }
);

export const updateCurrentUserDetails = createAsyncThunk(
  'auth/updateCurrentUserDetails',
  async({
    formDetails,
  }: { formDetails: UserFormItem }, { getState }
    ) => {
      const state = getState() as RootState;
      const userId = state.auth.userId;
      
      const url = `${BACKEND_URL}/api/users/updateDetails`;
      const requestBody = {
        userId,
        formDetails
      };
      console.log("authSlice => updateCurrentUserDetails asyncThunk => requestBody ", requestBody);

      const response = await axios.post(url, requestBody);
      return response.data.userDetails;
    }
)

export const addUserIdInDB = createAsyncThunk(
  'auth/addUserIdInDB',
  async (userId: string) => {
    console.log("authSlice => addUserInDB asyncThunk => requestBody ", userId);

    const dbFetchUrl = `${BACKEND_URL}/api/users/addUser`;
    await axios.post<{
      success: boolean;
    }>(dbFetchUrl, { userId });
    return userId;
  }
)

export const logout = createAction('auth/logout');

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload; 
        console.log("authSlice => fetchCurrentUserDetails.fulfilled => userDetails: ", state.userDetails);
      })
      .addCase(updateCurrentUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        console.log("authSlice => updateCurrentUserDetails.fulfilled => userDetails: ", state.userDetails);
      })
      .addCase(addUserIdInDB.fulfilled, (state, action) => {
        state.userId = action.payload;
        console.log("authSlice => addUserIdInDB.fulfilled => userId: ", state.userId);
      })
      .addCase(logout, () => {
        return initialState;
      })
  }
});

export const {} = authSlice.actions;
export default authSlice.reducer;
