import React, { useState } from "react";
import { useGet } from "../../hooks/useGet";
import { useRequest } from "../../hooks/useRequest";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";

type Location = {
  id: number;
  name: string;
};

type Route = {
  id: number;
  amount: number;
  loading: Location;
  unloading: Location;
};

type Client = {
  id: number;
  name: string;
  phone: string;
  requisite: string;
  requisite_file: string;
  accounting_phone: string;
  routes: Route[];
  type: string;
  inn: string;
  customer: string;
};

type OrderData = {
  client: number | "";
  loading: number | "";
  unloading: number | "";
  car_count: number;
  comment: string;
};

type ClientResponse = {
  total_pages: number;
  results: Client[];
};

const OrderPage = () => {
  const [addOrder, setAddOrder] = useState(false);
  const [formData, setFormData] = useState<OrderData>({
    client: "",
    loading: "",
    unloading: "",
    car_count: 1,
    comment: "",
  });
  const { post } = useRequest<OrderData>();
  const queryClient = useQueryClient();

  const { data: clients, isLoading, isError, error } = useGet<ClientResponse>("clients", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'client' || name === 'loading' || name === 'unloading' ? parseInt(value) || "" : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client || !formData.loading || !formData.unloading) {
      alert("All fields must be selected!");
      return;
    }

    try {
      await post("/orders/create-order/", {
        car_count: formData.car_count,
        client: formData.client,
        comment: formData.comment,
        loading: formData.loading,
        unloading: formData.unloading,
      },
      {
        contentType: "application/json",
        isConfirmed: true,
      });

      queryClient.invalidateQueries(["clients"], { refetchActive: true });

      setAddOrder(false);
      setFormData({
        client: "",
        loading: "",
        unloading: "",
        car_count: 1,
        comment: "",
      });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      } else {
        console.error("Failed to add order:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setAddOrder(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Add Order
      </button>

      {addOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[50vh]">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Yangi buyurtma</h2>
              <Button variant={"destructive"} onClick={() => setAddOrder(false)}>
                X
              </Button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Buyurtmachi</label>
                <select
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  {isLoading ? (
                    <option value="">Loading clients...</option>
                  ) : isError ? (
                    <option value="">{`Error: ${error instanceof Error ? error.message : "Unknown error"}`}</option>
                  ) : (
                    <>
                      <option disabled value="">Select following clients!</option>
                      {clients?.results?.map((client, index) => (
                        <option key={index} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Yuklash</label>
                  <select
                    name="loading"
                    value={formData.loading}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option disabled value="">Yuklash manzilini tanlang</option>
                    {formData.client && clients?.results
                      .find(client => client.id === formData.client)?.routes
                      .map((route) => {
                        if (!route.loading || !route.loading.name) return null;
                        return (
                          <option key={route.loading.id} value={route.loading.id}>
                            {route.loading.name}
                          </option>
                        );
                      })
                    }
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tushirish</label>
                  <select
                    name="unloading"
                    value={formData.unloading}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option disabled value="">Tushurish manzilini tanlang</option>
                    {formData.client && clients?.results
                      .find(client => client.id === formData.client)?.routes
                      .map((route) => {
                        if (!route.unloading || !route.unloading.name) return null;
                        return (
                          <option key={route.unloading.id} value={route.unloading.id}>
                            {route.unloading.name}
                          </option>
                        );
                      })
                    }
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mashinalar soni</label>
                <input
                  type="number"
                  name="car_count"
                  value={formData.car_count}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Qo'shimcha ma'lumot</label>
                <input
                  type="text"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Qo'shimcha ma'lumot"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
