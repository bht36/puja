export const Skeleton = ({ variant = 'text', width = 'w-full', height, className = '' }) => {
  const base = {
    text:   'h-4 rounded-full',
    title:  'h-7 rounded-full',
    circle: 'rounded-full h-12 w-12',
    rect:   'rounded-[24px] h-48',
  };
  return (
    <div className={`animate-shimmer ${base[variant]} ${height || ''} ${width} ${className}`} />
  );
};
