import React, { useState } from "react";
import { Button } from "../common/Button";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star, Minus, Plus, ArrowLeft, Share2, Shield, Truck, RotateCcw } from "lucide-react";
import { Header } from "../homepage";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - replace with API call
  const product = {
    id: 1,
    title: "धूप बत्ती सेट",
    description: "Traditional sandalwood incense sticks for daily prayers. Made from pure sandalwood and natural ingredients, these incense sticks create a divine atmosphere perfect for meditation and spiritual practices.",
    price: "NPR 220",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop"
    ],
    tags: ["Sandalwood", "Premium", "Natural"],
    features: [
      "100% Natural Ingredients",
      "Long-lasting Fragrance",
      "Eco-friendly Packaging",
      "Hand-rolled by Artisans"
    ],
    specifications: {
      "Weight": "100g",
      "Sticks": "50 pieces",
      "Burn Time": "45 minutes per stick",
      "Fragrance": "Sandalwood"
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE5]" style={{fontFamily: 'Inter, Noto Sans, sans-serif'}}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-3xl p-8 shadow-xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 opacity-50"></div>
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="relative w-full h-96 object-contain transform group-hover:scale-110 transition-transform duration-500"
              />
              {/* Share and Favorite buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 rounded-full bg-white shadow-lg hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 rounded-full bg-white shadow-lg hover:scale-110 transition-transform">
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-1 rounded-2xl overflow-hidden border-4 transition-all ${
                    selectedImage === idx ? 'border-purple-500 shadow-lg' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-3">
                {product.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full uppercase">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-gray-600">{product.rating} ({product.reviews} reviews)</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-5xl font-bold text-purple-600">{product.price}</span>
                <span className="text-gray-500 line-through text-xl">NPR 300</span>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">27% OFF</span>
              </div>
              <p className="text-green-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                In Stock - Ready to Ship
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <Button>Buy Now</Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <Truck className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-semibold text-gray-700">Free Delivery</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-semibold text-gray-700">Secure Payment</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-semibold text-gray-700">Easy Returns</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 pb-2">
                    <p className="text-sm text-gray-500">{key}</p>
                    <p className="font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
