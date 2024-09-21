import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./ordersSlice";
import menusReducer from "./menusSlice";
export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    menus: menusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
