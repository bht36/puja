export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E1C25] to-[#3D2B1F]">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
          alt=""
          className="w-full h-full object-cover object-center opacity-60"
          onError={e => e.target.style.display = 'none'}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E1C25]/75 via-[#1E1C25]/60 to-[#C28142]/30" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C28142] shadow-lg mb-4">
            <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
              <ellipse cx="20" cy="28" rx="12" ry="5" fill="rgba(255,255,255,0.25)"/>
              <path d="M10 26 Q12 18 20 16 Q28 18 30 26 Q26 30 20 31 Q14 30 10 26Z" fill="rgba(255,255,255,0.9)"/>
              <path d="M20 16 Q21 10 20 6 Q22 9 23 13 Q22 15 20 16Z" fill="#FCD34D"/>
              <ellipse cx="20" cy="13" rx="2" ry="3" fill="#F59E0B" opacity="0.8"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>पूजा पसल</h1>
          <p className="text-sm text-white/70 mt-0.5 font-medium tracking-wide">Puja Pasal</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.30)] border border-white/40 border-t-4 border-t-[#C28142] px-8 py-8">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h2 className="text-xl font-bold text-[#1E1C25]">{title}</h2>}
              {subtitle && <p className="text-sm text-[#78716C] mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
          <div className="mt-6 pt-4 border-t border-[#F5F5F4] text-center">
            <a href="/" className="text-xs text-[#A8A29E] hover:text-[#C28142] transition-colors font-medium">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
