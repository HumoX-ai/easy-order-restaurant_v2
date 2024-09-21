"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addMenuItem,
  setLoading,
  setMenus,
  updateMenuItem,
} from "@/store/menusSlice";
import { RootState } from "@/store/store";
import { Menu, MenuItem as MenuItemType } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import MenuItem from "./MenuItem";
import MenuItemModal from "./MenuItemModal";
import axios from "axios";

interface MenuListProps {
  initialMenu: Menu[];
}

export default function MenuList({ initialMenu }: MenuListProps) {
  const dispatch = useAppDispatch();
  const menu = useAppSelector((state: RootState) => state.menus.menus);
  const loading = useAppSelector((state: RootState) => state.menus.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const restaurantId = initialMenu[0]?.restaurant;
  console.log("initialMenu", initialMenu);

  useEffect(() => {
    dispatch(setMenus(initialMenu));
  }, [dispatch, initialMenu]);

  const toggleModal = (
    item: MenuItemType | null = null,
    menuId: number | null = null
  ) => {
    if (!isModalOpen) {
      // Modal ochilayotganda
      if (item) {
        setEditingItem(item);
        setSelectedMenuId(item.menu);
      } else {
        setSelectedMenuId(menuId);
      }
    } else {
      // Modal yopilayotganda
      setEditingItem(null);
      setSelectedMenuId(null);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (data: MenuItemType) => {
    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      const endpoint = editingItem
        ? `${process.env.NEXT_PUBLIC_HOST}/products/menu_items/${editingItem.id}/`
        : `${process.env.NEXT_PUBLIC_HOST}/products/menu_items/`;

      const method = editingItem ? axios.patch : axios.post;

      const response = await method(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        const action = editingItem
          ? updateMenuItem({
              categoryId: response.data.menu,
              item: response.data,
            })
          : addMenuItem({
              categoryId: response.data.menu,
              item: response.data,
            });
        dispatch(action);
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error submitting menu item:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  if (menu.length === 0) {
    return <p className="text-center">Menyu mavjud emas</p>;
  }

  return (
    <>
      <Button onClick={() => toggleModal()} className="mb-4">
        Add Menu Item
      </Button>
      <Accordion type="single" collapsible className="w-full">
        {menu.map((category) => (
          <AccordionItem key={category.id} value={`item-${category.id}`}>
            <AccordionTrigger className="text-xl font-semibold">
              {category.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.items.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    categoryId={category.id}
                    onEdit={toggleModal}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <MenuItemModal
        key={editingItem ? editingItem.id : "new"}
        loading={loading}
        isOpen={isModalOpen}
        onClose={() => toggleModal()}
        onSubmit={handleSubmit}
        restaurantId={restaurantId}
        menuId={selectedMenuId}
        initialData={editingItem}
      />
    </>
  );
}
