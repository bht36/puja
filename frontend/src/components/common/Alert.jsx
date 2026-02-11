export const Alert = ({ 
  type = 'info',
  message,
  onClose,
  className = ''
}) => {
  const styles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${styles[type]} ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">{icons[type]}</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold hover:opacity-70 transition-opacity">
          ×
        </button>
      )}
    </div>
  );
};
