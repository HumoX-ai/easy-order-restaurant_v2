"use client";
import Image from "next/image";
import { MenuItem as MenuItemType } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Pen, Trash2 } from "lucide-react";
import axios from "axios";
import { useAppDispatch } from "@/lib/hooks";
import { deleteMenuItem } from "@/store/menusSlice";
import { toast } from "@/hooks/use-toast";

interface MenuItemProps {
  item: MenuItemType;
  categoryId: number;
  onEdit: (item: MenuItemType) => void;
}

export default function MenuItem({ item, onEdit }: MenuItemProps) {
  const dispatch = useAppDispatch();
  const handleDelete = async (item: MenuItemType) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_HOST}/products/menu_items/${item.id}/`
      );
      // Redux state'ni yangilash
      dispatch(deleteMenuItem({ categoryId: item.menu, itemId: item.id }));
      toast({
        title: "Muvaffaqiyatli o'chirildi",
        description: `"${item.name}" menyudan o'chirildi`,
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Xatolik yuz berdi",
        description: "Menu elementini o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };
  const imageSrc = item?.image
    ? typeof item.image === "string" &&
      (item.image as string).startsWith("http")
      ? item.image
      : `${process.env.NEXT_PUBLIC_HOST}/${item.image}`
    : "/noImage.svg";
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0 relative">
        <Image
          src={imageSrc}
          alt={item.name}
          width={500}
          height={500}
          className="w-full h-48 object-cover"
        />
        <Button
          size="sm"
          className="absolute top-1 right-2 bg-red-500 hover:bg-red-600"
          onClick={() => handleDelete(item)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          className="absolute top-1 right-14"
          onClick={() => onEdit(item)}
        >
          <Pen className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <Badge variant={item.status === "active" ? "default" : "secondary"}>
            {item.status === "active" ? "Mavjud" : "Arxivlangan"}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">{item.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="font-semibold text-lg">
            {parseInt(item.price).toLocaleString()} so&#39;m
          </p>
          <Badge variant="outline">Qoldiq: {item.stock}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
