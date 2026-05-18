import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { orderAPI } from "../../services/api";
import { CheckCircle, ShoppingBag } from "lucide-react";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderAPI.detail(orderId).then(setOrder).catch(() => {});
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#F0EDE5]">
      <Header />
      <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fadeIn">
        <div className="bg-white rounded-[32px] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4] relative overflow-hidden">

          {/* Confetti dots */}
          {["top-4 left-8 bg-[#D97706]", "top-8 right-12 bg-red-400", "top-16 left-1/3 bg-amber-300",
            "top-6 right-6 bg-orange-300", "top-20 right-1/4 bg-red-300"].map((cls, i) => (
            <div key={i} className={`absolute w-2 h-2 rounded-full ${cls} animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />
          ))}

          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
          <img src="https://img.icons8.com/fluency/96/praying-hands.png" alt="Thanks" className="w-12 h-12 mx-auto mb-3" />
          <h1 className="text-3xl font-extrabold text-[#1B1917] mb-2" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            धन्यवाद!
          </h1>
          <p className="text-[#78716C] font-medium mb-1">Order #{orderId} placed successfully.</p>

          {order && (
            <>
              <p className="text-[#D97706] font-bold text-xl mb-4">NPR {Number(order.total_amount).toLocaleString('en-IN')}</p>
              {order.items?.length > 0 && (
                <div className="bg-[#F9F7F4] rounded-2xl p-4 mb-4 text-left space-y-1">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-[#57534E]">
                      <span>{item.product_name || item.bundle_name} <span className="text-[#A8A29E]">×{item.quantity}</span></span>
                      <span className="font-semibold">NPR {Number(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold px-4 py-2 rounded-full mb-6">
                🚚 Delivered within 3–5 business days
              </div>
            </>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={() => navigate("/orders")}
              className="w-full py-3.5 bg-[#C28142] hover:bg-[#a06a30] text-white rounded-2xl font-bold transition-all">
              View My Orders
            </button>
            <button onClick={() => navigate("/")}
              className="w-full py-3.5 bg-white border border-[#E7E5E4] hover:border-orange-200 text-[#1B1917] rounded-2xl font-semibold transition-all text-sm flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
