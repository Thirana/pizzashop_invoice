import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

const base =
  "px-7 py-2.5 rounded-full shadow transition cursor-pointer disabled:opacity-50";

const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => (
  <button className={`${base} ${className}`} {...props}>
    {children}
  </button>
);

export default Button; 