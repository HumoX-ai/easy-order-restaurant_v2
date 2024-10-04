"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import RestaurantUpdateModal from "./RestaurantUpdateModal";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setRestaurants } from "@/store/restaurantSlice";
import Link from "next/link";
import { Restaurant } from "@/lib/data";

interface RestaurantsListProps {
  initialRestaurants: Restaurant[];
}

const RestaurantsList: React.FC<RestaurantsListProps> = ({
  initialRestaurants,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setRestaurants(initialRestaurants));
  }, [dispatch, initialRestaurants]);

  const newRestaurants = useAppSelector(
    (state) => state.restaurant.restaurants
  );

  if (initialRestaurants.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Mening Restoranlarim</h1>
        <p className="text-center">Mening restoranlarim mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 ">Mening Restoranlarim</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newRestaurants &&
          newRestaurants?.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="overflow-hidden h-full flex flex-col"
            >
              <Image
                src={restaurant?.image || "/noImage.svg"}
                alt={restaurant?.name}
                width={400}
                height={400}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-lg">
                  {restaurant.name}
                  <Badge
                    variant={
                      restaurant.status === "active" ? "default" : "secondary"
                    }
                  >
                    {restaurant.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{restaurant.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start  mb-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mr-2" />
                  <span className="text-sm">{restaurant.address}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{restaurant.contact_phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{restaurant.contact_email}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-end mt-auto">
                <Link href={`/dashboard/menus/${restaurant.id}`}>
                  <Button variant="link">Menyular</Button>
                </Link>
                <RestaurantUpdateModal restaurant={restaurant} />
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default RestaurantsList;
