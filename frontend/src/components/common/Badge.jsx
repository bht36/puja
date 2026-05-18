const VARIANTS = {
  default:   'bg-[#F5F5F4] text-[#78716C]',
  primary:   'bg-red-100 text-red-800',
  secondary: 'bg-orange-100 text-[#D97706]',
  success:   'bg-green-100 text-green-800',
  warning:   'bg-yellow-100 text-yellow-800',
  danger:    'bg-red-100 text-red-800',
  info:      'bg-blue-100 text-blue-800',
  // order status aliases
  pending:    'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
};

const SIZES = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm', lg: 'px-4 py-1.5 text-base' };

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => (
  <span className={`inline-block rounded-full font-semibold ${VARIANTS[variant] ?? VARIANTS.default} ${SIZES[size]} ${className}`}>
    {children}
  </span>
);
