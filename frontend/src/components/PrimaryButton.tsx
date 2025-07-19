import React from "react";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

const base =
  "bg-green-600 text-white px-7 py-2.5 rounded-full shadow hover:bg-green-700 transition font-medium text-base cursor-pointer disabled:opacity-50";

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, className = "", ...props }) => (
  <button className={`${base} ${className}`} {...props}>
    {children}
  </button>
);

export default PrimaryButton; 