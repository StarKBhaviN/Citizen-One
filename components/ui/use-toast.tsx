import { useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  title: string;
  description: string;
  duration?: number;
  type?: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = ({ title, description, duration = 3000, type = "info" }: ToastProps) => {
    setToast({ title, description, type });

    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  return { toast, showToast };
}