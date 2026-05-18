export const Button = ({
  children, onClick, type = 'button', disabled = false,
  fullWidth = false, variant = 'primary', className = ''
}) => {
  const variants = {
    primary:   'bg-red-600 hover:bg-red-700 text-white shadow-[0_4px_12px_rgb(239,68,68,0.2)]',
    secondary: 'bg-[#C28142] hover:bg-[#a06a30] text-white shadow-[0_4px_12px_rgba(194,129,66,0.2)]',
    ghost:     'bg-transparent border border-[#E7E5E4] hover:border-[#D97706] hover:bg-orange-50 text-[#1B1917]',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`px-6 py-3 font-semibold rounded-2xl active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2 ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {children}
    </button>
  );
};
