// RestaurantMenu.tsx (Server Component)
import AddMenuButton from "@/components/Menus/AddMenuButton";
import MenuList from "@/components/Menus/MenuList";
import { getRestaurantMenu } from "@/lib/data";

export default async function RestaurantMenu({
  params,
}: {
  params: { id: string };
}) {
  const menu = await getRestaurantMenu(parseInt(params.id));
  console.log("menu", menu);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Restoran Menyusi</h1>
      <AddMenuButton restaurantId={params.id} />
      <MenuList initialMenu={menu!} />
    </div>
  );
}
