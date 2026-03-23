import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Heart, ShoppingCart, Star, Minus, Plus, Share2, Shield, Truck, RotateCcw } from "lucide-react";
import { Header, Footer } from "../homepage";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      type: 'product',
      name: product.name,
      price: parseFloat(product.price),
      quantity: quantity,
      image: product.image ? `http://127.0.0.1:8000${product.image}` : ''
    });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-[#D97706] mx-auto mb-4"></div>
          <p className="text-[#78716C] font-semibold tracking-wide" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            उत्पादन लोड हुँदैछ...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F0EDE5]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className="text-2xl font-bold text-[#1B1917] mb-4">Product not found</h1>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold rounded-2xl transition-all shadow-md">
            Go Back Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = product.image
    ? [`http://127.0.0.1:8000${product.image}`]
    : ["https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&h=600&fit=crop"];

  return (
    <div className="min-h-screen bg-[#F0EDE5]" style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}>
      <Header />

      {/* Add to cart notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgb(34,197,94,0.3)] flex items-center gap-3 border border-green-400">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-wide">Added to your sacred cart</span>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#A8A29E] mb-8 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-[#D97706] transition-colors">Home</button>
          <span>/</span>
          <span className="text-[#1B1917]" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group border border-[#F5F5F4]">
              <div className="absolute inset-0 bg-[#FDFBF7] opacity-50" />
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="relative w-full h-96 object-contain transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 rounded-full bg-white shadow-sm border border-[#F5F5F4] hover:scale-110 hover:shadow-md transition-all">
                  <Share2 className="w-5 h-5 text-[#78716C]" />
                </button>
                <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 rounded-full bg-white shadow-sm border border-[#F5F5F4] hover:scale-110 hover:shadow-md transition-all">
                  <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-[#78716C]'}`} />
                </button>
              </div>
            </div>

            {productImages.length > 1 && (
              <div className="flex gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-1 rounded-2xl overflow-hidden border-4 transition-all ${
                      selectedImage === idx
                        ? 'border-orange-200 shadow-[0_8px_20px_rgba(217,119,6,0.15)] scale-105'
                        : 'border-transparent hover:border-orange-50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              {product.tags && product.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-orange-50/80 border border-orange-100 text-[#D97706] text-xs font-bold rounded-full uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1B1917] mb-3 tracking-tight leading-tight" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-orange-400 text-orange-400' : 'text-[#E7E5E4]'}`} />
                  ))}
                </div>
                <span className="text-[#A8A29E] font-medium text-sm">(4.0 rating)</span>
              </div>
              <p className="text-[#57534E] text-lg leading-relaxed font-medium">{product.description}</p>
            </div>

            {/* Price */}
            <div className="bg-white border border-[#E7E5E4] rounded-[24px] p-6 shadow-sm">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-5xl font-extrabold text-[#D97706] tracking-tight">NPR {parseFloat(product.price).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-green-600 font-bold flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                In Stock — Ready to Ship
              </p>
            </div>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:bg-[#FDFBF7] text-[#57534E] hover:text-black transition-colors">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 font-bold text-lg text-[#1B1917]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-4 hover:bg-[#FDFBF7] text-[#57534E] hover:text-black transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white border border-red-200 hover:border-red-500 hover:bg-red-50 text-red-600 py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-base transition-all shadow-[0_8px_20px_rgb(239,68,68,0.3)] hover:shadow-[0_8px_30px_rgb(239,68,68,0.4)] hover:-translate-y-0.5"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { Icon: Truck, label: "Free Delivery" },
                { Icon: Shield, label: "Secure Payment" },
                { Icon: RotateCcw, label: "Easy Returns" },
              ].map(({ Icon, label }) => (
                <div key={label} className="text-center p-4 bg-white rounded-2xl border border-[#F5F5F4] shadow-sm">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-[#D97706]" />
                  <p className="text-xs font-bold text-[#78716C] uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            {/* Description card */}
            <div className="bg-white rounded-[24px] p-6 border border-[#F5F5F4] shadow-sm">
              <h3 className="text-lg font-bold mb-3 text-[#1B1917]" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                उत्पादनको बारेमा (About this Product)
              </h3>
              <p className="text-[#57534E] font-medium leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
