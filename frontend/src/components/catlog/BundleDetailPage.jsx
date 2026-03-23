import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Header, Footer } from "../homepage";
import { ShoppingCart, Plus, Minus } from "lucide-react";

export default function BundleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemQuantities, setItemQuantities] = useState({});

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/bundles/${id}/`)
      .then(res => res.json())
      .then(data => {
        setBundle(data);
        const quantities = {};
        data.items?.forEach(item => {
          quantities[item.id] = 1;
        });
        setItemQuantities(quantities);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bundle:', err);
        setLoading(false);
      });
  }, [id]);

  const updateQuantity = (itemId, change) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const calculateTotal = () => {
    if (!bundle?.items) return 0;
    return bundle.items.reduce((sum, item) => 
      sum + (parseFloat(item.price) * (itemQuantities[item.id] || 0)), 0
    );
  };

  const getSelectedCount = () => {
    return Object.values(itemQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  const handleAddToCart = () => {
    bundle.items?.forEach(item => {
      const qty = itemQuantities[item.id] || 0;
      if (qty > 0) {
        addToCart({
          id: item.id,
          type: 'bundle-item',
          name: `${bundle.name} - ${item.name}`,
          price: parseFloat(item.price),
          quantity: qty,
          image: bundle.images?.[0]?.image ? `http://127.0.0.1:8000${bundle.images[0].image}` : ''
        });
      }
    });
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D97706] mx-auto"></div>
          <p className="mt-4 text-[#78716C] font-semibold tracking-wide">पवित्र प्याकेज लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-[#F0EDE5]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#1B1917] mb-4">पूजा सेट फेला परेन (Bundle not found)</h1>
          <button onClick={() => navigate('/categories')} className="px-6 py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold rounded-xl transition-all shadow-md">
            पछाडि जानुहोस् (Go Back)
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE5]" style={{fontFamily: 'Inter, Noto Sans, sans-serif'}}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Images & Info */}
          <div>
            <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-6">
              {bundle.images && bundle.images.length > 0 ? (
                <img 
                  src={`http://127.0.0.1:8000${bundle.images[0].image}`} 
                  alt={bundle.name} 
                  className="w-full h-80 lg:h-96 object-cover" 
                />
              ) : (
                <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <span className="text-white text-8xl drop-shadow-md">🙏</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>{bundle.name}</h1>
              </div>
            </div>

            {bundle.images && bundle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 lg:gap-3 mb-6">
                {bundle.images.slice(1, 5).map((img, idx) => (
                  <img 
                    key={idx}
                    src={`http://127.0.0.1:8000${img.image}`} 
                    alt={`${bundle.name} ${idx + 2}`}
                    className="w-full h-20 lg:h-24 object-cover rounded-2xl shadow-sm border border-white/50"
                  />
                ))}
              </div>
            )}

            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-[#F5F5F4]">
              <h2 className="text-xl font-bold text-[#1B1917] mb-4" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>सेटको बारेमा (About This Set)</h2>
              <p className="text-[#57534E] text-base leading-relaxed font-medium">{bundle.description}</p>
            </div>
          </div>

          {/* Right: Items Selection */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24 border border-[#F5F5F4]">
              <div className="flex justify-between items-end mb-8 border-b border-[#F5F5F4] pb-6">
                <div>
                  <p className="text-[#A8A29E] text-xs font-bold uppercase tracking-wider mb-2">कुल रकम (Total Price)</p>
                  <p className="text-4xl lg:text-5xl font-extrabold text-[#D97706] tracking-tight">NPR {calculateTotal().toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#A8A29E] text-xs font-bold uppercase tracking-wider mb-2">छानिएका सामग्री (Selected)</p>
                  <p className="text-3xl font-extrabold text-red-600">{getSelectedCount()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={getSelectedCount() === 0}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-4.5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgb(239,68,68,0.2)] hover:shadow-[0_8px_30px_rgb(239,68,68,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button 
                  disabled={getSelectedCount() === 0}
                  className="w-full bg-white border-2 border-red-100 hover:border-red-600 hover:text-red-700 disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-[#1B1917] py-4 rounded-2xl font-bold text-lg transition-all"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Bundle Items */}
            <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-[#F5F5F4]">
              <h3 className="text-xl font-bold text-[#1B1917] mb-5" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>सामग्रीहरूको सूची (Bundle Items)</h3>
              <div className="space-y-3">
                {bundle.items?.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl border border-[#E7E5E4] hover:border-orange-300 hover:bg-[#FDFBF7] transition-all duration-300 group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1B1917] text-base group-hover:text-red-600 transition-colors" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>{item.name}</h4>
                        <p className="text-xs text-[#78716C] mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                        <p className="text-sm font-extrabold text-[#D97706] mt-2 tracking-tight">NPR {item.price}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white border border-[#E7E5E4] rounded-xl p-1.5 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-[#F5F5F4] hover:bg-gray-200 flex items-center justify-center text-[#57534E] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-[#1B1917] text-base">{itemQuantities[item.id] || 0}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-500 hover:text-white text-red-600 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
