import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { orderAPI } from "../../services/api";
import { ShoppingBag } from "lucide-react";

const STATUS_COLOR = {
  pending:    "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped:    "bg-indigo-100 text-indigo-800",
  delivered:  "bg-green-100 text-green-800",
  cancelled:  "bg-red-100 text-red-800",
};

const ICON8 = "https://img.icons8.com/fluency/48";

const STATUS_ICON = {
  pending: <img src={`${ICON8}/hourglass.png`} alt="Pending" className="w-4 h-4" />,
  processing: <img src={`${ICON8}/settings.png`} alt="Processing" className="w-4 h-4" />,
  shipped: <img src={`${ICON8}/truck.png`} alt="Shipped" className="w-4 h-4" />,
  delivered: <img src={`${ICON8}/checkmark.png`} alt="Delivered" className="w-4 h-4" />,
  cancelled: <img src={`${ICON8}/cancel.png`} alt="Cancelled" className="w-4 h-4" />,
};

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    orderAPI.myOrders().then(data => setOrders(Array.isArray(data) ? data : (data.results ?? []))).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await orderAPI.cancel(id);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
    } catch (err) {
      alert(err.message || "Could not cancel order.");
    }
    setCancellingId(null);
    setConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-[#F0EDE5]" style={{ fontFamily: "Inter, Noto Sans, sans-serif" }}>
      <Header />
      <div className="max-w-[900px] mx-auto px-4 py-10 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-[#1B1917] mb-8 tracking-tight" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
          मेरो <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">अर्डरहरू</span>
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-[24px] animate-shimmer" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[32px] p-16 text-center shadow-sm border border-[#F5F5F4]">
            <ShoppingBag className="w-14 h-14 text-[#E7E5E4] mx-auto mb-4" />
            <p className="text-xl font-bold text-[#1B1917] mb-2">No orders yet</p>
            <button onClick={() => navigate("/")} className="mt-4 px-8 py-3 bg-[#C28142] hover:bg-[#a06a30] text-white rounded-2xl font-bold transition-all">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4]">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-bold text-[#1B1917] text-lg">Order #{order.id}</p>
                    <p className="text-sm text-[#78716C]">{new Date(order.created_at).toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap justify-end">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {STATUS_ICON[order.status]} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-lg font-extrabold text-[#D97706]">NPR {Number(order.total_amount).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm text-[#57534E] gap-3">
                      <div className="flex items-center gap-2">
                        <span>{item.product_name || item.bundle_name} <span className="text-[#A8A29E]">×{item.quantity}</span></span>
                      </div>
                      <span className="font-semibold text-[#1B1917] shrink-0">NPR {Number(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F4]">
                  <p className="text-xs text-[#A8A29E]">
                    {order.delivery_city && `📍 ${order.delivery_city}`} · {order.payment_method?.toUpperCase()}
                  </p>
                  {order.status === "pending" && (
                    <button onClick={() => setConfirmId(order.id)}
                      className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition-all">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />

      {/* Cancel confirmation modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-[#1B1917] mb-2">Cancel Order?</h3>
            <p className="text-sm text-[#78716C] mb-6">Are you sure you want to cancel Order #{confirmId}? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleCancel(confirmId)} disabled={cancellingId === confirmId}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50">
                {cancellingId === confirmId ? "Cancelling..." : "Yes, Cancel"}
              </button>
              <button onClick={() => setConfirmId(null)}
                className="flex-1 py-3 bg-[#F0EDE5] text-[#57534E] font-semibold rounded-2xl transition-all hover:bg-[#E7E5E4]">
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
