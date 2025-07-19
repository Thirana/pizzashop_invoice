import Link from "next/link";
import React from "react";

const navLinks = [
  { href: "/", label: "Item Management" },
  { href: "/invoices/new", label: "Create Invoice" },
  { href: "/invoices", label: "Invoice Management" },
];

const NavigationBar: React.FC = () => (
  <nav className="w-full bg-white shadow-sm border-b border-gray-100 mb-8">
    <div className="max-w-5xl mx-auto px-8 flex items-center h-16 justify-between">
      {/* Logo/Shop Name */}
      <div className="flex items-center min-w-0">
        <Link href="/" prefetch={false}>
          <span className="text-2xl font-extrabold tracking-widest text-green-600 select-none cursor-pointer" style={{ letterSpacing: "0.12em" }}>
            PUZZLE PIZZA
          </span>
        </Link>
      </div>
      {/* Navigation Links */}
      <div className="flex gap-8 ml-auto">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-700 font-medium text-lg px-4 py-1 rounded-full hover:bg-green-50 hover:text-green-700 transition"
            prefetch={false}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  </nav>
);

export default NavigationBar; 