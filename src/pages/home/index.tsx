import { useState } from "react";
import axios from "axios";
import { useGet } from "../../hooks/useGet";
import { useDeleteOrderModal } from "../../hooks/useDeleteOrderModal";
import Header from "../../components/header";
import OrderModal from "../../components/orders/orderModal";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";

type Dispatcher = {
  id: number;
  code: string;
  date: string;
  comment: string;
  payment_type: string;
  client: string;
  dispatcher: {
    id: number;
    first_name: string;
    last_name: string;
  } | null;
};

export default function Home() {
  const [addOrder, setAddOrder] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // Use `useGet` to fetch orders
  const { data: orders, isLoading, isError, error, refetch } = useGet<Dispatcher[]>(
    "dispatchers/new-orders"
  );

  const { ModalComponent, openModal } = useDeleteOrderModal({
    onDelete: async (reason: string, orderId: number) => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Token is missing in localStorage");
        return;
      }

      try {
        await axios.delete(
          `https://imb.4fun.uz/api/v1/managers/delete-order/${orderId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: { comment: reason },
          }
        );

        alert(`Order muvaffaqiyatli o'chirildi! Sabab: ${reason}`);
        await refetch();
      } catch (err) {
        alert("Xatolik yuz berdi: Orderni o'chirishni imkoni bo'lmadi");
        console.error("Error deleting order:", err);
      }
    },
  });

  const token = localStorage.getItem("token");

  const handleGetRequest = async (id: number) => {
    try {
      await axios.get(
        `https://imb.4fun.uz/api/v1/dispatchers/book-order/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error(`Failed to fetch book order data for ID ${id}:`, err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message ?? "Something went wrong!"}</div>;

  return (
    <>
      <Header />
      <div className="container w-[1235px] m-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">New Orders</h1>
        <div className="space-y-4 flex space-x-10 flex-wrap">
          {orders?.map((order: Dispatcher) => (
            <Card
              key={order.id}
              className="rounded-xl border bg-card text-card-foreground shadow-md w-[50vh]"
            >
              <CardHeader className="flex flex-col">
                <CardTitle className="font-semibold leading-none tracking-tight">
                  Order Code: {order.code}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Date:</strong> {order.date}
                </p>
                <p>
                  <strong>Comment:</strong> {order.comment}
                </p>
                <p>
                  <strong>Payment Type:</strong> {order.payment_type}
                </p>
                <p>
                  <strong>Client:</strong> {order.client}
                </p>
                <p>
                  <strong>Dispatcher:</strong>{" "}
                  {order.dispatcher?.first_name ?? "N/A"}{" "}
                  {order.dispatcher?.last_name ?? "N/A"}
                </p>
              </CardContent>
              <CardFooter className="flex items-center p-6 pt-0">
                <div>
                  {!showButtons && (
                    <Button
                      variant="green"
                      className="w-[40vh]"
                      onClick={() => {
                        handleGetRequest(order.id);
                        setShowButtons(true);
                      }}
                    >
                      Band Qilish!
                    </Button>
                  )}
                  {showButtons && (
                    <div className="space-x-5">
                      <Button
                        variant="destructive"
                        onClick={() => openModal(order.id)}
                      >
                        Order o'chirish
                      </Button>
                      <Button
                        variant="green"
                        onClick={() => setShowButtons(false)}
                      >
                        Order qaytararish
                      </Button>
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}

          <Button
            variant="destructive"
            className="rounded-[50%] fixed bottom-10 right-5"
            onClick={() => setAddOrder(true)}
          >
            ➕
          </Button>

          {addOrder && <OrderModal />}
        </div>
      </div>
      {ModalComponent}
    </>
  );
}
