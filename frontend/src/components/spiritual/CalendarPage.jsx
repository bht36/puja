import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../homepage/Header";
import Footer from "../homepage/Footer";

export default function CalendarPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0EDE5]">
      <Header />
      <div className="max-w-[900px] mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="text-[#D97706] text-sm font-semibold mb-6 flex items-center gap-1 hover:text-red-600 transition-colors"
        >
          ← फिर्ता जानुहोस्
        </button>

        <div className="text-center mb-8" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📅</div>
          <h1 className="text-3xl font-extrabold text-[#1B1917]">चाडपर्व क्यालेन्डर २०८३</h1>
          <p className="text-[#78716C] mt-1 text-sm">तिथि, विवाह मुहूर्त, ब्रतबन्ध र सबै चाडपर्वको जानकारी</p>
        </div>

        <div className="flex justify-center">
          <iframe
            src="https://www.hamropatro.com/widgets/calender-full.php"
            frameBorder="0"
            scrolling="no"
            marginWidth="0"
            marginHeight="0"
            style={{ border: "none", overflow: "hidden", width: "800px", height: "840px" }}
            allowTransparency="true"
            title="Hamro Patro - Nepali Calendar 2083"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
