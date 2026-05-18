import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { CheckCircle, Upload, MapPin, Scale, FileText, Package, LocateFixed } from "lucide-react";
import { validators } from "../../utils/validators";

import { BASE } from "../../services/base";
const API = BASE;

const ICON8 = "https://img.icons8.com/fluency/96";

const METALS = [
  { icon: `${ICON8}/gold.png`, title: "Brass", nepali: "पित्तल", desc: "Old diyas, utensils, decorative pieces", rate: "NPR 180–220/kg", color: "from-yellow-50 to-amber-50", border: "border-amber-100", badge: "bg-amber-100 text-amber-700" },
  { icon: `${ICON8}/bronze.png`, title: "Bronze", nepali: "काँसा", desc: "Idols, bells, ritual items, plates", rate: "NPR 200–250/kg", color: "from-orange-50 to-red-50", border: "border-orange-100", badge: "bg-orange-100 text-orange-700" },
  { icon: `${ICON8}/copper.png`, title: "Copper", nepali: "तामा", desc: "Kalash, tumblers, water pots", rate: "NPR 600–700/kg", color: "from-red-50 to-rose-50", border: "border-red-100", badge: "bg-red-100 text-red-700" },
];

const STEPS = [
  { num: "01", label: "Submit Details", sub: "Fill the form below" },
  { num: "02", label: "We Pickup", sub: "Free doorstep collection" },
  { num: "03", label: "Get Paid", sub: "Instant fair valuation" },
];

const WHY_US = [
  { icon: `${ICON8}/money-bag.png`, title: "Best Market Rate", sub: "We offer the highest buyback prices" },
  { icon: `${ICON8}/truck.png`, title: "Free Pickup", sub: "Doorstep collection at no extra cost" },
  { icon: `${ICON8}/lightning-bolt.png`, title: "Instant Payment", sub: "Get paid same day of pickup" },
  { icon: `${ICON8}/recycle-bin.png`, title: "Eco Responsible", sub: "100% ethical metal recycling" },
];

const inputClass = "w-full px-4 py-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E5E4] text-[#1B1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#D97706]/70 focus:shadow-[0_0_0_3px_rgba(217,119,6,0.08)] transition-all font-medium text-sm";

const DEFAULT_LAT = 27.7172;
const DEFAULT_LNG = 85.324;

// Reverse geocode using Nominatim (free, no API key)
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

export default function ScrapSubmissionPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletMapRef = useRef(null);

  const [formData, setFormData] = useState({ item_name: "", weight: "", description: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG, address: "" });
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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

  // Init Leaflet map after component mounts
  useEffect(() => {
    let script = document.getElementById('leaflet-js');
    const initMap = () => {
      if (leafletMapRef.current) return; // already initialized
      const L = window.L;
      const map = L.map(mapRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], { draggable: true })
        .addTo(map)
        .bindTooltip('Drag me or click map to set location', { permanent: false, direction: 'top' });

      const onMove = async (lat, lng) => {
        const address = await reverseGeocode(lat, lng);
        setLocation({ lat, lng, address });
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

      // Auto-detect on load
      detectLocation(map, marker, onMove);
    };

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
      const address = await reverseGeocode(lat, lng);
      setLocation({ lat, lng, address });
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) { setError('Please upload a JPEG, PNG, or WebP image.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB.'); return; }
    setError('');
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.item_name.trim()) { setError("Item name is required."); return; }
    const weightErr = validators.weight(formData.weight);
    if (!formData.weight || Number(formData.weight) <= 0) { setError("Please enter a valid weight greater than 0."); return; }
    if (weightErr) { setError(weightErr); return; }
    if (!formData.description.trim()) { setError("Description is required."); return; }
    if (formData.description.trim().length < 10) { setError("Description must be at least 10 characters."); return; }
    if (!image) { setError("Please upload a photo of the scrap item."); return; }
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    data.append("latitude", location.lat);
    data.append("longitude", location.lng);
    data.append("address", location.address);
    data.append("image", image);
    try {
      const response = await fetch(`${API}/api/scrap/submit/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        body: data,
      });
      if (response.ok) { setSuccess(true); setTimeout(() => navigate("/"), 3500); }
      else { const err = await response.json(); setError(err.error || "Submission failed."); }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center">
      <div className="bg-white rounded-[32px] p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#F5F5F4] max-w-md w-full mx-4">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-12 h-12 text-green-500" /></div>
        <h2 className="text-3xl font-extrabold text-[#1B1917] mb-3" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>धन्यवाद!</h2>
        <p className="text-[#78716C] font-medium text-lg mb-2">Submission received successfully!</p>
        <p className="text-[#A8A29E] text-sm">Our team will contact you shortly for pickup.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0EDE5]" style={{ fontFamily: "Inter, Noto Sans, sans-serif" }}>
      <Header />

      <section className="relative bg-[#F0EDE5] py-16 lg:py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-200/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="h-[1px] w-10 bg-red-500" />
                <span className="text-red-600 text-sm font-bold tracking-[0.15em] uppercase">पुनर्जन्म सेवा</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-[#1B1917] mb-5 tracking-tight leading-[1.15]">
                पवित्र धातुको{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">पुनर्जन्म</span>
              </h1>
              <p className="text-[#57534E] text-lg max-w-xl font-medium leading-relaxed mb-10">
                Turn your unused brass, copper & bronze into fair cash — collected from your doorstep with care and respect.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                {STEPS.map((step) => (
                  <div key={step.num} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#E7E5E4] shadow-sm flex items-center justify-center shrink-0">
                      <span className="text-[#D97706] font-extrabold text-sm">{step.num}</span>
                    </div>
                    <div>
                      <p className="text-[#1B1917] font-bold text-sm">{step.label}</p>
                      <p className="text-[#A8A29E] text-xs font-medium">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-red-100 rounded-[48px] transform rotate-2 scale-105 opacity-50" />
              <div className="relative rounded-[48px] overflow-hidden shadow-2xl border-8 border-[#F5F5F4] h-80">
                <img src="https://images.unsplash.com/photo-1610444558552-32b00fdfbd88?w=800&h=600&fit=crop" alt="Sacred metals" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-6 bg-white px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-[#F5F5F4] flex items-center gap-3">
                <img src={`${ICON8}/recycle-bin.png`} alt="Recycle" className="w-7 h-7" />
                <div>
                  <p className="font-extrabold text-[#1B1917] text-sm">100% Recycled</p>
                  <p className="text-[#78716C] text-xs font-medium">Ethical & responsible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="mb-14">
          <div className="text-center mb-8" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
            <h2 className="text-3xl font-extrabold text-[#1B1917] mb-2">हामी के खरिद गर्छौं?</h2>
            <p className="text-[#78716C] font-medium">We accept these sacred metals at premium rates</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {METALS.map((m) => (
              <div key={m.title} className={`bg-gradient-to-br ${m.color} rounded-[24px] p-7 border ${m.border} hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 group`}>
                <img src={m.icon} alt={m.title} className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1B1917]">{m.title}</h3>
                    <p className="text-sm font-bold text-[#78716C]" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>{m.nepali}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${m.badge}`}>{m.rate}</span>
                </div>
                <p className="text-sm text-[#78716C] font-medium leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-[24px] p-7 border border-[#F5F5F4] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h3 className="text-lg font-bold text-[#1B1917] mb-5" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>किन हामीलाई छान्ने?</h3>
              {WHY_US.map(({ icon, title, sub }) => (
                <div key={title} className="flex items-start gap-4 py-4 border-b border-[#F5F5F4] last:border-0">
                  <div className="w-11 h-11 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                    <img src={icon} alt={title} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1B1917] text-sm">{title}</p>
                    <p className="text-xs text-[#78716C] font-medium mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-[#D97706]/10 to-red-600/5 rounded-[24px] p-7 border border-orange-100">
              <img src={`${ICON8}/phone.png`} alt="Phone" className="w-8 h-8 mb-2" />
              <h3 className="text-lg font-bold text-[#1B1917] mb-1">Need Help?</h3>
              <p className="text-sm text-[#78716C] font-medium mb-4">Call us before submitting if you have questions</p>
              <p className="font-extrabold text-[#D97706] text-lg">+977-1-4567890</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-[#F5F5F4]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center"><Package className="w-6 h-6 text-[#D97706]" /></div>
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1B1917]" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>स्क्र्याप सबमिट गर्नुहोस्</h2>
                  <p className="text-[#A8A29E] text-sm font-medium">Fill all fields for faster processing</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-3">
                  <span>⚠</span> {error}
                  <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#57534E] mb-2"><FileText className="w-4 h-4 text-[#D97706]" /> Item Name *</label>
                  <input type="text" value={formData.item_name} onChange={(e) => setFormData({ ...formData, item_name: e.target.value })} placeholder="e.g., Old brass diyas, copper kalash..." required className={inputClass} />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#57534E] mb-2"><Scale className="w-4 h-4 text-[#D97706]" /> Approximate Weight (grams) *</label>
                  <input type="number" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="e.g., 500" required min="1" className={inputClass} />
                  <p className="text-xs text-[#A8A29E] mt-2 font-medium">An approximate weight is fine — we'll weigh it precisely during pickup.</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#57534E] mb-2"><FileText className="w-4 h-4 text-[#D97706]" /> Description *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the condition, type, and quantity..." required rows={4} className={`${inputClass} resize-none`} />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#57534E] mb-2"><Upload className="w-4 h-4 text-[#D97706]" /> Upload Photo *</label>
                  <div onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${imagePreview ? "border-[#D97706]/40 bg-orange-50/50" : "border-[#E7E5E4] hover:border-[#D97706]/50 bg-[#FDFBF7]"}`}>
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-52 object-cover rounded-2xl" />
                        <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full">Change Photo</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-100 transition-colors"><Upload className="w-7 h-7 text-[#D97706]" /></div>
                        <div className="text-center">
                          <p className="font-bold text-[#1B1917] text-sm">Click to upload a photo</p>
                          <p className="text-[#A8A29E] text-xs mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" required onChange={handleImageChange} className="hidden" />
                  </div>
                </div>

                {/* Map Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#57534E]">
                      <MapPin className="w-4 h-4 text-[#D97706]" /> Pickup Location *
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
                  <div ref={mapRef} className="w-full h-72 rounded-2xl border border-[#E7E5E4] overflow-hidden shadow-sm" style={{ zIndex: 0 }} />
                  <div className={`mt-3 flex items-start gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium ${location.address ? "bg-orange-50 border border-orange-100 text-[#78716C]" : "bg-[#FDFBF7] border border-[#E7E5E4] text-[#A8A29E]"}`}>
                    <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${location.address ? "text-[#D97706]" : "text-[#A8A29E]"}`} />
                    <span>{location.address || "📍 Drag the pin or click anywhere on the map to set your pickup location"}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D97706] to-red-600 text-white font-bold text-base tracking-wide hover:from-[#B45309] hover:to-red-700 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(217,119,6,0.3)] disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Submitting Request...
                    </span>
                  ) : "Submit Scrap Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
