import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../../config.json";

const url = config.url;
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData) => {
    const response = await axios.post(`${url}/api/login`, userData);
    return response.data; // 假设后端返回用户信息和token
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // 假设返回的 payload 是用户信息
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
