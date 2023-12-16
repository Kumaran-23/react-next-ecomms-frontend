"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  type: null,
};

const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearAlert: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { setAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;