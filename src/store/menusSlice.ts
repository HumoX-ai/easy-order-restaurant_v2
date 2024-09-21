import { Menu, MenuItem } from "@/lib/data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Menus {
  menus: Menu[];
  loading: boolean;
  error: string | null;
}

const initialState: Menus = {
  menus: [],
  loading: false,
  error: null,
};

export const menusSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    setMenus: (state, action: PayloadAction<Menu[]>) => {
      state.menus = action.payload;
    },
    addMenus: (state, action: PayloadAction<Menu>) => {
      state.menus.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addMenuItem: (
      state,
      action: PayloadAction<{ categoryId: number; item: MenuItem }>
    ) => {
      const category = state.menus.find(
        (menu) => menu.id === action.payload.categoryId
      );
      if (category) {
        category.items.push(action.payload.item);
      }
    },
    updateMenuItem: (
      state,
      action: PayloadAction<{ categoryId: number; item: MenuItem }>
    ) => {
      const category = state.menus.find(
        (menu) => menu.id === action.payload.categoryId
      );
      if (category) {
        const index = category.items.findIndex(
          (item) => item.id === action.payload.item.id
        );
        if (index !== -1) {
          category.items[index] = action.payload.item;
        }
      }
    },
    deleteMenuItem: (
      state,
      action: PayloadAction<{ categoryId: number; itemId: number | undefined }>
    ) => {
      const category = state.menus.find(
        (menu) => menu.id === action.payload.categoryId
      );
      if (category) {
        const index = category.items.findIndex(
          (item) => item.id === action.payload.itemId
        );
        if (index !== -1) {
          category.items.splice(index, 1);
        }
      }
    },
  },
});

export const {
  addMenus,
  setMenus,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setLoading,
  setError,
} = menusSlice.actions;
export default menusSlice.reducer;
