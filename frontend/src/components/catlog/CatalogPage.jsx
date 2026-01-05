import React, { useState, useEffect } from "react";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { Search, Filter } from "lucide-react";

export default function CatalogPage() {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [filteredBundles, setFilteredBundles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/bundles/')
      .then(res => res.json())
      .then(data => {
        setBundles(data);
        setFilteredBundles(data);
      })
      .catch(err => console.error('Error fetching bundles:', err));
  }, []);

  const calculateBundlePrice = (bundle) => {
    if (!bundle.items || bundle.items.length === 0) return 0;
    return bundle.items.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  useEffect(() => {
    let filtered = bundles.filter(bundle =>
      bundle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bundle.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "price-low") {
      filtered.sort((a, b) => calculateBundlePrice(a) - calculateBundlePrice(b));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => calculateBundlePrice(b) - calculateBundlePrice(a));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredBundles(filtered);
  }, [searchTerm, sortBy, bundles]);

  return (
    <div className="min-h-screen bg-[#F0EDE5]">
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1E1C25] mb-2">Ritual Bundle Sets</h1>
          <p className="text-[#6B6560]">Complete puja sets for every occasion</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B6560] w-5 h-5" />
            <input
              type="text"
              placeholder="Search bundles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#C0B8AF] focus:outline-none focus:ring-2 focus:ring-[#C28142]"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-[#6B6560] w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-lg border border-[#C0B8AF] focus:outline-none focus:ring-2 focus:ring-[#C28142]"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBundles.map((bundle) => (
            <div
              key={bundle.id}
              onClick={() => navigate(`/bundle/${bundle.id}`)}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative h-64 overflow-hidden">
                {bundle.images && bundle.images.length > 0 ? (
                  <img
                    src={`http://127.0.0.1:8000${bundle.images[0].image}`}
                    alt={bundle.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-6xl">🙏</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#1E1C25] mb-2">{bundle.name}</h3>
                <p className="text-sm text-[#6B6560] mb-4 line-clamp-2">{bundle.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-[#C28142]">
                    NPR {calculateBundlePrice(bundle).toFixed(2)}
                  </span>
                  <span className="text-sm text-[#6B6560]">
                    {bundle.items?.length || 0} items
                  </span>
                </div>

                <Button fullWidth>View Details</Button>
              </div>
            </div>
          ))}
        </div>

        {filteredBundles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#6B6560] text-lg">No bundles found</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
