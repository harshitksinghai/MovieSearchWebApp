import { RootState } from "@/app/store";
import { UserDetailsItem, UserFormItem } from "@/services/user-service/profile/types/profileTypes";
import { authAxios } from "@/app/axiosConfig";
import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";

interface AuthState {
  userId: string | null;
  country: string | null;
  userDetails: UserDetailsItem;
}

const initialState: AuthState = {
  userId: null,
  country: null,
  userDetails: {
    firstName: null,
    middleName: null,
    lastName: null,
    dateOfBirth: null,
    phone: null,
    updatedAt: null
  }
};

export const fetchUserCountry = createAsyncThunk(
  'auth/fetchUserCountry',
  async () => {

      const fetchUrl = '/users/country';
      
      const response = await authAxios.get<{
        success: boolean;
        country: string;
      }>(fetchUrl, {});
    return {country: response.data.country}
  }
);

export const fetchOrAddUser = createAsyncThunk(
  'auth/fetchOrAddUser',
  async (userId: string) => {
    console.log("authSlice => fetchOrAddUser asyncThunk => requestBody ", userId);

      const dbFetchUrl = '/users/details';
      
      const dbResponse = await authAxios.post<{
        success: boolean;
        userDetails: UserDetailsItem;
      }>(dbFetchUrl, { userId });
    return {userDetails: dbResponse.data.userDetails, userId}
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
      
      const url = '/users/updateDetails';
      const requestBody = {
        userId,
        formDetails
      };
      console.log("authSlice => updateCurrentUserDetails asyncThunk => requestBody ", requestBody);

      const response = await authAxios.post(url, requestBody);
      return response.data.userDetails;
    }
)

export const logout = createAction('auth/logout');

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCountry.fulfilled, (state, action) => {
        state.country = action.payload.country;
        console.log("authSlice => fetchUserCountry.fulfilled => country: ", state.country);
      })
      .addCase(fetchOrAddUser.fulfilled, (state, action) => {
        state.userDetails = action.payload.userDetails; 
        state.userId = action.payload.userId;
        console.log("authSlice => fetchOrAddUser.fulfilled => userDetails: ", state.userDetails);
      })
      .addCase(updateCurrentUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        console.log("authSlice => updateCurrentUserDetails.fulfilled => userDetails: ", state.userDetails);
      })
      .addCase(logout, () => {
        return initialState;
      })
  }
});

export const {} = authSlice.actions;
export default authSlice.reducer;
