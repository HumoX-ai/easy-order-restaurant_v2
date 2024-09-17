import OrdersClient from "@/components/Order/OrdersClient";
import {
  getMyProfileId,
  getMyRestaurants,
  getOrders,
  Order,
  Restaurant,
} from "@/lib/data";

import { setOrders } from "@/store/ordersSlice";
import { store } from "@/store/store";
import { cookies } from "next/headers";
import React from "react";

export interface RestaurantWithOrders {
  restaurant: Restaurant;
  orders: Order[];
}

export default async function Orders() {
  const token = cookies().get("access_token")?.value as string;
  const myId = await getMyProfileId(token);
  const myRestaurants = (await getMyRestaurants(myId as number)) || [];

  const allOrders: RestaurantWithOrders[] = await Promise.all(
    myRestaurants.map(async (restaurant) => {
      const orders = (await getOrders(restaurant.id)) || [];
      return { restaurant, orders };
    })
  );

  const restaurantsWithOrders = allOrders.filter(
    ({ orders }) => orders && orders.length > 0
  );

  // Redux store'ni to'ldirish
  const allOrdersFlat = restaurantsWithOrders.flatMap(({ orders }) => orders);
  store.dispatch(setOrders(allOrdersFlat));

  console.log(allOrdersFlat);

  return <OrdersClient restaurantsWithOrders={restaurantsWithOrders} />;
}
