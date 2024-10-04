import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Restaurant interface
interface Restaurant {
  id: number;
  name: string;
  image: string;
  description: string;
  address: string;
  contact_phone: string;
  contact_email: string;
  status: "active" | "archived";
}

// Initial state
interface RestaurantState {
  loading: boolean;
  restaurants: Restaurant[];
}

const initialState: RestaurantState = {
  loading: false,
  restaurants: [],
};

// Create the slice
export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    // Action to set all restaurants (e.g. from server response)
    setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload;
    },
    // Action to update a specific restaurant's data
    updateRestaurant: (
      state,
      action: PayloadAction<{ id: number; data: Partial<Restaurant> }>
    ) => {
      const { id, data } = action.payload;
      const restaurantIndex = state.restaurants.findIndex((r) => r.id === id);
      if (restaurantIndex >= 0) {
        state.restaurants[restaurantIndex] = {
          ...state.restaurants[restaurantIndex],
          ...data,
        };
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Export actions
export const { setRestaurants, updateRestaurant, setLoading } =
  restaurantSlice.actions;

// Export the reducer
export default restaurantSlice.reducer;
