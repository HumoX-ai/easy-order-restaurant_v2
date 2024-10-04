import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { createFormSchema, updateFormSchema } from "./schema";
import axios from "axios";
import { Menu, MenuItem } from "@/lib/data";

type FormData = z.infer<typeof updateFormSchema>;

interface MenuItemModalProps {
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: MenuItem | null;
  menuId: number | null;
  restaurantId: number | null;
}

export default function MenuItemModal({
  loading,
  isOpen,
  onClose,
  onSubmit,
  initialData,
  menuId,
  restaurantId,
}: MenuItemModalProps) {
  const [menus, setMenus] = useState<Menu[] | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(initialData ? updateFormSchema : createFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: "",
      status: "active",
      stock: 0,
      image: "",
      menu: menuId ?? undefined,
      restaurant: restaurantId ?? undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData); // `initialData` o'zgarganda formani yangilash
    }
  }, [initialData, form]);

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast({
        title: "Muvaffaqiyatli",
        description: initialData
          ? "Menu elementi yangilandi"
          : "Yangi menu elementi qo'shildi",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Xatolik yuz berdi",
        description: "Iltimos, qaytadan urinib ko'ring",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get<Menu[]>(
          `${process.env.NEXT_PUBLIC_HOST}/products/restaurants/${restaurantId}/menus/`
        );

        setMenus(res.data);
        console.log("menus", res.data);

        return res.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    };

    fetchMenus();
  }, [restaurantId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1e1c1c]">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? "Menyu elementini tahrirlash"
              : "Yangi menyu elementi qo'shish"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomi</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Tavsifi</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Rasm yuklash</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      {...rest}
                    />
                  </FormControl>
                  {typeof value === "string" && value && (
                    <p className="text-sm text-gray-500 break-words">
                      Joriy rasm: {value.split("/").pop()}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Narxi</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Holati</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Holatni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Faol</SelectItem>
                      <SelectItem value="archived">Arxivlangan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="menu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menyular</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Menyu tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {menus?.map((menu) => (
                        <SelectItem key={menu.id} value={menu.id.toString()}>
                          {menu.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : initialData ? (
                  "Yangilash"
                ) : (
                  "Qo'shish"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
