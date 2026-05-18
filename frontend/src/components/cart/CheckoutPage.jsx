import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderAPI, paymentAPI } from "../../services/api";
import { CreditCard, Wallet, Building2, CheckCircle, MapPin, LocateFixed } from "lucide-react";
import { validateForm, isValid } from "../../utils/validators";

const DEFAULT_LAT = 27.7172;
const DEFAULT_LNG = 85.324;

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return data.display_name || '';
  } catch {
    return '';
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const buyNowItem = location.state?.buyNowItem;
  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;
  const { user } = useAuth();

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletMapRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "",
    address: "", city: "", postalCode: "", paymentMethod: "cod",
  });
  const [pinLocation, setPinLocation] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
      }));
    }
  }, [user]);

  // Load Leaflet CSS
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  // Init map
  useEffect(() => {
    const initMap = () => {
      if (leafletMapRef.current) return;
      const L = window.L;
      const map = L.map(mapRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], { draggable: true })
        .addTo(map)
        .bindTooltip('Drag me or click map to set delivery location', { permanent: false, direction: 'top' });

      const onMove = async (lat, lng) => {
        setPinLocation({ lat, lng });
        const addr = await reverseGeocode(lat, lng);
        if (addr) setFormData(prev => ({ ...prev, address: addr }));
      };

      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng();
        onMove(lat, lng);
      });
      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        onMove(e.latlng.lat, e.latlng.lng);
      });

      leafletMapRef.current = map;
      markerRef.current = marker;
      detectLocation(map, marker, onMove);
    };

    let script = document.getElementById('leaflet-js');
    if (!script) {
      script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else if (window.L) {
      initMap();
    } else {
      script.addEventListener('load', initMap);
    }
  }, []);

  const detectLocation = (map, marker, onMove) => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        map.setView([lat, lng], 16);
        marker.setLatLng([lat, lng]);
        onMove(lat, lng);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const handleLocateMe = () => {
    if (!leafletMapRef.current || !markerRef.current) return;
    detectLocation(leafletMapRef.current, markerRef.current, async (lat, lng) => {
      setPinLocation({ lat, lng });
      const addr = await reverseGeocode(lat, lng);
      if (addr) setFormData(prev => ({ ...prev, address: addr }));
    });
  };

  const subtotal = buyNowItem ? buyNowItem.price * buyNowItem.quantity : getCartTotal();
  const delivery = subtotal > 5000 ? 0 : 100;
  const total = subtotal + delivery;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const _errors = validateForm(formData, ['fullName', 'email', 'phone', 'city', 'postalCode'], ['fullName', 'email', 'phone', 'city']);
    if (!formData.address.trim()) _errors.address = "Delivery address is required.";
    if (!isValid(_errors)) { setError(Object.values(_errors)[0]); return; }
    setLoading(true);

    try {
      const orderPayload = {
        total_amount: total,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        payment_method: formData.paymentMethod,
        latitude: pinLocation.lat,
        longitude: pinLocation.lng,
        items: checkoutItems.map(item => ({
          product_id: item.type === 'product' ? item.id : null,
          bundle_id: item.type === 'bundle' ? item.id : null,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const order = await orderAPI.create(orderPayload);
      const orderId = order.order_id;

      if (formData.paymentMethod === 'esewa') {
        const esewaData = await paymentAPI.esewaInitiate(orderId);
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = esewaData.gateway_url;
        const fields = {
          amount: esewaData.amount, tax_amount: esewaData.tax_amount,
          total_amount: esewaData.total_amount, transaction_uuid: esewaData.transaction_uuid,
          product_code: esewaData.product_code, product_service_charge: esewaData.product_service_charge,
          product_delivery_charge: esewaData.product_delivery_charge,
          success_url: esewaData.success_url, failure_url: esewaData.failure_url,
          signed_field_names: esewaData.signed_field_names, signature: esewaData.signature,
        };
        Object.entries(fields).forEach(([k, v]) => {
          const input = document.createElement('input');
          input.type = 'hidden'; input.name = k; input.value = v;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        if (!buyNowItem) clearCart();
        form.submit();
        return;
      }

      if (!buyNowItem) clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 rounded-2xl bg-white border border-[#E7E5E4] text-[#1B1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#D97706]/60 focus:shadow-[0_0_0_3px_rgba(217,119,6,0.08)] transition-all font-medium text-sm";

  const paymentOptions = [
    { value: "cod", label: "Cash on Delivery", sub: "Pay when you receive", Icon: Wallet },
    { value: "esewa", label: "eSewa", sub: "Digital wallet", Icon: CreditCard },
    { value: "bank", label: "Bank Transfer", sub: "Direct bank payment", Icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-[#F0EDE5]" style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}>
      <Header />
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="mb-8" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          <h1 className="text-4xl font-extrabold text-[#1B1917] tracking-tight">
            भुक्तानी <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">प्रक्रिया</span>
          </h1>
          <p className="text-[#78716C] font-medium mt-1">Complete your sacred purchase</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Info */}
              <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#D97706]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1B1917]">Delivery Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#57534E] mb-2">Full Name *</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Your full name" className={inputClass} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#57534E] mb-2">Email *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#57534E] mb-2">Phone *</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="98XXXXXXXX" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#57534E] mb-2">Delivery Address *</label>
                    <textarea name="address" required value={formData.address} onChange={handleChange} rows="3" placeholder="Street address, apartment, tole..." className={`${inputClass} resize-none`} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#57534E] mb-2">City *</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleChange} placeholder="Kathmandu" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#57534E] mb-2">Postal Code</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="44600" className={inputClass} />
                    </div>
                  </div>

                  {/* Delivery Location Map */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-[#57534E] flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#D97706]" /> Pin Exact Delivery Location
                      </label>
                      <button
                        type="button"
                        onClick={handleLocateMe}
                        disabled={locating}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:text-[#B45309] transition-colors disabled:opacity-50"
                      >
                        <LocateFixed className="w-3.5 h-3.5" />
                        {locating ? "Detecting..." : "Use My Location"}
                      </button>
                    </div>
                    <div ref={mapRef} className="w-full h-56 rounded-2xl border border-[#E7E5E4] overflow-hidden shadow-sm" style={{ zIndex: 0 }} />
                    <p className="text-xs text-[#A8A29E] mt-2 font-medium">
                      📍 Drag the pin or click the map to set your exact delivery point. Address above updates automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#D97706]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1B1917]">Payment Method</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentOptions.map(({ value, label, sub, Icon }) => (
                    <label key={value} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === value ? 'border-[#D97706] bg-orange-50/50 shadow-sm' : 'border-[#E7E5E4] hover:border-orange-200 bg-[#FDFBF7]'
                    }`}>
                      <input type="radio" name="paymentMethod" value={value} checked={formData.paymentMethod === value} onChange={handleChange} className="hidden" />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.paymentMethod === value ? 'bg-[#D97706] text-white' : 'bg-white text-[#A8A29E] border border-[#E7E5E4]'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1B1917] text-sm">{label}</p>
                        <p className="text-xs text-[#78716C]">{sub}</p>
                      </div>
                      {formData.paymentMethod === value && (
                        <div className="ml-auto w-5 h-5 bg-[#D97706] rounded-full flex items-center justify-center text-white text-xs">✓</div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4] sticky top-24">
                <h2 className="text-xl font-bold text-[#1B1917] mb-5" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>अर्डर सारांश</h2>
                <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
                  {checkoutItems.map(item => (
                    <div key={`${item.type}-${item.id}`} className="flex justify-between items-start text-sm gap-3">
                      <span className="text-[#57534E] font-medium line-clamp-2 flex-1">{item.name} <span className="text-[#A8A29E]">x{item.quantity}</span></span>
                      <span className="font-bold text-[#1B1917] shrink-0">NPR {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#F5F5F4] pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-[#57534E] font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1B1917]">NPR {subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#57534E] font-medium">
                    <span>Delivery</span>
                    <span className={`font-bold ${delivery === 0 ? 'text-green-600' : 'text-[#1B1917]'}`}>
                      {delivery === 0 ? 'Free 🎉' : `NPR ${delivery}`}
                    </span>
                  </div>
                  <div className="border-t border-[#F5F5F4] pt-3 flex justify-between">
                    <span className="text-base font-extrabold text-[#1B1917]">Total</span>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#A8A29E]">NPR </span>
                      <span className="text-2xl font-extrabold text-[#D97706] tracking-tight">{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading || checkoutItems.length === 0}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-[0_8px_20px_rgb(239,68,68,0.2)] hover:shadow-[0_8px_30px_rgb(239,68,68,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mb-3">
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Processing...
                    </span>
                  ) : formData.paymentMethod === 'esewa' ? 'Pay with eSewa 🟢' : 'Place Order 🙏'}
                </button>
                <button type="button" onClick={() => navigate('/cart')} className="w-full bg-[#F9F7F4] hover:bg-[#F0EDE5] text-[#78716C] py-3.5 rounded-2xl font-semibold transition-all text-sm border border-[#E7E5E4]">
                  ← Back to Cart
                </button>
                <div className="mt-5 pt-4 border-t border-[#F5F5F4] space-y-2">
                  {["Secure & encrypted checkout", "Free delivery above NPR 5,000", "Easy returns within 7 days"].map((text, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#78716C] font-medium">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
