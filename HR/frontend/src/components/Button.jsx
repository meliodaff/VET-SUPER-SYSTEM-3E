const Button = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
