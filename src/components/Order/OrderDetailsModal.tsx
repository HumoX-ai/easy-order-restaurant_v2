import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getProductById,
  getUsersById,
  MenuItem,
  Order,
  UserInfo,
} from "@/lib/data";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setError, setLoading, updateOrderStatus } from "@/store/ordersSlice";
import axios from "axios";
import { useEffect, useState } from "react";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onUpdateStatus: (orderId: number, newStatus: string) => void;
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
}: OrderDetailsModalProps) {
  const [status, setStatus] = useState(order.status);
  const [user, setUser] = useState<UserInfo | null>();
  const [product, setProduct] = useState<MenuItem | null>();
  const loading = useAppSelector((state) => state.orders.loading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUsersById(order.customer);
      const product = await getProductById(order.product);
      setProduct(product);
      setUser(user);
    };

    fetchUser();
  }, [order.customer, order.product]);

  const handleUpdateOrderStatus = async (
    orderId: number,
    newStatus: string
  ) => {
    dispatch(setLoading(true));
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_HOST}/products/orders/${orderId}/`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      dispatch(updateOrderStatus({ orderId, status: newStatus }));
      onUpdateStatus(orderId, newStatus);
      setStatus(newStatus);
    } catch (error) {
      dispatch(setError("Buyurtma holatini yangilashda xatolik yuz berdi"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleStatusChange = (newStatus: string) => {
    handleUpdateOrderStatus(order.id, newStatus);
  };

  console.log(order.customer);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e1c1c]">
        <DialogHeader>
          <DialogTitle>Buyurtma #{order.id} tafsilotlari</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <p>
              <strong>Buyurtmachi:</strong> {user?.name}
            </p>
            <p>
              <strong>Telefon raqam:</strong> {user?.phone}
            </p>
            <p>
              <strong>Taom nomi:</strong> {product?.name} - {order.quantity} ta
            </p>
            <p>
              <strong>Sana:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Umumiy qiymat:</strong>{" "}
              {order.total_price
                .toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              so&#39;m
            </p>
          </div>
          <div>
            <label htmlFor="status" className="text-sm font-medium">
              Status:
            </label>
            <Select onValueChange={handleStatusChange} defaultValue={status}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Statusni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Kutilmoqda</SelectItem>
                <SelectItem value="Processing">Jarayonda</SelectItem>
                <SelectItem value="Shipped">Yuborildi</SelectItem>
                <SelectItem value="Delivered">Yetkazildi</SelectItem>
                <SelectItem value="Canceled">Bekor qilindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading && <p className="text-gray-500">Yuklanmoqda...</p>}{" "}
          {/* Yuklanmoqda holatini ko'rsatish */}
        </div>

        <Button onClick={onClose}>Yopish</Button>
      </DialogContent>
    </Dialog>
  );
}
