export const Skeleton = ({ 
  variant = 'text',
  width = 'w-full',
  height,
  className = ''
}) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    circle: 'rounded-full',
    rect: 'rounded-xl'
  };

  const defaultHeight = {
    text: 'h-4',
    title: 'h-8',
    circle: 'h-12 w-12',
    rect: 'h-48'
  };

  return (
    <div className={`bg-gray-200 animate-pulse ${variants[variant]} ${height || defaultHeight[variant]} ${width} ${className}`} />
  );
};
