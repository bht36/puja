import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BASE } from "../../services/base";
const MEDIA = BASE.replace('/api', '');

export default function RitualCategories() {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    fetch(`${BASE}/bundles/`)
      .then((res) => res.json())
      .then((data) => setBundles(Array.isArray(data) ? data : (data.results ?? [])))
      .catch(() => {});
  }, []);

  const totalPages = Math.ceil(bundles.length / itemsPerPage);
  const currentBundles = bundles.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage,
  );

  const calculateBundlePrice = (bundle) => {
    if (!bundle.items?.length) return 0;
    return bundle.items.reduce(
      (total, item) => total + parseFloat(item.price),
      0,
    );
  };

  return (
    <section className="pt-10 pb-20 bg-[#FCFAF8] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1B1917] tracking-tight">
            विशेष{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">
              पूजा सेटहरू
            </span>
          </h2>
          <Link
            to="/categories"
            className="inline-block mt-2 text-sm font-semibold text-[#D97706] hover:text-red-600 transition-colors"
          >
            सबै हेर्नुहोस् →
          </Link>
        </div>

        {/* Mobile: 2-col grid */}
        <div className="grid grid-cols-2 gap-6 md:hidden">
          {bundles.slice(0, 4).map((bundle) => (
            <div
              key={bundle.id}
              onClick={() => navigate(`/bundle/${bundle.id}`)}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="relative w-32 h-32 rounded-full p-1.5 bg-gradient-to-tr from-orange-200 via-red-100 to-orange-50 shadow-md group-hover:shadow-[0_12px_30px_rgba(217,119,6,0.2)] transition-all duration-500 group-hover:-translate-y-2">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white">
                  {bundle.images?.length > 0 ? (
                    <img
                      src={`${MEDIA}${bundle.images[0].image}`}
                      alt={bundle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center text-4xl">
                      🕉️
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border border-red-50 whitespace-nowrap z-10">
                  <span className="text-xs font-extrabold text-[#D97706]">
                    NPR {calculateBundlePrice(bundle).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <h3
                className="mt-6 text-sm font-bold text-[#1B1917] text-center line-clamp-2"
                style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}
              >
                {bundle.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Desktop: carousel */}
        <div className="hidden md:block relative">
          <div className="flex justify-center gap-8 lg:gap-16 pb-8 overflow-hidden">
            {currentBundles.map((bundle) => (
              <div
                key={bundle.id}
                onClick={() => navigate(`/bundle/${bundle.id}`)}
                className="group flex flex-col items-center cursor-pointer w-[180px] lg:w-[220px]"
              >
                <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-full p-2 bg-gradient-to-tr from-orange-200 via-red-100 to-orange-50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_40px_rgba(217,119,6,0.2)] transition-all duration-500 group-hover:-translate-y-3">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white">
                    {bundle.images?.length > 0 ? (
                      <img
                        src={`${MEDIA}${bundle.images[0].image}`}
                        alt={bundle.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center text-5xl">
                        🕉️
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-full px-3 py-1 text-xs whitespace-nowrap z-10 border border-red-50">
                    <span className="font-extrabold text-[#D97706]">
                      NPR {calculateBundlePrice(bundle).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <h3
                    className="text-base font-bold text-[#1B1917] group-hover:text-red-600 transition-colors line-clamp-2"
                    style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}
                  >
                    {bundle.name}
                  </h3>
                  <div className="mt-2 w-8 h-[2px] bg-red-200 mx-auto group-hover:bg-red-500 group-hover:w-12 transition-all duration-500 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom nav */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() =>
                  setCurrentIndex((p) => (p - 1 + totalPages) % totalPages)
                }
                className="p-2.5 rounded-full bg-white shadow-md hover:shadow-lg hover:text-red-500 text-[#A8A29E] transition-all border border-[#F5F5F4]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              {/* Progress bar indicator */}
              <div className="w-32 h-1.5 bg-[#E7E5E4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / totalPages) * 100}%`,
                  }}
                />
              </div>
              <button
                onClick={() => setCurrentIndex((p) => (p + 1) % totalPages)}
                className="p-2.5 rounded-full bg-white shadow-md hover:shadow-lg hover:text-red-500 text-[#A8A29E] transition-all border border-[#F5F5F4]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
