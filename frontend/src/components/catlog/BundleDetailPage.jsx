import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Header, Footer } from "../homepage";
import { ShoppingCart, Plus, Minus, Package } from "lucide-react";
import { BASE } from "../../services/base";
const MEDIA = BASE.replace('/api', '');

const HeroSection = ({ bundle }) => (
  <div className="space-y-4">
    <div className="relative rounded-2xl overflow-hidden shadow-lg group">
      {bundle.images?.length > 0 ? (
        <img
          src={`${MEDIA}${bundle.images[0].image}`}
          alt={bundle.name}
          className="w-full h-72 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="w-full h-72 lg:h-96 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
          <img src="https://img.icons8.com/fluency/96/praying-hands.png" alt="Bundle" className="w-20 h-20" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-2 uppercase tracking-wide">
          Puja Bundle
        </span>
        <h1 className="text-2xl lg:text-3xl font-semibold text-white leading-tight">
          {bundle.name}
        </h1>
      </div>
    </div>

    {bundle.images?.length > 1 && (
      <div className="grid grid-cols-4 gap-2">
        {bundle.images.slice(1, 5).map((img, idx) => (
          <img
            key={idx}
            src={`${MEDIA}${img.image}`}
            alt={`${bundle.name} ${idx + 2}`}
            className="w-full h-20 object-cover rounded-xl border border-[#E7E5E4] hover:opacity-90 transition-opacity cursor-pointer"
          />
        ))}
      </div>
    )}

    <div className="bg-white rounded-2xl shadow-sm border border-[#F5F5F4] p-6">
      <h2 className="text-lg font-medium text-[#1B1917] mb-2">About This Set</h2>
      <p className="text-sm text-[#57534E] leading-relaxed">{bundle.description}</p>
    </div>
  </div>
);

const BundleItemCard = ({ item, quantity, onUpdate }) => (
  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#F9F7F4] hover:bg-[#F5F5F4] transition-all duration-200 hover:shadow-sm">
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-[#1B1917] text-sm">{item.name}</h4>
      {item.description && (
        <p className="text-xs text-[#78716C] mt-0.5 line-clamp-1">{item.description}</p>
      )}
      <p className="text-sm font-semibold text-[#D97706] mt-1">NPR {item.price}</p>
    </div>
    <div className="flex items-center gap-2 bg-white border border-[#E7E5E4] rounded-xl p-1 shadow-sm shrink-0">
      <button
        onClick={() => onUpdate(item.id, -1)}
        className="w-7 h-7 rounded-lg bg-[#F5F5F4] hover:bg-[#E7E5E4] flex items-center justify-center text-[#57534E] transition-colors active:scale-95"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-7 text-center font-semibold text-[#1B1917] text-sm">{quantity}</span>
      <button
        onClick={() => onUpdate(item.id, 1)}
        className="w-7 h-7 rounded-lg bg-orange-50 hover:bg-orange-500 hover:text-white text-[#D97706] flex items-center justify-center transition-colors active:scale-95"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const PriceCard = ({ total, selectedCount, onAddToCart, onBuyNow }) => (
  <div className="bg-white rounded-2xl shadow-md border border-[#F5F5F4] p-6 sticky top-24">
    <div className="flex justify-between items-center pb-5 mb-5 border-b border-[#F5F5F4]">
      <div>
        <p className="text-xs text-[#A8A29E] uppercase tracking-wider font-medium mb-1">Total Price</p>
        <p className="text-3xl font-bold text-[#D97706]">NPR {total.toFixed(2)}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-[#A8A29E] uppercase tracking-wider font-medium mb-1">Selected</p>
        <p className="text-2xl font-bold text-red-500">{selectedCount}</p>
      </div>
    </div>
    <div className="space-y-3">
      <button
        onClick={onAddToCart}
        disabled={selectedCount === 0}
        className="w-full bg-red-500 hover:bg-red-600 disabled:bg-[#E7E5E4] disabled:text-[#A8A29E] disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
      <button
        onClick={onBuyNow}
        disabled={selectedCount === 0}
        className="w-full border border-[#E7E5E4] hover:bg-[#F5F5F4] disabled:opacity-40 disabled:cursor-not-allowed text-[#1B1917] py-3 rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.98]"
      >
        Buy Now
      </button>
    </div>
  </div>
);

const ItemList = ({ items, itemQuantities, onUpdate }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-[#F5F5F4] p-6">
    <div className="flex items-center gap-2 mb-4">
      <Package className="w-5 h-5 text-[#D97706]" />
      <h3 className="text-lg font-medium text-[#1B1917]">Bundle Items</h3>
      <span className="ml-auto text-xs text-[#A8A29E] font-medium">{items?.length} items</span>
    </div>
    <div className="space-y-2">
      {items?.map(item => (
        <BundleItemCard
          key={item.id}
          item={item}
          quantity={itemQuantities[item.id] || 0}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  </div>
);

export default function BundleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemQuantities, setItemQuantities] = useState({});

  useEffect(() => {
    fetch(`${BASE}/bundles/${id}/`)
      .then(res => res.json())
      .then(data => {
        setBundle(data);
        const quantities = {};
        data.items?.forEach(item => { quantities[item.id] = 1; });
        setItemQuantities(quantities);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [id]);

  const updateQuantity = (itemId, change) => {
    setItemQuantities(prev => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) + change) }));
  };

  const calculateTotal = () => {
    if (!bundle?.items) return 0;
    return bundle.items.reduce((sum, item) => sum + (parseFloat(item.price) * (itemQuantities[item.id] || 0)), 0);
  };

  const getSelectedCount = () => Object.values(itemQuantities).reduce((sum, qty) => sum + qty, 0);

  const bundleCartItem = () => ({
    id: bundle.id,
    type: 'bundle',
    name: bundle.name,
    price: calculateTotal(),
    quantity: 1,
    image: bundle.images?.[0]?.image ? `${MEDIA}${bundle.images[0].image}` : ''
  });

  const handleAddToCart = () => addToCart(bundleCartItem());

  const handleBuyNow = () => navigate('/checkout', { state: { buyNowItem: bundleCartItem() } });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-[#78716C] font-medium">Loading bundle...</p>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-[#F9F7F4]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-[#1B1917] mb-4">Bundle not found</h1>
          <button onClick={() => navigate('/categories')} className="px-6 py-3 bg-orange-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-all">
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#A8A29E] mb-6 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-[#D97706] transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/categories')} className="hover:text-[#D97706] transition-colors">Categories</button>
          <span>/</span>
          <span className="text-[#1B1917]">{bundle.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          <HeroSection bundle={bundle} />

          <div className="space-y-6">
            <PriceCard
              total={calculateTotal()}
              selectedCount={getSelectedCount()}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
            <ItemList
              items={bundle.items}
              itemQuantities={itemQuantities}
              onUpdate={updateQuantity}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
