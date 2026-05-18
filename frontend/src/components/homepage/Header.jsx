import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { X, Menu, ShoppingCart } from "lucide-react";

function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="hover:opacity-80 transition-opacity">
        {user.profile_image_url
          ? <img src={user.profile_image_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          : <div className="w-8 h-8 bg-[#C28142] rounded-full flex items-center justify-center text-white text-sm font-semibold">{initials}</div>
        }
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#F5F5F4] z-20 py-1 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#F5F5F4]">
              <p className="font-semibold text-sm text-[#1E1C25]">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-[#78716C] truncate">{user.email}</p>
            </div>
            {[
              { label: 'Edit Profile', path: '/edit-profile' },
              { label: 'My Orders', path: '/orders' },
              { label: 'Write a Review', path: '/review' },
            ].map(({ label, path }) => (
              <button key={path} onClick={() => { setOpen(false); navigate(path); }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#57534E] hover:bg-[#F9F7F4] transition-colors">
                {label}
              </button>
            ))}
            <button onClick={() => { setOpen(false); logout(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-[#F5F5F4]">
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/scrap", label: "Scrap Buyback" },
  { to: "/about", label: "About Us" },
];

const DiyaIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
    <ellipse cx="16" cy="22" rx="10" ry="5" fill="#C28142" opacity="0.3"/>
    <path d="M8 20 Q10 14 16 12 Q22 14 24 20 Q20 24 16 24 Q12 24 8 20Z" fill="#C28142"/>
    <path d="M16 12 Q17 6 20 4 Q18 8 16 12Z" fill="#D97706"/>
    <ellipse cx="16" cy="12" rx="2" ry="3" fill="#FCD34D" opacity="0.9"/>
  </svg>
);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <>
      <header className={`sticky top-0 z-50 bg-[#F0EDE5] transition-shadow duration-200 ${isScrolled ? 'shadow-[0_6px_18px_rgba(30,28,37,0.08)]' : ''}`}>
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <DiyaIcon />
            <div className="leading-tight">
              <div className="text-[#1B1917] font-bold text-base" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>पूजा पसल</div>
              <div className="text-[#A8A29E] text-[10px] font-medium tracking-wide -mt-0.5">Puja Pasal</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} className={`text-sm font-medium transition-colors pb-0.5 ${active ? 'text-[#C28142] font-semibold border-b-2 border-[#C28142]' : 'text-[#1E1C25] hover:text-[#C28142]'}`}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-[#1E1C25] hover:text-[#C28142] transition-colors focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2 rounded-lg">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth — desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <>
                  <Link to="/login" className="px-4 py-1.5 text-sm font-semibold text-[#C28142] border border-[#C28142] rounded-full hover:bg-[#C28142] hover:text-white transition-all">Login</Link>
                  <Link to="/register" className="px-4 py-1.5 text-sm font-semibold text-white bg-[#C28142] rounded-full hover:bg-[#a06a30] transition-all">Sign Up</Link>
                </>
              )}
            </div>

            {/* Hamburger — mobile */}
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-[#1E1C25] hover:text-[#C28142] transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="w-72 bg-[#F0EDE5] h-full shadow-2xl flex flex-col animate-slideInRight">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E5E4]">
              <div className="flex items-center gap-2">
                <DiyaIcon />
                <span className="font-bold text-[#1B1917]" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>पूजा पसल</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-[#78716C] hover:text-[#1B1917]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col px-4 py-4 gap-1 flex-1">
              {NAV_LINKS.map(({ to, label }) => {
                const active = location.pathname === to;
                return (
                  <Link key={to} to={to} className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-[#C28142]/10 text-[#C28142] font-semibold' : 'text-[#1E1C25] hover:bg-white hover:text-[#C28142]'}`}>
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-4 py-5 border-t border-[#E7E5E4] flex flex-col gap-2">
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <>
                  <Link to="/login" className="w-full py-2.5 text-center text-sm font-semibold text-[#C28142] border border-[#C28142] rounded-full hover:bg-[#C28142] hover:text-white transition-all">Login</Link>
                  <Link to="/register" className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#C28142] rounded-full hover:bg-[#a06a30] transition-all">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
