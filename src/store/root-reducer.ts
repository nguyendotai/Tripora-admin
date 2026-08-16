import { combineReducers, type UnknownAction } from "@reduxjs/toolkit";
import authReducer, { logout } from "@/features/auth/store/auth.slice";
import { baseApi } from "@/shared/services/base-api";

const appReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

/**
 * Reset toan bo store (ke ca cache RTK Query) khi logout — khong reset thi cache cua tai khoan
 * cu (VD /tours/mine) van con nguyen trong bo nho vi router.push("/login") chi la client-side
 * navigation, khong reload trang. Neu khong reset, dang nhap tai khoan khac trong cung tab se
 * thay du lieu cu cua tai khoan truoc do cho toi khi cache tu nhien invalidate/refetch.
 */
export function rootReducer(state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) {
  if (action.type === logout.type) {
    state = undefined;
  }
  return appReducer(state, action);
}
