import React from "react";
import RestaurantsList from "@/components/Menus/RestaurantList";
import { getMyProfileId, getMyRestaurants } from "@/lib/data";
import { cookies } from "next/headers";

export default async function Menus() {
  const token = cookies().get("access_token")?.value as string;
  const myId = await getMyProfileId(token);
  const myRestaurants = (await getMyRestaurants(myId as number)) || [];

  return <RestaurantsList initialRestaurants={myRestaurants} />;
}
