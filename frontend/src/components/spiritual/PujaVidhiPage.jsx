import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../homepage/Header";
import Footer from "../homepage/Footer";

const PUJAS = [
  {
    id: 1,
    name: "गणेश पूजा (Ganesh Puja)",
    description: "विघ्नहर्ता गणेशको पूजा — हरेक शुभ कार्यको सुरुवातमा गरिन्छ।",
    steps: [
      "स्नान गरी शुद्ध वस्त्र लगाउनुहोस्।",
      "पूजा स्थल सफा गरी गणेशको मूर्ति वा तस्वीर राख्नुहोस्।",
      "दियो बाल्नुहोस् र धूप जलाउनुहोस्।",
      "गणेशलाई रातो फूल, दुर्वा र मोदक चढाउनुहोस्।",
      "गणेश मन्त्र 'ॐ गं गणपतये नमः' १०८ पटक जप गर्नुहोस्।",
      "आरती गर्नुहोस् र प्रसाद वितरण गर्नुहोस्।",
    ],
  },
  {
    id: 2,
    name: "लक्ष्मी पूजा (Laxmi Puja)",
    description: "धन, समृद्धि र सौभाग्यकी देवी लक्ष्मीको पूजा।",
    steps: [
      "घर सफा गरी रंगोली बनाउनुहोस्।",
      "लक्ष्मीको मूर्ति वा तस्वीर पूर्व वा उत्तर दिशामा राख्नुहोस्।",
      "घिउको दियो बाल्नुहोस्।",
      "सेतो र गुलाबी फूल, कमल र बेलपत्र चढाउनुहोस्।",
      "खीर, मिठाई र फलफूल नैवेद्य चढाउनुहोस्।",
      "'ॐ श्रीं महालक्ष्म्यै नमः' मन्त्र जप गर्नुहोस्।",
      "लक्ष्मी आरती गाउनुहोस् र प्रसाद वितरण गर्नुहोस्।",
    ],
  },
  {
    id: 3,
    name: "शिव पूजा (Shiv Puja)",
    description: "महादेव शिवको अभिषेक र पूजा — सोमबार विशेष महत्त्व।",
    steps: [
      "ब्रह्म मुहूर्तमा उठी स्नान गर्नुहोस्।",
      "शिवलिंगमा जल, दूध, दही, मह र घिउले अभिषेक गर्नुहोस्।",
      "बेलपत्र, धतुरो र नीलो फूल चढाउनुहोस्।",
      "चन्दन र भस्म लगाउनुहोस्।",
      "'ॐ नमः शिवाय' मन्त्र जप गर्नुहोस्।",
      "शिव आरती गर्नुहोस्।",
    ],
  },
  {
    id: 4,
    name: "सत्यनारायण पूजा (Satyanarayan Puja)",
    description: "भगवान विष्णुको सत्यनारायण रूपको पूजा — मनोकामना पूर्तिका लागि।",
    steps: [
      "पूजाको एक दिन अगाडि व्रत संकल्प लिनुहोस्।",
      "पूजा स्थलमा केला र आँपको पात सजाउनुहोस्।",
      "विष्णुको मूर्ति स्थापना गर्नुहोस्।",
      "पञ्चामृत (दूध, दही, घिउ, मह, चिनी) ले अभिषेक गर्नुहोस्।",
      "तुलसी, पीला फूल र फलफूल चढाउनुहोस्।",
      "सत्यनारायण कथा पाठ गर्नुहोस्।",
      "आरती गरी प्रसाद (शीरा) वितरण गर्नुहोस्।",
    ],
  },
  {
    id: 5,
    name: "नवग्रह पूजा (Navagraha Puja)",
    description: "नौ ग्रहहरूको शान्तिका लागि गरिने विशेष पूजा।",
    steps: [
      "नवग्रह यन्त्र वा मूर्ति स्थापना गर्नुहोस्।",
      "प्रत्येक ग्रहको लागि विशेष रंगको फूल चढाउनुहोस्।",
      "तिल, जौ र घिउले हवन गर्नुहोस्।",
      "प्रत्येक ग्रहको बीज मन्त्र जप गर्नुहोस्।",
      "नवग्रह स्तोत्र पाठ गर्नुहोस्।",
      "ब्राह्मणलाई दान दिनुहोस्।",
    ],
  },
  {
    id: 6,
    name: "दुर्गा पूजा (Durga Puja)",
    description: "शक्तिकी देवी दुर्गाको पूजा — नवरात्रिमा विशेष महत्त्व।",
    steps: [
      "नवरात्रिको पहिलो दिन कलश स्थापना गर्नुहोस्।",
      "दुर्गाको मूर्ति वा तस्वीर सजाउनुहोस्।",
      "रातो फूल, सिन्दूर र चुनरी चढाउनुहोस्।",
      "दुर्गा सप्तशती पाठ गर्नुहोस्।",
      "'ॐ दुं दुर्गायै नमः' मन्त्र जप गर्नुहोस्।",
      "आरती गरी कन्या पूजन गर्नुहोस्।",
    ],
  },
];

export default function PujaVidhiPage() {
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0EDE5]">
      <Header />
      <div className="max-w-[800px] mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="text-[#D97706] text-sm font-semibold mb-6 flex items-center gap-1 hover:text-red-600 transition-colors">
          ← फिर्ता जानुहोस्
        </button>

        <div className="text-center mb-10" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📖</div>
          <h1 className="text-3xl font-extrabold text-[#1B1917]">पूजा विधि</h1>
          <p className="text-[#78716C] mt-2">परम्परागत हिन्दू अनुष्ठानहरूको चरणबद्ध मार्गदर्शन</p>
        </div>

        <div className="flex flex-col gap-4">
          {PUJAS.map(puja => (
            <div key={puja.id} className="bg-white rounded-2xl border border-[#F5F5F4] overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenId(openId === puja.id ? null : puja.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#FFF8F0] transition-colors"
              >
                <div>
                  <h2 className="text-base font-bold text-[#1B1917]" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>{puja.name}</h2>
                  <p className="text-sm text-[#78716C] mt-0.5">{puja.description}</p>
                </div>
                <span className={`text-[#D97706] text-xl ml-4 transition-transform duration-300 ${openId === puja.id ? "rotate-180" : ""}`}>⌄</span>
              </button>

              {openId === puja.id && (
                <div className="px-6 pb-6 border-t border-[#F5F5F4]">
                  <ol className="mt-4 flex flex-col gap-3">
                    {puja.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded-full bg-[#D97706] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <span className="text-sm text-[#57534E] leading-relaxed" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
