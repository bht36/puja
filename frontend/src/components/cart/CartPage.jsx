import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Header, Footer } from "../homepage";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();

  const getSubtotal = () => getCartTotal();
  const getDelivery = () => getSubtotal() > 5000 ? 0 : 100;
  const getTotal = () => getSubtotal() + getDelivery();

  return (
    <div className="min-h-screen bg-[#F0EDE5]" style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}>
      <Header />

      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* Page Title */}
        <div className="mb-8" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          <h1 className="text-4xl font-extrabold text-[#1B1917] tracking-tight">
            तपाईंको <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">कार्ट</span>
          </h1>
          <p className="text-[#78716C] font-medium mt-1">
            {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your sacred cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[32px] p-16 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4]">
            <ShoppingBag className="w-16 h-16 text-[#E7E5E4] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#1B1917] mb-2" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              तपाईंको कार्ट खाली छ
            </h2>
            <p className="text-[#78716C] font-medium mb-8">Add sacred items to begin your journey</p>
            <button
              onClick={() => navigate('/')}
              className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-[0_8px_20px_rgb(239,68,68,0.25)] hover:-translate-y-0.5"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4] flex items-center gap-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all"
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-2xl border border-[#F5F5F4] shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center text-2xl shrink-0">🕉️</div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1B1917] text-base mb-1 line-clamp-2 leading-snug" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                      {item.name}
                    </h3>
                    <p className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider mb-2">
                      {item.type === 'bundle-item' ? 'Bundle Item' : 'Product'}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-[#D97706]">NPR</span>
                      <span className="text-lg font-extrabold text-[#D97706] tracking-tight">{item.price}</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-[#F9F7F4] border border-[#E7E5E4] rounded-2xl p-1.5 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-[#F5F5F4] flex items-center justify-center text-[#57534E] transition-colors shadow-sm"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-[#1B1917] text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                      className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-600 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider mb-0.5">Subtotal</p>
                    <p className="text-base font-extrabold text-[#1B1917]">NPR {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.type)}
                    className="p-2.5 text-[#A8A29E] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4] sticky top-24">
                <h2 className="text-xl font-bold text-[#1B1917] mb-6" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                  अर्डर सारांश
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[#57534E] font-medium text-sm">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1B1917]">NPR {getSubtotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#57534E] font-medium text-sm">
                    <span>Delivery</span>
                    <span className={`font-bold ${getDelivery() === 0 ? 'text-green-600' : 'text-[#1B1917]'}`}>
                      {getDelivery() === 0 ? 'Free 🎉' : `NPR ${getDelivery()}`}
                    </span>
                  </div>
                  {getDelivery() > 0 && (
                    <p className="text-xs text-[#A8A29E] bg-orange-50 px-3 py-2 rounded-xl border border-orange-100">
                      Add NPR {(5000 - getSubtotal()).toLocaleString('en-IN')} more for free delivery
                    </p>
                  )}
                  <div className="border-t border-[#F5F5F4] pt-3 flex justify-between">
                    <span className="text-lg font-extrabold text-[#1B1917]">Total</span>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#A8A29E]">NPR </span>
                      <span className="text-2xl font-extrabold text-[#D97706] tracking-tight">{getTotal().toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-[0_8px_20px_rgb(239,68,68,0.2)] hover:shadow-[0_8px_30px_rgb(239,68,68,0.3)] hover:-translate-y-0.5 mb-3"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-[#F9F7F4] hover:bg-[#F0EDE5] text-[#78716C] hover:text-[#1B1917] py-3.5 rounded-2xl font-semibold transition-all text-sm border border-[#E7E5E4]"
                >
                  Continue Shopping
                </button>

                <div className="mt-6 pt-4 border-t border-[#F5F5F4] space-y-2.5">
                  {["Secure checkout", "Free delivery above NPR 5,000", "Easy returns within 7 days"].map((text, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#78716C] font-medium">
                      <span className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-[10px] shrink-0">✓</span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
