import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE } from "../../services/base";

const SUPPORT_LINKS = [
  { href: "#", label: "FAQs" },
  { href: "#", label: "Return Policy" },
  { href: "/orders", label: "Track Order" },
  { href: "/about", label: "Contact Us" },
];

const SOCIALS = [
  {
    href: "#",
    label: "Facebook",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>,
  },
  {
    href: "#",
    label: "Instagram",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
  {
    href: "#",
    label: "YouTube",
    icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>,
  },
];

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/categories/`)
      .then(r => r.json())
      .then(data => setCategories((Array.isArray(data) ? data : (data.results ?? [])).slice(0, 5)))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#0F1724] text-white py-14">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#C28142] rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
              <div>
                <div className="font-bold text-white" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>पूजा पसल</div>
                <div className="text-[10px] text-gray-400 -mt-0.5">Puja Pasal</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bringing sacred traditions to your doorstep with quality and devotion.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIALS.map(({ href, label, icon }) => (
                <a key={label} href={href} aria-label={label} className="text-gray-400 hover:text-[#C28142] transition-colors">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories — dynamic from API */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white">Categories</h3>
            <ul className="space-y-2">
              {categories.length > 0 ? categories.map(cat => (
                <li key={cat.id}>
                  <Link to="/categories" className="text-gray-400 hover:text-[#C28142] transition-colors text-sm flex items-center gap-1.5">
                    <span>{cat.icon}</span> {cat.name}
                  </Link>
                </li>
              )) : (
                <>
                  <li><Link to="/" className="text-gray-400 hover:text-[#C28142] transition-colors text-sm">Home</Link></li>
                  <li><Link to="/categories" className="text-gray-400 hover:text-[#C28142] transition-colors text-sm">Categories</Link></li>
                  <li><Link to="/scrap" className="text-gray-400 hover:text-[#C28142] transition-colors text-sm">Scrap Buyback</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-[#C28142] transition-colors text-sm">About Us</Link></li>
                  <li><Link to="/orders" className="text-gray-400 hover:text-[#C28142] transition-colors text-sm">Track Order</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className="text-gray-400 hover:text-[#C28142] transition-colors text-sm">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📧 info@pujapasal.com</p>
              <p>📞 +977-1-4567890</p>
              <p>📍 Kathmandu, Nepal</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Puja Pasal. All rights reserved.</p>
          <p>🙏 Made with devotion in Kathmandu, Nepal</p>
        </div>
      </div>
    </footer>
  );
}
