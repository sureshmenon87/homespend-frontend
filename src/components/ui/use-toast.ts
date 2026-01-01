import { useState } from "react";

export function useToast() {
  const [toast, setToast] = useState<string | null>(null);

  return {
    toast,
    showToast: (msg: string) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
    },
  };
}
