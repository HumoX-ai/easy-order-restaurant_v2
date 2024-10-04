import { z } from "zod";

export const createFormSchema = z.object({
  name: z.string().min(1, "Nom talab qilinadi"),
  description: z.string().min(1, "Tavsif talab qilinadi"),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Yaroqsiz narx formati"),
  status: z.enum(["active", "archived"]),
  stock: z.coerce.number().int().positive("Stok musbat son bo'lishi kerak"),
  menu: z.coerce.number().int().nonnegative(),
  restaurant: z.coerce.number().int().nonnegative(),
});

export const updateFormSchema = z.object({
  name: z.string().min(1, "Nom talab qilinadi"),
  description: z.string().min(1, "Tavsif talab qilinadi"),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Yaroqsiz narx formati"),
  status: z.enum(["active", "archived"]),
  stock: z.coerce.number().int().positive("Stok musbat son bo'lishi kerak"),
  menu: z.coerce.number().int().nonnegative(),
  restaurant: z.coerce.number().int().nonnegative(),
});

export const restaurantSchema = z.object({
  name: z.string().min(1, "Restoran nomi kerak."),
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
  address: z.string().min(1, "Manzil kerak."),
  contact_phone: z.string().min(1, "Telefon raqami kerak."),
  contact_email: z.string().email("Email noto'g'ri."),
});
