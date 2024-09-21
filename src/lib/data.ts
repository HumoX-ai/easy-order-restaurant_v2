/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export interface Restaurant {
  uuid: string;
  id: number;
  name: string;
  image: string;
  description: string;
  address: string;
  contact_phone: string;
  contact_email: string;
  status: "active" | "archived";
  owner: number;
}

export interface Menu {
  id: number;
  name: string;
  items: MenuItem[];
  is_active: boolean;
  restaurant: number;
}

export interface MenuItem {
  id?: number;
  menu: number;
  name: string;
  description: string;
  price: string;
  status: "active" | "archived";
  stock: number;
  restaurant: number;
  image?: File;
}
export interface Order {
  id: number;
  restaurant: number;
  product: number;
  quantity: number;
  customer: number;
  price: string;
  is_paid: boolean;
  total_price: number;
  status: string;
  created_at: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Restaurant[];
}

export interface UserInfo {
  id: number;
  name: string;
  phone: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
}
export async function getRestaurantMenu(id: number): Promise<Menu[] | null> {
  try {
    const res = await axios.get<Menu[]>(
      `${process.env.NEXT_PUBLIC_HOST}/products/restaurants/${id}/menus/`
    );
    return res.data;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function getMyProfileId(token: string): Promise<number | null> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST}/auth/profile/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.id;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function getMyRestaurants(
  id: number
): Promise<Restaurant[] | null> {
  try {
    const res = await axios.get<ApiResponse>(
      `${process.env.NEXT_PUBLIC_HOST}/products/restaurants/`
    );

    const myRestaurants = res.data.results.filter(
      (restaurant) => restaurant.owner === id
    );

    return myRestaurants;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function getOrders(id: number): Promise<Order[] | null> {
  try {
    const res = await axios.get<Order[]>(
      `${process.env.NEXT_PUBLIC_HOST}/products/products/orders/restaurant/${id}/`
    );
    return res.data;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function getUsersById(id: number): Promise<UserInfo | null> {
  try {
    const res = await axios.get<UserInfo>(
      `${process.env.NEXT_PUBLIC_HOST}/auth/users/${id}/`
    );
    return res.data;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function getProductById(id: number): Promise<MenuItem | null> {
  try {
    const res = await axios.get<MenuItem>(
      `${process.env.NEXT_PUBLIC_HOST}/products/menu_items/${id}/`
    );
    return res.data;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}
