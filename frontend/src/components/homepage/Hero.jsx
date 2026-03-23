import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!query.trim()) { setResults([]); setShow(false); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/search/?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setShow(true);
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShow(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (item) => {
    setQuery(""); setShow(false);
    navigate(item.type === 'bundle' ? `/bundle/${item.id}` : `/product/${item.id}`);
  };

  return (
    <section className="bg-[#F0EDE5] py-10 lg:py-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] bg-[#E3DCD2] rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/3"></div>

      <div className="max-w-[1200px] mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          <div className="lg:col-span-7 z-10" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-red-500"></div>
              <span className="text-red-600 text-sm md:text-base font-bold tracking-[0.1em] uppercase">
                उत्कृष्ट पूजा सामाग्री
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1B1917] mb-6 leading-[1.25] tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">परम्परालाई</span><br /> आधुनिक सेवासँग जोड्दै
            </h1>

            <p className="text-lg lg:text-xl text-[#57534E] mb-8 max-w-xl font-medium leading-relaxed border-l-4 border-orange-300 pl-6 lg:pl-8">
              प्रामाणिक हवन सामाग्री, पित्तलका दियो, र हस्तकलाका मूर्तिहरूको शुद्धता अनुभव गर्नुहोस्। तपाईंको पवित्र अनुष्ठानको लागि नैतिक रूपमा सङ्कलन गरिएको।
            </p>

            {/* Search Bar */}
            <div ref={ref} className="relative max-w-lg">
              <div className="flex items-center bg-white rounded-full p-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-transparent focus-within:border-red-200 transition-all group">
                <span className="pl-4 text-orange-400 group-focus-within:text-red-500 transition-colors">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => results.length && setShow(true)}
                  placeholder="हवन सामाग्री, रुद्राक्ष खोज्नुहोस्..."
                  className="w-full px-4 py-2.5 lg:py-3 bg-transparent text-[#1B1917] placeholder-[#A8A29E] focus:outline-none font-medium text-base lg:text-lg leading-tight"
                />
                {query && (
                  <button onClick={() => { setQuery(""); setResults([]); setShow(false); }} className="pr-2 text-[#A8A29E] hover:text-[#1B1917] text-lg">✕</button>
                )}
                <button className="hidden sm:block px-6 lg:px-8 py-2.5 lg:py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 active:scale-95 transition-all shadow-md hover:shadow-lg whitespace-nowrap text-base lg:text-lg">
                  खोज्नुहोस्
                </button>
              </div>

              {/* Autocomplete dropdown */}
              {show && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#F5F5F4] overflow-hidden z-50">
                  {results.map(item => (
                    <button key={`${item.type}-${item.id}`} onClick={() => handleSelect(item)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#FFF8F0] transition-colors text-left border-b border-[#F5F5F4] last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.type === 'bundle' ? '🎁' : '🪔'}</span>
                        <span className="text-[#1B1917] font-medium text-sm">{item.name}</span>
                      </div>
                      {item.price && <span className="text-[#D97706] font-bold text-sm shrink-0">NPR {item.price}</span>}
                    </button>
                  ))}
                </div>
              )}
              {show && query && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-[#F5F5F4] px-5 py-4 text-sm text-[#A8A29E] z-50">
                  No results found for "{query}"
                </div>
              )}
            </div>

            <button className="sm:hidden w-full mt-4 px-8 py-3.5 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 active:scale-95 transition-all shadow-md text-lg">
              खोज्नुहोस्
            </button>

            <div className="mt-10 lg:mt-12 pt-6 lg:pt-8 border-t border-[#D6D3D1] flex text-center sm:text-left justify-center sm:justify-start gap-6 sm:gap-12 lg:gap-16 text-[#57534E]">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-[#1B1917] mb-1">१०,०००+</p>
                <p className="text-xs lg:text-sm font-medium text-[#78716C]">आशिष् प्राप्त घरहरू</p>
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-[#1B1917] mb-1">१००%</p>
                <p className="text-xs lg:text-sm font-medium text-[#78716C]">शुद्ध सामाग्री</p>
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-[#1B1917] mb-1">२४ घण्टा</p>
                <p className="text-xs lg:text-sm font-medium text-[#78716C]">छिटो डेलिभरी</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-5 relative mt-10 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-red-100 rounded-t-[80px] rounded-b-[20px] lg:rounded-t-[100px] lg:rounded-b-[20px] transform rotate-3 scale-105 opacity-50"></div>
            <div className="relative h-[400px] lg:h-[500px] w-full rounded-t-[100px] rounded-b-[24px] overflow-hidden shadow-2xl border-8 border-[#F5F5F4] bg-[#F5F5F4]">
              <img
                src="https://unsplash.com/photos/lord-ganesha-figurine-ICt8jR9TAtQ?w=600&h=800&fit=crop&crop=center"
                alt="Beautiful Brass Diya"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[2s]"
              />
            </div>
            <div className="absolute -left-6 lg:-left-12 top-20 lg:top-3 w-28 h-28 bg-red-600 rounded-full flex items-center justify-center text-white text-base font-bold shadow-xl rotate-12 border-4 border-[#F0EDE5] z-20" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              <span className="text-center leading-tight tracking-wider">१००%<br />शुद्ध</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
