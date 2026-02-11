import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { Button, Input, Textarea, Alert, Card } from "../common";

export default function ScrapSubmissionPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ item_name: "", weight: "", description: "" });
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: 27.7172, lng: 85.3240, address: "" });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&libraries=places`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, []);

  const initMap = () => {
    const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 27.7172, lng: 85.3240 },
      zoom: 13,
    });
    setMap(mapInstance);

    const markerInstance = new window.google.maps.Marker({
      position: { lat: 27.7172, lng: 85.3240 },
      map: mapInstance,
      draggable: true,
    });
    setMarker(markerInstance);

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
    setLocation({ ...location, lat, lng });
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setLocation({ lat, lng, address: results[0].formatted_address });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

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
        setMessage({ type: "success", text: "Scrap submission successful! Admin will review shortly." });
        setFormData({ item_name: "", weight: "", description: "" });
        setImage(null);
        setTimeout(() => navigate("/"), 3000);
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.error || "Submission failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#F0EDE5]">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">♻️</div>
          <h1 className="text-4xl font-bold text-[#1E1C25] mb-4">Scrap Metal Buyback</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Turn your unused brass, bronze, and copper items into cash.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { emoji: "🔶", title: "Brass", desc: "Premium quality brass items" },
            { emoji: "🟤", title: "Bronze", desc: "High-quality bronze items" },
            { emoji: "🟠", title: "Copper", desc: "Pure copper items" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow text-center">
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-lg text-[#1E1C25] mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <Card className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1E1C25]">Submit Your Scrap</h2>

          {message.text && (
            <Alert 
              type={message.type === "success" ? "success" : "error"} 
              message={message.text}
              onClose={() => setMessage({ type: "", text: "" })}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Item Name"
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              placeholder="e.g., Old brass utensils"
              required
            />

            <Input
              label="Weight (grams)"
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter weight in grams"
              required
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the items"
              rows={4}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
              <input
                type="file"
                required
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location *</label>
              <div id="map" className="w-full h-80 rounded-xl border border-gray-300 mb-2"></div>
              <p className="text-sm text-gray-600">📍 {location.address || "Click or drag marker to set location"}</p>
            </div>

            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
