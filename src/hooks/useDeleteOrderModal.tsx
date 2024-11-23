import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface UseDeleteOrderModalProps {
  onDelete: (reason: string,orderId:number) => void;
}
export const useDeleteOrderModal = ({ onDelete }: UseDeleteOrderModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [orderId, setOrderId] = useState<number | null>(null);
  
    const openModal = (id: number) => {
      setOrderId(id);
      setIsOpen(true);
    };
  
    const closeModal = () => {
      setIsOpen(false);
      setReason("");
      setOrderId(null);
    };
  
    const handleConfirm = () => {
      if (reason.trim().split(" ").length >= 3) {
        if (orderId !== null) {
          onDelete(reason, orderId);
        }
        closeModal();
      } else {
        alert("Sabab kamida 3 ta so‘zdan iborat bo‘lishi kerak!");
      }
    };
  
    const ModalComponent = isOpen ? (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={closeModal}
      >
        <div
          className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">Orderni o'chirish</h2>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium mb-2">
              Sababni kiriting:
            </label>
            <Input
              id="reason"
              type="text"
              placeholder="Sababni yozing"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="secondary" onClick={closeModal}>
              Bekor qilish
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Tasdiqlash
            </Button>
          </div>
        </div>
      </div>
    ) : null;
  
    return { ModalComponent, openModal, closeModal };
  };
  