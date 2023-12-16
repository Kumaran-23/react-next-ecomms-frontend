import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/loginSlice";
import alertReducer from "./alerts/alertSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    alerts: alertReducer,
  },
});

export default store;