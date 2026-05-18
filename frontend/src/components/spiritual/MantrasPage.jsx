import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../homepage/Header";
import Footer from "../homepage/Footer";

const MANTRAS = [
  {
    id: 1,
    name: "गायत्री मन्त्र",
    sanskrit: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्।",
    transliteration: "Om Bhur Bhuvaḥ Svaḥ, Tat Savitur Vareṇyaṃ, Bhargo Devasya Dhīmahi, Dhiyo Yo Naḥ Prachodayāt.",
    meaning: "हे सूर्यदेव! हामी तपाईंको दिव्य प्रकाशको ध्यान गर्छौं। हाम्रो बुद्धिलाई सही मार्गमा प्रेरित गर्नुहोस्।",
    benefit: "बुद्धि, ज्ञान र आत्मिक शुद्धिका लागि।",
    deity: "सूर्य",
  },
  {
    id: 2,
    name: "महामृत्युञ्जय मन्त्र",
    sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात्।",
    transliteration: "Om Tryambakam Yajāmahe Sugandhim Puṣṭivardhanam, Urvārukamiva Bandhanān Mṛtyor Mukṣīya Māmṛtāt.",
    meaning: "हे त्रिनेत्र शिव! हामी तपाईंको पूजा गर्छौं। जसरी काँक्रो आफ्नो लहराबाट छुट्छ, त्यसरी हामीलाई मृत्युको बन्धनबाट मुक्त गर्नुहोस्।",
    benefit: "स्वास्थ्य, दीर्घायु र मृत्युभयबाट मुक्तिका लागि।",
    deity: "शिव",
  },
  {
    id: 3,
    name: "गणेश मन्त्र",
    sanskrit: "ॐ गं गणपतये नमः।",
    transliteration: "Om Gam Ganapataye Namah.",
    meaning: "हे गणपति! म तपाईंलाई नमस्कार गर्छु। सबै विघ्न हटाउनुहोस् र मेरो कार्यमा सफलता दिनुहोस्।",
    benefit: "विघ्न नाश, कार्य सिद्धि र नयाँ सुरुवातका लागि।",
    deity: "गणेश",
  },
  {
    id: 4,
    name: "लक्ष्मी मन्त्र",
    sanskrit: "ॐ श्रीं महालक्ष्म्यै नमः।",
    transliteration: "Om Shreem Mahalakshmyai Namah.",
    meaning: "हे महालक्ष्मी! म तपाईंलाई नमस्कार गर्छु। धन, समृद्धि र सौभाग्य प्रदान गर्नुहोस्।",
    benefit: "धन, समृद्धि र सुख-शान्तिका लागि।",
    deity: "लक्ष्मी",
  },
  {
    id: 5,
    name: "हनुमान चालीसा (पहिलो दोहा)",
    sanskrit: "श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि। बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि।।",
    transliteration: "Shri Guru Charan Saroj Raj, Nij Manu Mukuru Sudhari. Barnau Raghubar Bimal Jasu, Jo Dayaku Phal Chari.",
    meaning: "गुरुको चरण कमलको धूलोले आफ्नो मनरूपी दर्पण सफा गरेर, म रघुवरको निर्मल यश वर्णन गर्छु जो चारै फल (धर्म, अर्थ, काम, मोक्ष) दिने छ।",
    benefit: "शक्ति, साहस र भय नाशका लागि।",
    deity: "हनुमान",
  },
  {
    id: 6,
    name: "सरस्वती मन्त्र",
    sanskrit: "ॐ ऐं सरस्वत्यै नमः।",
    transliteration: "Om Aim Saraswatyai Namah.",
    meaning: "हे सरस्वती माता! म तपाईंलाई नमस्कार गर्छु। ज्ञान, विद्या र कलाको वरदान दिनुहोस्।",
    benefit: "विद्या, ज्ञान, कला र वाक्शक्तिका लागि।",
    deity: "सरस्वती",
  },
  {
    id: 7,
    name: "विष्णु मन्त्र",
    sanskrit: "ॐ नमो भगवते वासुदेवाय।",
    transliteration: "Om Namo Bhagavate Vasudevaya.",
    meaning: "हे वासुदेव भगवान! म तपाईंलाई नमस्कार गर्छु। संसारको पालनकर्ता, मलाई आफ्नो शरणमा लिनुहोस्।",
    benefit: "मोक्ष, शान्ति र जीवनको सुरक्षाका लागि।",
    deity: "विष्णु",
  },
  {
    id: 8,
    name: "शिव पञ्चाक्षर मन्त्र",
    sanskrit: "ॐ नमः शिवाय।",
    transliteration: "Om Namah Shivaya.",
    meaning: "हे शिव! म तपाईंलाई नमस्कार गर्छु। पञ्चतत्त्व (पृथ्वी, जल, अग्नि, वायु, आकाश) का स्वामी, मलाई आशीर्वाद दिनुहोस्।",
    benefit: "आत्मशुद्धि, मोक्ष र सर्वकल्याणका लागि।",
    deity: "शिव",
  },
];

const DEITY_COLORS = {
  "सूर्य": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "शिव": "bg-blue-50 text-blue-700 border-blue-200",
  "गणेश": "bg-orange-50 text-orange-700 border-orange-200",
  "लक्ष्मी": "bg-pink-50 text-pink-700 border-pink-200",
  "हनुमान": "bg-red-50 text-red-700 border-red-200",
  "सरस्वती": "bg-purple-50 text-purple-700 border-purple-200",
  "विष्णु": "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default function MantrasPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = MANTRAS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.deity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F0EDE5]">
      <Header />
      <div className="max-w-[900px] mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="text-[#D97706] text-sm font-semibold mb-6 flex items-center gap-1 hover:text-red-600 transition-colors">
          ← फिर्ता जानुहोस्
        </button>

        <div className="text-center mb-10" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🕉️</div>
          <h1 className="text-3xl font-extrabold text-[#1B1917]">मन्त्र तथा श्लोक</h1>
          <p className="text-[#78716C] mt-2">पवित्र मन्त्रहरू र तिनको अर्थ</p>
        </div>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="मन्त्र वा देवताको नाम खोज्नुहोस्..."
          className="w-full px-5 py-3 rounded-2xl border border-[#E7E5E4] bg-white text-[#1B1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#D97706] mb-8 shadow-sm"
          style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(mantra => (
            <div key={mantra.id} className="bg-white rounded-2xl border border-[#F5F5F4] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-base font-bold text-[#1B1917]" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>{mantra.name}</h2>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ml-2 ${DEITY_COLORS[mantra.deity] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                  {mantra.deity}
                </span>
              </div>

              <p className="text-[#D97706] font-semibold text-sm leading-relaxed mb-2" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
                {mantra.sanskrit}
              </p>
              <p className="text-xs text-[#A8A29E] italic mb-3">{mantra.transliteration}</p>

              <div className="border-t border-[#F5F5F4] pt-3">
                <p className="text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1">अर्थ</p>
                <p className="text-sm text-[#57534E] leading-relaxed" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>{mantra.meaning}</p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs">✨</span>
                <p className="text-xs text-[#D97706] font-semibold" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>{mantra.benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
