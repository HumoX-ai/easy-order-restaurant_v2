"use client";
import React, { useEffect, useState } from "react";
import OrderTable from "./OrderTable";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { RestaurantWithOrders } from "@/app/dashboard/orders/page";
import { Order } from "@/lib/data";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setOrders, updateOrderStatus } from "@/store/ordersSlice";

interface OrdersClientProps {
  restaurantsWithOrders: RestaurantWithOrders[];
}

export default function OrdersClient({
  restaurantsWithOrders,
}: OrdersClientProps) {
  const orders = useAppSelector((state) => state.orders.orders);
  const dispatch = useAppDispatch();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Agar Redux store bo'sh bo'lsa, uni to'ldiramiz
    if (orders.length === 0) {
      const allOrders = restaurantsWithOrders.flatMap(({ orders }) => orders);
      dispatch(setOrders(allOrders));
    }
  }, [restaurantsWithOrders, orders.length, dispatch]);

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrderStatus = (orderId: number, newStatus: string) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Restoran uchun online buyurtmalar
      </h1>
      {restaurantsWithOrders.length === 0 ? (
        <p className="text-gray-600">
          Hech qaysi restoraningiz uchun buyurtma topilmadi.
        </p>
      ) : (
        restaurantsWithOrders.map(({ restaurant }) => (
          <OrderTable
            key={restaurant.id}
            orders={orders.filter(
              (order) => order.restaurant === restaurant.id
            )}
            restaurant={restaurant}
            onOpenModal={handleOpenModal}
          />
        ))
      )}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          order={selectedOrder}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}
    </div>
  );
}
