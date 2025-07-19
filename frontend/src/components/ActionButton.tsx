import React from "react";

type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

const base =
  "rounded-full transition cursor-pointer disabled:opacity-50";

const ActionButton: React.FC<ActionButtonProps> = ({ children, className = "", ...props }) => (
  <button className={`${base} ${className}`} {...props}>
    {children}
  </button>
);

export default ActionButton; 