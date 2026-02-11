export const Card = ({ 
  children,
  className = '',
  padding = 'p-6',
  hover = false
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow ${hover ? 'hover:shadow-lg transition-shadow' : ''} ${padding} ${className}`}>
      {children}
    </div>
  );
};
