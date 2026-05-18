import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { orderAPI, reviewAPI } from "../../services/api";
import { Star, CheckCircle } from "lucide-react";

export default function ReviewPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    orderAPI.myOrders().then(data => {
      const list = Array.isArray(data) ? data : (data.results ?? []);
      setOrders(list.filter(o => o.status === 'delivered'));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setInterval(() => setCountdown(p => p - 1), 1000);
    const r = setTimeout(() => navigate("/"), 2000);
    return () => { clearInterval(t); clearTimeout(r); };
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 10) {
      setError("Comment must be at least 10 characters.");
      return;
    }
    setLoading(true); setError("");
    try {
      await reviewAPI.submit({ order_id: selected, rating, comment });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const activeRating = hovered || rating;

  return (
    <div className="min-h-screen bg-[#F0EDE5]">
      <Header />
      <div className="max-w-lg mx-auto px-4 py-16 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-[#1B1917] mb-8" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          समीक्षा <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">लेख्नुहोस्</span>
        </h1>

        {success ? (
          <div className="bg-white rounded-[24px] p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4]">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
            <p className="text-xl font-bold text-[#1B1917] mb-1">Review submitted!</p>
            <p className="text-sm text-[#A8A29E]">Redirecting to home in {countdown}s...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-t-4 border-t-[#C28142] border border-[#F5F5F4] space-y-5">
            {error && <p className="text-red-600 text-sm font-medium bg-red-50 px-4 py-3 rounded-2xl">{error}</p>}

            <div>
              <label className="block text-sm font-semibold text-[#57534E] mb-2">Select Order</label>
              {orders.length === 0 ? (
                <p className="text-sm text-[#78716C] bg-[#F9F7F4] px-4 py-3 rounded-2xl">
                  You haven't received any orders yet. Shop and come back to leave a review!
                </p>
              ) : (
                <select required value={selected || ""} onChange={e => setSelected(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E7E5E4] focus:outline-none focus:border-[#D97706]/60 text-[#1B1917] font-medium">
                  <option value="">-- Choose a delivered order --</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>Order #{o.id} — NPR {o.total_amount}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#57534E] mb-2">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110 active:scale-95">
                    <Star className={`w-8 h-8 transition-colors ${n <= activeRating ? 'fill-[#D97706] text-[#D97706]' : 'text-[#E7E5E4]'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#57534E] mb-2">Comment</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} required
                placeholder="Share your experience..."
                className="w-full px-4 py-3 rounded-2xl border border-[#E7E5E4] focus:outline-none focus:border-[#D97706]/60 text-[#1B1917] font-medium resize-none" />
            </div>

            <button type="submit" disabled={loading || !selected || orders.length === 0}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
