import React, { useState, useEffect } from "react";
import { Button } from "../common/Button";
import { useParams, useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { ShoppingCart, Plus, Minus } from "lucide-react";

export default function BundleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C28142] mx-auto"></div>
          <p className="mt-4 text-[#6B6560]">Loading bundle...</p>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-[#F0EDE5]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#1E1C25] mb-4">Bundle not found</h1>
          <button onClick={() => navigate('/categories')} className="px-6 py-3 bg-[#C28142] text-white rounded-lg">
            Back to Catalog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE5]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Images & Info */}
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
              {bundle.images && bundle.images.length > 0 ? (
                <img 
                  src={`http://127.0.0.1:8000${bundle.images[0].image}`} 
                  alt={bundle.name} 
                  className="w-full h-80 object-cover" 
                />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-8xl">🙏</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h1 className="text-3xl font-bold text-white">{bundle.name}</h1>
              </div>
            </div>

            {bundle.images && bundle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mb-6">
                {bundle.images.slice(1, 5).map((img, idx) => (
                  <img 
                    key={idx}
                    src={`http://127.0.0.1:8000${img.image}`} 
                    alt={`${bundle.name} ${idx + 2}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About This Set</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{bundle.description}</p>
            </div>
          </div>

          {/* Right: Items Selection */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4 border-2 border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Price</p>
                  <p className="text-4xl font-bold text-gray-900">NPR {calculateTotal().toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm mb-1">Items Selected</p>
                  <p className="text-3xl font-bold text-red-500">{getSelectedCount()}</p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Bundle Items */}
            <div className="bg-white rounded-2xl p-5 shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Bundle Items</h3>
              <div className="space-y-2">
                {bundle.items?.map(item => (
                  <div key={item.id} className="p-3 rounded-xl border border-gray-200 hover:border-purple-300 transition-all">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        <p className="text-sm font-bold text-purple-600 mt-1">NPR {item.price}</p>
                      </div>
                      
                      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded bg-white hover:bg-gray-100 flex items-center justify-center border border-gray-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{itemQuantities[item.id] || 0}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
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
