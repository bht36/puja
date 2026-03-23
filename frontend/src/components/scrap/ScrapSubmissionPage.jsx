import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { CheckCircle, Upload, MapPin, Scale, FileText, Package } from "lucide-react";

const METALS = [
  {
    icon: "🔶",
    title: "Brass",
    nepali: "पित्तल",
    desc: "Old diyas, utensils, decorative pieces",
    rate: "NPR 180–220/kg",
    color: "from-yellow-50 to-amber-50",
    border: "border-amber-100",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    icon: "🟤",
    title: "Bronze",
    nepali: "काँसा",
    desc: "Idols, bells, ritual items, plates",
    rate: "NPR 200–250/kg",
    color: "from-orange-50 to-red-50",
    border: "border-orange-100",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    icon: "🟠",
    title: "Copper",
    nepali: "तामा",
    desc: "Kalash, tumblers, water pots",
    rate: "NPR 600–700/kg",
    color: "from-red-50 to-rose-50",
    border: "border-red-100",
    badge: "bg-red-100 text-red-700",
  },
];

const STEPS = [
  { num: "01", label: "Submit Details", sub: "Fill the form below" },
  { num: "02", label: "We Pickup", sub: "Free doorstep collection" },
  { num: "03", label: "Get Paid", sub: "Instant fair valuation" },
];

export default function ScrapSubmissionPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({ item_name: "", weight: "", description: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState({ lat: 27.7172, lng: 85.324, address: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&libraries=places`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, []);

  const initMap = () => {
    const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 27.7172, lng: 85.324 },
      zoom: 13,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#f5f0e8" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#6b5a3e" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#fff8ef" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9d8e8" }] },
      ],
    });

    const markerInstance = new window.google.maps.Marker({
      position: { lat: 27.7172, lng: 85.324 },
      map: mapInstance,
      draggable: true,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#D97706",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    });

    markerInstance.addListener("dragend", () => {
      const pos = markerInstance.getPosition();
      updateLocation(pos.lat(), pos.lng());
    });
    mapInstance.addListener("click", (e) => {
      markerInstance.setPosition(e.latLng);
      updateLocation(e.latLng.lat(), e.latLng.lng());
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
        mapInstance.setCenter(pos);
        markerInstance.setPosition(pos);
        updateLocation(pos.lat, pos.lng);
      });
    }
  };

  const updateLocation = (lat, lng) => {
    setLocation((prev) => ({ ...prev, lat, lng }));
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setLocation({ lat, lng, address: results[0].formatted_address });
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("item_name", formData.item_name);
    data.append("weight", formData.weight);
    data.append("description", formData.description);
    data.append("latitude", location.lat);
    data.append("longitude", location.lng);
    data.append("address", location.address);
    if (image) data.append("image", image);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/scrap/submit/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/"), 3500);
      } else {
        const err = await response.json();
        setError(err.error || "Submission failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E5E4] text-[#1B1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#D97706]/70 focus:shadow-[0_0_0_3px_rgba(217,119,6,0.08)] transition-all font-medium text-sm";

  if (success) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center">
        <div className="bg-white rounded-[32px] p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#F5F5F4] max-w-md w-full mx-4">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1B1917] mb-3" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
            धन्यवाद! 🙏
          </h2>
          <p className="text-[#78716C] font-medium text-lg mb-2">Submission received successfully!</p>
          <p className="text-[#A8A29E] text-sm">Our team will contact you shortly for pickup.</p>
          <div className="mt-6 w-16 h-1 bg-gradient-to-r from-[#D97706] to-red-500 rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE5]" style={{ fontFamily: "Inter, Noto Sans, sans-serif" }}>
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-[#F0EDE5] py-16 lg:py-20 overflow-hidden">
        {/* Organic background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-200/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="h-[1px] w-10 bg-red-500" />
                <span className="text-red-600 text-sm font-bold tracking-[0.15em] uppercase">पुनर्जन्म सेवा</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-[#1B1917] mb-5 tracking-tight leading-[1.15]">
                पवित्र धातुको{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">
                  पुनर्जन्म
                </span>
              </h1>
              <p className="text-[#57534E] text-lg max-w-xl font-medium leading-relaxed mb-10">
                Turn your unused brass, copper & bronze into fair cash — collected from your doorstep with care and respect.
              </p>

              {/* Steps */}
              <div className="flex flex-col sm:flex-row gap-5">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
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

            {/* Image */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-red-100 rounded-[48px] transform rotate-2 scale-105 opacity-50" />
              <div className="relative rounded-[48px] overflow-hidden shadow-2xl border-8 border-[#F5F5F4] h-80">
                <img
                  src="https://images.unsplash.com/photo-1610444558552-32b00fdfbd88?w=800&h=600&fit=crop"
                  alt="Sacred metals"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-6 bg-white px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-[#F5F5F4] flex items-center gap-3">
                <span className="text-2xl">♻️</span>
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

        {/* Metal Cards */}
        <div className="mb-14">
          <div className="text-center mb-8" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
            <h2 className="text-3xl font-extrabold text-[#1B1917] mb-2">
              हामी के खरिद गर्छौं?
            </h2>
            <p className="text-[#78716C] font-medium">We accept these sacred metals at premium rates</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {METALS.map((m) => (
              <div
                key={m.title}
                className={`bg-gradient-to-br ${m.color} rounded-[24px] p-7 border ${m.border} hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 group`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">{m.icon}</div>
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

        {/* Main Form */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left sidebar info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-[24px] p-7 border border-[#F5F5F4] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h3 className="text-lg font-bold text-[#1B1917] mb-5" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
                किन हामीलाई छान्ने?
              </h3>
              {[
                { icon: "💰", title: "Best Market Rate", sub: "We offer the highest buyback prices" },
                { icon: "🚚", title: "Free Pickup", sub: "Doorstep collection at no extra cost" },
                { icon: "⚡", title: "Instant Payment", sub: "Get paid same day of pickup" },
                { icon: "♻️", title: "Eco Responsible", sub: "100% ethical metal recycling" },
              ].map(({ icon, title, sub }) => (
                <div key={title} className="flex items-start gap-4 py-4 border-b border-[#F5F5F4] last:border-0">
                  <div className="w-11 h-11 bg-orange-50 rounded-2xl flex items-center justify-center text-xl shrink-0">{icon}</div>
                  <div>
                    <p className="font-bold text-[#1B1917] text-sm">{title}</p>
                    <p className="text-xs text-[#78716C] font-medium mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#D97706]/10 to-red-600/5 rounded-[24px] p-7 border border-orange-100">
              <p className="text-2xl mb-2">📞</p>
              <h3 className="text-lg font-bold text-[#1B1917] mb-1">Need Help?</h3>
              <p className="text-sm text-[#78716C] font-medium mb-4">Call us before submitting if you have questions</p>
              <p className="font-extrabold text-[#D97706] text-lg">+977-1-4567890</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-[#F5F5F4]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#D97706]" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1B1917]" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
                    स्क्र्याप सबमिट गर्नुहोस्
                  </h2>
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
                {/* Item Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#57534E] mb-2">
                    <FileText className="w-4 h-4 text-[#D97706]" /> Item Name *
                  </label>
                  <input
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleChange}
                    placeholder="e.g., Old brass diyas, copper kalash..."
                    required
                    className={inputClass}
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#57534E] mb-2">
                    <Scale className="w-4 h-4 text-[#D97706]" /> Approximate Weight (grams) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    required
                    min="1"
                    className={inputClass}
                  />
                  <p className="text-xs text-[#A8A29E] mt-2 font-medium">An approximate weight is fine — we'll weigh it precisely during pickup.</p>
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#57534E] mb-2">
                    <FileText className="w-4 h-4 text-[#D97706]" /> Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the condition, type, and quantity of items..."
                    required
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#57534E] mb-2">
                    <Upload className="w-4 h-4 text-[#D97706]" /> Upload Photo *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${
                      imagePreview ? "border-[#D97706]/40 bg-orange-50/50" : "border-[#E7E5E4] hover:border-[#D97706]/50 bg-[#FDFBF7] hover:bg-orange-50/30"
                    }`}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-52 object-cover rounded-2xl" />
                        <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full">Change Photo</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                          <Upload className="w-7 h-7 text-[#D97706]" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-[#1B1917] text-sm">Click to upload a photo</p>
                          <p className="text-[#A8A29E] text-xs mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" required onChange={handleImageChange} className="hidden" />
                  </div>
                </div>

                {/* Map */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#57534E] mb-3">
                    <MapPin className="w-4 h-4 text-[#D97706]" /> Pickup Location *
                  </label>
                  <div id="map" className="w-full h-72 rounded-2xl border border-[#E7E5E4] overflow-hidden shadow-sm" />
                  <div className={`mt-3 flex items-start gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${location.address ? "bg-orange-50 border border-orange-100 text-[#78716C]" : "bg-[#FDFBF7] border border-[#E7E5E4] text-[#A8A29E]"}`}>
                    <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${location.address ? "text-[#D97706]" : "text-[#A8A29E]"}`} />
                    <span>{location.address || "Click on the map or drag the marker to set your pickup location"}</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-[#D97706] to-red-600 text-white font-bold text-base tracking-wide hover:from-[#B45309] hover:to-red-700 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(217,119,6,0.3)] hover:shadow-[0_8px_40px_rgba(217,119,6,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting Request...
                    </span>
                  ) : (
                    "Submit Scrap Request 🙏"
                  )}
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
