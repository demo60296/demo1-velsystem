import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  to,
  children,
  variant = "primary",
  size = "md",
  onClick,
}) => {
  const base =
    "inline-block rounded-full font-semibold transition shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-white text-blue-700 hover:bg-gray-100 focus:ring-blue-500 border border-blue-200",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const handleClick = () => {
    window.scrollTo(0, 0);
    onClick?.();
  };

  return (
    <Link
      to={to}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default Button;
