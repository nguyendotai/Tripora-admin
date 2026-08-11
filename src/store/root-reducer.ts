import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/auth.slice";
import { baseApi } from "@/shared/services/base-api";

export const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});
