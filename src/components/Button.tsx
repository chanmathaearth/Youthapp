import React from "react";


interface ButtonProps {
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r from-blue-500 to-sky-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
