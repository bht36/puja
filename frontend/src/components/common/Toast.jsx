import { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, CheckCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2500);
  }, []);

  const dismiss = (id) => setToasts(p => p.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
          {toasts.map(t => (
            <div key={t.id} className="animate-slideInRight flex items-center gap-3 bg-green-500 text-white px-5 py-3.5 rounded-2xl shadow-lg min-w-[220px]">
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span className="text-sm font-semibold flex-1">{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
