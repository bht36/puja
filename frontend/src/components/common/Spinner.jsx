export const Spinner = ({ size = 'md', color = 'red' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const colors = {
    red: 'border-red-500',
    purple: 'border-purple-500',
    blue: 'border-blue-500',
    white: 'border-white'
  };

  return (
    <div className={`${sizes[size]} ${colors[color]} border-t-transparent rounded-full animate-spin`} />
  );
};
