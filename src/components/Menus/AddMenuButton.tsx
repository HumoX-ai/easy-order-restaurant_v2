// AddMenuButton.tsx (Client Component)
"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addMenus, setLoading } from "@/store/menusSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

export default function AddMenuButton({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: "",
    description: "",
    is_active: true,
    restaurant: parseInt(restaurantId),
  });
  const isLoading = useAppSelector((state) => state.menus.loading);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMenu({ ...newMenu, [e.target.name]: e.target.value });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMenu({ ...newMenu, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewMenu((prev) => ({ ...prev, is_active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    dispatch(setLoading(true));
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/products/menus/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMenu),
        }
      );

      if (response.ok) {
        const createdMenu = await response.json();
        dispatch(addMenus(createdMenu));
        dispatch(setLoading(false));
        setIsModalOpen(false);
        setNewMenu({
          name: "",
          description: "",
          is_active: true,
          restaurant: parseInt(restaurantId),
        });
      } else {
        console.error("Failed to create menu");
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error("Error creating menu:", error);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="mb-4 flex justify-end">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button>Yangi menyu qo&#39;shish</Button>
        </DialogTrigger>
        <DialogContent className="bg-[#1e1c1c]">
          <DialogHeader>
            <DialogTitle>Yangi menyu yaratish</DialogTitle>
            <DialogDescription>
              Yangi menyu ma&#39;lumotlarini kiriting.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nomi</Label>
              <Input
                id="name"
                name="name"
                value={newMenu.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Tavsif</Label>
              <Textarea
                id="description"
                name="description"
                value={newMenu.description}
                onChange={handleTextareaChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={newMenu.is_active}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_active">Faol</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Saqlash"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
