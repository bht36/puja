import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../common/Toast";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const getPrice = () => typeof product.price === 'string'
    ? parseFloat(product.price.replace(/[^0-9.]/g, ''))
    : product.price;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ id: product.id, type: 'product', name: product.title, price: getPrice(), quantity: 1, image: product.image });
    showToast("Added to your sacred cart");
  };

  const visibleTags = product.tags?.slice(0, 2) ?? [];
  const extraTags = (product.tags?.length ?? 0) - 2;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="w-full max-w-sm rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-white overflow-hidden group hover:shadow-[0_20px_40px_rgba(217,119,6,0.12)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer border border-[#F5F5F4] flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-52 bg-[#FDFBF7] overflow-hidden">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-[#1B1917] mb-2 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          {product.title}
        </h3>

        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {visibleTags.map((tag, i) => (
              <span key={i} className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-orange-50 rounded-full border border-orange-100">{tag}</span>
            ))}
            {extraTags > 0 && <span className="px-2.5 py-0.5 text-[10px] font-bold text-[#A8A29E] bg-[#F5F5F4] rounded-full">+{extraTags}</span>}
          </div>
        )}

        <p className="text-sm text-[#78716C] mb-4 line-clamp-2 font-medium leading-relaxed flex-1">{product.description}</p>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-sm font-bold text-[#D97706]">NPR</span>
          <span className="text-2xl font-extrabold text-[#D97706] tracking-tight">{product.price.toString().replace('NPR ', '')}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-[#D97706]/10 hover:bg-[#D97706] text-[#D97706] hover:text-white font-bold text-sm transition-all border border-[#D97706]/20 hover:border-[#D97706] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate('/checkout', { state: { buyNowItem: { id: product.id, type: 'product', name: product.title, price: getPrice(), quantity: 1, image: product.image } } }); }}
            className="px-4 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all shadow-[0_4px_12px_rgb(239,68,68,0.25)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
