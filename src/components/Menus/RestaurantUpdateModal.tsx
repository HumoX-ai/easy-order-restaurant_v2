import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { setLoading, updateRestaurant } from "@/store/restaurantSlice";
import { z } from "zod";
import { restaurantSchema } from "./schema";
import { Restaurant } from "@/lib/data";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { Loader2 } from "lucide-react";

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

interface RestaurantUpdateModalProps {
  restaurant: Restaurant;
}

const RestaurantUpdateModal: React.FC<RestaurantUpdateModalProps> = ({
  restaurant,
}) => {
  const loading = useAppSelector((state) => state.restaurant.loading);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      contact_phone: restaurant.contact_phone,
      contact_email: restaurant.contact_email,
    },
  });

  const onSubmit = async (data: RestaurantFormValues) => {
    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "image" && data.image instanceof File) {
          formData.append(key, data.image);
        } else if (key !== "image") {
          formData.append(
            key,
            data[key as keyof RestaurantFormValues] as string
          );
        }
      });

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_HOST}/products/restaurants/${restaurant.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(
        updateRestaurant({
          id: restaurant.id,
          data: response.data,
        })
      );

      setOpen(false);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      setOpen(false);
    } finally {
      dispatch(setLoading(false));
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Tahrirlash</Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1e1c1c]">
        <DialogHeader>
          <DialogTitle>
            {restaurant.name} ma&#39;lumotlarini yangilash
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomi</FormLabel>
                  <FormControl>
                    <Input placeholder="Restoran nomi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tavsif</FormLabel>
                  <FormControl>
                    <Input placeholder="Tavsif (ixtiyoriy)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manzil</FormLabel>
                  <FormControl>
                    <Input placeholder="Restoran manzili" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon raqam</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefon raqam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Restoran emaili" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rasm</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Saqlash"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantUpdateModal;
