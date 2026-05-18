import { useRef } from "react";

export default function OTPInput({ value, onChange, length = 6 }) {
  const refs = useRef([]);

  const handleChange = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const arr = [...value];
    arr[i] = v.slice(-1);
    onChange(arr);
    if (v && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const arr = Array(length).fill('');
    pasted.split('').forEach((c, i) => { arr[i] = c; });
    onChange(arr);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-center gap-2.5">
      {Array(length).fill(0).map((_, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`w-11 h-12 text-center text-lg font-bold rounded-xl border-2 transition-all focus:outline-none
            ${value[i]
              ? 'border-[#C28142] bg-[#C28142]/5 text-[#1E1C25]'
              : 'border-[#E7E5E4] bg-white text-[#1E1C25]'}
            focus:border-[#C28142] focus:ring-2 focus:ring-[#C28142]/20`}
        />
      ))}
    </div>
  );
}
