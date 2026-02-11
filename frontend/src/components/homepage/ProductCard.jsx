import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "../common/Button";

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
    setTimeout(() => setShowNotification(false), 1000);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">Added to cart!</span>
        </div>
      )}
      
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="w-full max-w-sm rounded-3xl shadow-lg bg-white overflow-hidden group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
      >
      {/* Purple Gradient Top with Product */}
      <div className="relative h-56 bg-gradient-to-br from-[#6B5BB5] to-[#8F75D6] flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
        />
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* White Info Panel */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.title}</h3>
        
        {product.tags && (
          <div className="flex gap-2 mb-3">
            {product.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 text-xs font-medium uppercase text-gray-600 border border-gray-300 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4 line-clamp-3">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase text-gray-400 mb-1">Price</p>
            <p className="text-xl font-bold text-[#6B5BB5]">{product.price}</p>
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all hover:scale-110"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        <Button 
          fullWidth
          onClick={(e) => e.stopPropagation()}
        >
          Buy Now
        </Button>
      </div>
    </div>
    </>
  );
}
