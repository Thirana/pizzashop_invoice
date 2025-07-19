import React from "react";

interface PrintButtonProps {
  onClick: () => void;
}

const PrintButton: React.FC<PrintButtonProps> = ({ onClick }) => (
  <button
    className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 print:hidden cursor-pointer transition duration-150"
    onClick={onClick}
  >
    Print
  </button>
);

export default PrintButton; 