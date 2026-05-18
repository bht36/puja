import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { Search, ChevronDown } from "lucide-react";
import { BASE } from "../../services/base";
const MEDIA = BASE.replace('/api', '');

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

const API_BASE = "https://the-value-crew.github.io/nepali-calendar-api/data";

// Get current BS month/year (approx: AD year + 56, month offset ~9)
function getCurrentBS() {
  const now = new Date();
  const adMonth = now.getMonth() + 1; // 1-12
  const adYear = now.getFullYear();
  // Rough BS year: AD year + 56 (accurate enough for month display)
  const bsYear = adYear + 56;
  // BS month roughly: AD month + 9 (wraps around 12)
  const bsMonth = ((adMonth + 8) % 12) + 1;
  return { bsYear, bsMonth };
}

function MuhuratSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { bsYear, bsMonth } = getCurrentBS();
    const months = [
      { month: bsMonth, year: bsYear },
      { month: bsMonth === 12 ? 1 : bsMonth + 1, year: bsMonth === 12 ? bsYear + 1 : bsYear },
    ];
    Promise.all(
      months.map(({ month, year }) =>
        fetch(`${API_BASE}/${year}/${month}.json`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(results => {
      setData(results.map((d, i) => d ? {
        label: d.metadata?.np ?? "",
        marriage: d.marriage?.[0] ?? null,
        bratabandha: d.bratabandha?.[0] ?? null,
      } : null));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="h-14 rounded-2xl bg-white/60 animate-pulse mb-8" />;

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      {[0, 1].map(i => {
        const d = data[i];
        const hasMuhurat = d?.marriage || d?.bratabandha;
        return (
          <div key={i} className="flex-1 bg-white border border-[#F5F5F4] rounded-2xl px-5 py-3.5 flex flex-wrap items-center gap-x-5 gap-y-1 shadow-sm">
            <span className="text-xs font-extrabold text-[#D97706] shrink-0" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
              {i === 0 ? "यस महिना" : "अर्को महिना"}{d?.label ? ` · ${d.label}` : ""}
            </span>
            {!hasMuhurat ? (
              <span className="text-xs text-[#A8A29E]" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>मुहूर्त छैन</span>
            ) : (
              <>
                {d.marriage && <span className="text-xs text-[#57534E]" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>💍 <b>विवाह:</b> {d.marriage}</span>}
                {d.bratabandha && <span className="text-xs text-[#57534E]" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>🪡 <b>ब्रतबन्ध:</b> {d.bratabandha}</span>}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CatalogPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bundles, setBundles] = useState([]);
  const [filteredBundles, setFilteredBundles] = useState([]);
  const [searchTerm, setSearchTerm] = useState(new URLSearchParams(location.search).get('search') || "");
  const [sortBy, setSortBy] = useState("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/bundles/`)
      .then(res => res.json())
      .then(data => { const list = Array.isArray(data) ? data : (data.results ?? []); setBundles(list); setFilteredBundles(list); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const calcPrice = (bundle) => bundle.items?.reduce((t, i) => t + parseFloat(i.price), 0) ?? 0;

  useEffect(() => {
    let filtered = bundles.filter(b =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortBy === "price-low") filtered.sort((a, b) => calcPrice(a) - calcPrice(b));
    else if (sortBy === "price-high") filtered.sort((a, b) => calcPrice(b) - calcPrice(a));
    else if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredBundles(filtered);
  }, [searchTerm, sortBy, bundles]);

  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy);

  return (
    <div className="min-h-screen bg-[#F0EDE5]">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 py-10 animate-fadeIn">

        <div className="mb-8" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-10 bg-red-400" />
            <span className="text-red-600 text-xs font-bold tracking-[0.15em] uppercase">पूजा संग्रह</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1B1917] mb-2 tracking-tight">
            पवित्र <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">पूजा सेटहरू</span>
          </h1>
          <p className="text-[#78716C] font-medium mb-6">Complete ritual sets for every sacred occasion</p>
          <MuhuratSection />
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E] w-5 h-5" />
            <input
              type="text" placeholder="Search sacred bundles..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#E7E5E4] focus:outline-none focus:border-[#D97706]/60 focus:shadow-[0_0_0_3px_rgba(217,119,6,0.08)] text-[#1B1917] placeholder-[#A8A29E] transition-all font-medium shadow-sm"
            />
          </div>
          {/* Custom sort dropdown */}
          <div className="relative">
            <button onClick={() => setSortOpen(p => !p)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-[#E7E5E4] text-[#1B1917] font-medium shadow-sm hover:border-[#D97706]/60 transition-all min-w-[180px] justify-between">
              <span className="text-sm">{currentSort?.label}</span>
              <ChevronDown className={`w-4 h-4 text-[#A8A29E] transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-lg border border-[#F5F5F4] overflow-hidden z-20 min-w-[180px]">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${sortBy === opt.value ? 'bg-orange-50 text-[#D97706] font-semibold' : 'text-[#57534E] hover:bg-[#F9F7F4]'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[24px] overflow-hidden border border-[#F5F5F4]">
                <div className="h-60 animate-shimmer" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 rounded-full animate-shimmer" />
                  <div className="h-4 w-full rounded-full animate-shimmer" />
                  <div className="h-4 w-2/3 rounded-full animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBundles.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 mx-auto mb-4 text-[#E7E5E4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
              <path strokeLinecap="round" strokeWidth="1.5" d="M8 12h8M12 8v8"/>
            </svg>
            <p className="text-[#78716C] text-lg font-medium">No sacred bundles found</p>
            <p className="text-[#A8A29E] text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredBundles.map(bundle => (
              <div key={bundle.id} onClick={() => navigate(`/bundle/${bundle.id}`)}
                className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_20px_40px_rgba(217,119,6,0.12)] hover:-translate-y-2 transition-all duration-500 cursor-pointer group border border-[#F5F5F4] flex flex-col">
                <div className="relative h-60 overflow-hidden bg-[#FDFBF7]">
                  {bundle.images?.length > 0
                    ? <img src={`${MEDIA}${bundle.images[0].image}`} alt={bundle.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    : <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                        <img src="https://img.icons8.com/fluency/96/praying-hands.png" alt="Bundle" className="w-16 h-16" />
                      </div>
                  }
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-[#F5F5F4]">
                    <span className="text-xs font-bold text-[#78716C]">{bundle.items?.length || 0} items</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#1B1917] mb-2 group-hover:text-red-600 transition-colors line-clamp-2" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                    {bundle.name}
                  </h3>
                  <p className="text-sm text-[#78716C] mb-5 line-clamp-2 leading-relaxed font-medium flex-1">{bundle.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-[#D97706]">NPR</span>
                      <span className="text-2xl font-extrabold text-[#D97706] tracking-tight">{calcPrice(bundle).toLocaleString('en-IN')}</span>
                    </div>
                    <button className="px-5 py-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-2xl font-bold text-sm transition-all border border-red-100 hover:border-red-600">
                      View Set →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
