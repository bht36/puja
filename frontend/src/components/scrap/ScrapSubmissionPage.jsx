import React, { useState } from "react";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";

export default function ScrapSubmissionPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ item_name: "", weight: "", description: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const data = new FormData();
    data.append("item_name", formData.item_name);
    data.append("weight", formData.weight);
    data.append("description", formData.description);
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

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-[#1E1C25] mb-6">Submit Your Scrap</h2>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
              <input
                type="text"
                name="item_name"
                required
                value={formData.item_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none"
                placeholder="e.g., Old brass utensils"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (grams) *</label>
              <input
                type="number"
                name="weight"
                required
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none"
                placeholder="Enter weight in grams"
                min="1"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:outline-none"
                placeholder="Describe the items"
              />
            </div>

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

            <Button type="submit" disabled={loading} fullWidth>{loading ? "Submitting..." : "Submit Request"}</Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
