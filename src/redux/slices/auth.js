import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchLogin = createAsyncThunk("auth/fetchLogin", async (params) => {
  const { data } = await axios.post("/user/login", params);
  return data;
});

export const fetchAuth = createAsyncThunk("auth/fetcAuth", async () => {
  const { data } = await axios.get("/user/auth");

  return data;
});

export const fetchRegistration = createAsyncThunk("auth/fetchRegistration", async (params) => {
  const { data } = await axios.post("/user/registration", params);
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
        console.log(action.payload);
      })
      .addCase(fetchLogin.rejected, (state) => {
        state.status = "error";
        state.data = null;
      })
      .addCase(fetchAuth.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
        console.log(action.payload);
      })
      .addCase(fetchAuth.rejected, (state) => {
        state.status = "error";
        state.data = null;
      })

      .addCase(fetchRegistration.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchRegistration.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
        console.log(action.payload);
      })
      .addCase(fetchRegistration.rejected, (state) => {
        state.status = "error";
        state.data = null;
      });
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const { logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
