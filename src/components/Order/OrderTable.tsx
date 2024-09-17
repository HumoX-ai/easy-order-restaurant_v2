import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order, Restaurant } from "@/lib/data";

interface OrderTableProps {
  restaurant: Restaurant;
  orders: Order[];
  onOpenModal: (order: Order) => void;
}

export default function OrderTable({
  restaurant,
  orders,
  onOpenModal,
}: OrderTableProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{restaurant.name}</h2>
      <Table>
        <TableCaption>
          {restaurant.name} uchun buyurtmalar ro&#39;yxati
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Buyurtma ID</TableHead>
            <TableHead>Sana</TableHead>
            <TableHead>Holat</TableHead>
            <TableHead className="text-right">Umumiy qiymat</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Processing"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Shipped"
                      ? "bg-purple-100 text-purple-800"
                      : order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Canceled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status === "Pending"
                    ? "Kutilmoqda"
                    : order.status === "Processing"
                    ? "Jarayonda"
                    : order.status === "Shipped"
                    ? "Yuborildi"
                    : order.status === "Delivered"
                    ? "Yetkazildi"
                    : order.status === "Canceled"
                    ? "Bekor qilindi"
                    : "Noma'lum holat"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {order.total_price
                  .toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                so&#39;m
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenModal(order)}
                >
                  Batafsil
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
