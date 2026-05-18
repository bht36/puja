import { useState } from "react";

const blockNumbers = (e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); };
const blockLetters = (e) => { if (/[a-zA-Z]/.test(e.key)) e.preventDefault(); };

export function InputField({ label, error, className = '', lettersOnly, numbersOnly, ...props }) {
  const keyHandler = lettersOnly ? blockNumbers : numbersOnly ? blockLetters : undefined;
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#1E1C25] mb-1.5">{label}</label>
      )}
      <input
        {...props}
        onKeyDown={keyHandler}
        className={`w-full px-4 py-3 rounded-xl border ${
          error ? 'border-red-400 bg-red-50' : 'border-[#E7E5E4] bg-white'
        } text-[#1E1C25] placeholder-[#A8A29E] focus:outline-none focus:border-[#C28142] focus:ring-2 focus:ring-[#C28142]/20 transition-all text-sm ${className}`}
      />
      {error && <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

export function PasswordField({ label, error, className = '', ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#1E1C25] mb-1.5">{label}</label>
      )}
      <div className="relative">
        <input
          {...props}
          type={show ? 'text' : 'password'}
          className={`w-full px-4 py-3 pr-11 rounded-xl border ${
            error ? 'border-red-400 bg-red-50' : 'border-[#E7E5E4] bg-white'
          } text-[#1E1C25] placeholder-[#A8A29E] focus:outline-none focus:border-[#C28142] focus:ring-2 focus:ring-[#C28142]/20 transition-all text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden ${className}`}
        />
        <button
          type="button"
          onClick={() => setShow(p => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#C28142] transition-colors"
          tabIndex={-1}
        >
          {show ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

export function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      {checks.map(c => (
        <div key={c.label} className="flex items-center gap-2">
          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-bold ${c.ok ? 'bg-green-500 text-white' : 'bg-[#E7E5E4] text-[#A8A29E]'}`}>
            {c.ok ? '✓' : '·'}
          </span>
          <span className={`text-xs ${c.ok ? 'text-green-600' : 'text-[#A8A29E]'}`}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}
