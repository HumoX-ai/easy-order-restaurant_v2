import { getRestaurantMenu } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function RestaurantMenu({
  params,
}: {
  params: { id: string };
}) {
  const menu = await getRestaurantMenu(parseInt(params.id));
  console.log("menu", menu);

  if (menu?.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Restoran Menyusi
        </h1>
        <p className="text-center">Menyu mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Restoran Menyusi</h1>
      <Accordion type="single" collapsible className="w-full">
        {menu?.map((category) => (
          <AccordionItem key={category.id} value={`item-${category.id}`}>
            <AccordionTrigger className="text-xl font-semibold">
              {category.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <Image
                        src={process.env.NEXT_PUBLIC_HOST + item.image}
                        alt={item.name}
                        width={500}
                        height={500}
                        className="w-full h-48 object-cover"
                      />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge
                          variant={
                            item.status === "active" ? "default" : "secondary"
                          }
                        >
                          {item.status === "active" ? "Mavjud" : "Arxivlangan"}
                        </Badge>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="font-semibold text-lg">
                          {parseInt(item.price).toLocaleString()} so&#39;m
                        </p>
                        <Badge variant="outline">Qoldiq: {item.stock}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
