import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const price = typeof product.price === 'string'
      ? parseFloat(product.price.replace(/[^0-9.]/g, ''))
      : product.price;

    addToCart({
      id: product.id,
      type: 'product',
      name: product.title,
      price: price,
      quantity: 1,
      image: product.image
    });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgb(34,197,94,0.3)] flex items-center gap-3 border border-green-400">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-wide">Added to your sacred cart</span>
        </div>
      )}

      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="w-full max-w-sm rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-white overflow-hidden group hover:shadow-[0_20px_40px_rgba(217,119,6,0.12)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer border border-[#F5F5F4] flex flex-col h-full"
      >
        {/* Product Image */}
        <div className="relative h-60 bg-[#FDFBF7] flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="relative w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />

          <button
            onClick={handleFavorite}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-110 hover:bg-white transition-all duration-300 border border-[#E7E5E4]"
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-[#A8A29E]'}`} />
          </button>
        </div>

        {/* Info */}
        <div className="p-5 lg:p-6 flex flex-col flex-1 bg-white">
          <div className="mb-auto">
            <h3 className="text-lg font-bold text-[#1B1917] mb-2 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              {product.title}
            </h3>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {product.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-orange-50 rounded-full border border-orange-100">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm text-[#78716C] mb-4 line-clamp-2 font-medium leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider mb-0.5">मूल्य (Price)</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-[#D97706]">NPR</span>
              <span className="text-2xl font-extrabold text-[#D97706] tracking-tight">{product.price.toString().replace('NPR ', '')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-auto">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#D97706]/10 hover:bg-[#D97706] text-[#D97706] hover:text-white font-bold text-sm transition-all duration-300 border border-[#D97706]/20 hover:border-[#D97706] hover:shadow-[0_8px_20px_rgba(217,119,6,0.25)] active:scale-[0.97]"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(e);
                navigate('/checkout');
              }}
              className="px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all duration-300 shadow-[0_4px_12px_rgb(239,68,68,0.25)] hover:shadow-[0_8px_20px_rgb(239,68,68,0.35)] active:scale-[0.97]"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Bottom accent bar on hover */}
        <div className="h-1 bg-gradient-to-r from-[#D97706] to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </>
  );
}
