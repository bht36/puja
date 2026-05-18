import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";

const ICON8 = "https://img.icons8.com/fluency/96";

const VALUES = [
  { icon: `${ICON8}/candle.png`, title: "Authenticity", sub: "Every item is sourced directly from trusted artisans and verified for purity." },
  { icon: `${ICON8}/sparkling.png`, title: "Purity", sub: "We ensure all materials meet the highest standards of ritual cleanliness." },
  { icon: `${ICON8}/praying-hands.png`, title: "Devotion", sub: "We serve with the same reverence you bring to your sacred practices." },
];

const TEAM = [
  { initials: "RK", name: "Rajesh Kumar", role: "Founder & CEO" },
  { initials: "SP", name: "Sunita Poudel", role: "Head of Sourcing" },
  { initials: "AM", name: "Anil Maharjan", role: "Customer Experience" },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0EDE5]">
      <Header />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1E1C25] to-[#3D2B1F] py-24 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1604928141064-207ce3fa1b8a?w=1200&fit=crop"
          alt="Puja setting"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          onError={e => e.target.style.display = 'none'}
        />
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-red-400" />
            <span className="text-red-400 text-xs font-bold tracking-[0.15em] uppercase">हाम्रो बारेमा</span>
            <div className="h-[1px] w-8 bg-red-400" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-400">Puja Pasal</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto font-medium">
            Bringing sacred traditions to your doorstep since 2020.
          </p>
        </div>
      </section>

      <main className="max-w-[1200px] mx-auto px-4 py-16 space-y-20 animate-fadeIn">

        {/* Our Story */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-red-400" />
              <span className="text-red-600 text-xs font-bold tracking-[0.15em] uppercase">Our Story</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#1B1917] mb-5 tracking-tight" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              हाम्रो <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">यात्रा</span>
            </h2>
            <p className="text-[#57534E] leading-relaxed font-medium mb-4">
              Puja Pasal was founded with a simple belief: that every household deserves access to authentic, pure puja materials without compromise. We started in Kathmandu's Asan market, working directly with generational artisans who craft brass diyas, copper kalash, and ritual items with the same devotion their ancestors did.
            </p>
            <p className="text-[#57534E] leading-relaxed font-medium">
              Today we serve thousands of families across Nepal, delivering complete puja sets, individual items, and our unique scrap buyback service — ensuring sacred metals are recycled with the respect they deserve.
            </p>
          </div>
          <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4] flex items-center justify-center h-64">
            <div className="text-center">
              <img src={`${ICON8}/om.png`} alt="Om" className="w-16 h-16 mx-auto mb-3" />
              <p className="text-[#A8A29E] text-sm font-medium">Serving with devotion since 2020</p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-[1px] w-8 bg-red-400" />
              <span className="text-red-600 text-xs font-bold tracking-[0.15em] uppercase">Our Values</span>
              <div className="h-[1px] w-8 bg-red-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#1B1917] tracking-tight" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              हाम्रा <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">मूल्यहरू</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ icon, title, sub }) => (
              <div key={title} className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4] text-center hover:shadow-[0_20px_40px_rgba(217,119,6,0.08)] hover:-translate-y-1 transition-all duration-300">
                <img src={icon} alt={title} className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1B1917] mb-2">{title}</h3>
                <p className="text-sm text-[#78716C] leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-[1px] w-8 bg-red-400" />
              <span className="text-red-600 text-xs font-bold tracking-[0.15em] uppercase">Our Team</span>
              <div className="h-[1px] w-8 bg-red-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#1B1917] tracking-tight" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              हाम्रो <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">टोली</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map(({ initials, name, role }) => (
              <div key={name} className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4] text-center">
                <div className="w-16 h-16 rounded-full bg-[#C28142] text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">{initials}</div>
                <h3 className="font-bold text-[#1B1917] mb-1">{name}</h3>
                <p className="text-sm text-[#78716C]">{role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-[32px] p-10 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4]">
          <h2 className="text-2xl font-extrabold text-[#1B1917] mb-3" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            Ready to begin your sacred journey?
          </h2>
          <p className="text-[#78716C] mb-6 font-medium">Explore our complete collection of authentic puja items.</p>
          <button onClick={() => navigate('/categories')}
            className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all shadow-[0_8px_20px_rgb(239,68,68,0.2)]">
            Shop Now →
          </button>
        </section>

      </main>
      <Footer />
    </div>
  );
}
