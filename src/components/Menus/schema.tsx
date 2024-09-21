import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createFormSchema = z.object({
  name: z.string().min(1, "Nom talab qilinadi"),
  description: z.string().min(1, "Tavsif talab qilinadi"),
  image: z
    .any()
    .refine((file) => file instanceof File, "Fayl yuklash talab qilinadi")
    .refine((file) => file.size <= MAX_FILE_SIZE, `Maksimal fayl hajmi 5MB`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Faqat .jpg, .jpeg, .png va .webp formatidagi rasmlar qabul qilinadi"
    ),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Yaroqsiz narx formati"),
  status: z.enum(["active", "archived"]),
  stock: z.coerce.number().int().positive("Stok musbat son bo'lishi kerak"),
  menu: z.coerce.number().int().nonnegative(),
  restaurant: z.coerce.number().int().nonnegative(),
});

export const updateFormSchema = z.object({
  name: z.string().min(1, "Nom talab qilinadi"),
  description: z.string().min(1, "Tavsif talab qilinadi"),
  image: z
    .any()
    .refine(
      (file) =>
        file instanceof File || typeof file === "string" || file === undefined,
      "Fayl noto'g'ri formatda"
    )
    .refine((file) => {
      if (file instanceof File) {
        return file.size <= MAX_FILE_SIZE;
      }
      return true;
    }, `Maksimal fayl hajmi 5MB`)
    .refine((file) => {
      if (file instanceof File) {
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      }
      return true;
    }, "Faqat .jpg, .jpeg, .png va .webp formatidagi rasmlar qabul qilinadi")
    .optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Yaroqsiz narx formati"),
  status: z.enum(["active", "archived"]),
  stock: z.coerce.number().int().positive("Stok musbat son bo'lishi kerak"),
  menu: z.coerce.number().int().nonnegative(),
  restaurant: z.coerce.number().int().nonnegative(),
});
