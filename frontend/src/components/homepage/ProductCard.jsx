import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "../common/Button";

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  return (
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
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
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
          <button className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all"
            onClick={(e) => e.stopPropagation()}
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
  );
}
