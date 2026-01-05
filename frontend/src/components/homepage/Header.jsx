import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserProfile } from "../auth";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-[#F0EDE5] transition-shadow duration-200 ${
      isScrolled ? 'shadow-[0_6px_18px_rgba(30,28,37,0.08)]' : ''
    }`}>
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#C28142] rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="text-[#1E1C25] font-semibold text-lg">Puja Pasal</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-[#1E1C25] hover:text-[#C28142] transition-colors">Home</Link>
          <Link to="/categories" className="text-[#1E1C25] hover:text-[#C28142] transition-colors">Categories</Link>
          <Link to="/scrap" className="text-[#1E1C25] hover:text-[#C28142] transition-colors">Scrap Buyback</Link>
          <Link to="/about" className="text-[#1E1C25] hover:text-[#C28142] transition-colors">About us</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="p-2 text-[#1E1C25] hover:text-[#C28142] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
            </svg>
          </Link>
          
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
