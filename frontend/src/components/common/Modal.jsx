export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className={`bg-white rounded-[32px] shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-fadeIn`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#F5F5F4]">
          <h2 className="text-xl font-bold text-[#1B1917]">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-[#A8A29E] hover:text-[#1B1917] hover:bg-[#F5F5F4] transition-all text-xl">×</button>
        </div>
        <div className="px-8 py-6">{children}</div>
      </div>
    </div>
  );
};
