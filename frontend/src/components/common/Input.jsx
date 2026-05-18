export const Input = ({
  label, type = 'text', name, value, onChange,
  placeholder, required = false, error, disabled = false, className = ''
}) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-semibold text-[#57534E] mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder} required={required} disabled={disabled}
      className={`w-full px-4 py-3 rounded-2xl border ${error ? 'border-red-400 bg-red-50' : 'border-[#E7E5E4] bg-white'} text-[#1B1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#D97706]/60 focus:ring-2 focus:ring-[#D97706]/20 disabled:bg-[#F5F5F4] disabled:cursor-not-allowed transition-all font-medium text-sm ${className}`}
    />
    {error && <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>}
  </div>
);
