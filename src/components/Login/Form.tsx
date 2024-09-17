"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "@/hooks/use-toast";
import InputMask from "react-input-mask";

const formSchema = z.object({
  phone: z
    .string()
    .min(9, "Telefon raqam formatini to'liq kiriting")
    .max(17, "Telefon raqami noto'g'ri")
    .regex(
      /^\+998 \d{2} \d{3}-\d{2}-\d{2}$/,
      "To'g'ri telefon formatini kiriting"
    ),
  password: z.string().min(6, "Parol juda qisqa"),
});
const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const API_URL = process.env.NEXT_PUBLIC_HOST;

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    axios
      .post(`${API_URL}/auth/login/`, values)
      .then((response) => {
        console.log("response", response);
        setIsLoading(false);
        if (response.data.user_data.role === "restaurant_owner") {
          Cookies.set("access_token", response.data.access);
          Cookies.set("refresh_token", response.data.refresh);
          window.location.href = "/dashboard/home";
        } else {
          toast({
            variant: "destructive",
            title: "Xatolik",
            description: "Foydalanuvchi restoran admini ro'lida emas",
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: error.message,
          description: "Telefon raqam yoki parol noto'g'ri",
        });
      });
  }
  return (
    <div className="w-full max-w-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon raqam</FormLabel>
                <FormControl>
                  <InputMask
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    mask="+999 99 999-99-99"
                    maskChar={null}
                    placeholder="+998 XX XXX-XX-XX"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parol</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Kirish"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
