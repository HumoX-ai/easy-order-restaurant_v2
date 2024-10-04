import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./ordersSlice";
import menusReducer from "./menusSlice";
import restaurantReducer from "./restaurantSlice";
export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    menus: menusReducer,
    restaurant: restaurantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
