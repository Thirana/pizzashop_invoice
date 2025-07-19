"use client";
import React, { useEffect, useState } from "react";
import ActionButton from "@/components/ActionButton";
import InvoicePreview from "@/components/InvoicePreview";
import Message from "@/components/Message";
import PrimaryButton from "@/components/PrimaryButton";
import { printInvoiceWithLayout } from "@/utils/printInvoice";

// Minimal Item type for InvoicePreview
export type Item = {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
};

// Invoice type based on backend
interface InvoiceItem {
  item_id: number;
  quantity: number;
  price: number;
}

interface Invoice {
  id: number;
  customer_name: string;
  items: InvoiceItem[];
  tax: number;
  total: number;
  created_at: string;
}

const PAGE_SIZE = 5;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [viewedInvoice, setViewedInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<Item[]>([]); // For InvoicePreview

  // Fetch paginated invoices
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/v1/invoices?page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch invoices");
        return res.json();
      })
      .then((data) => {
        setInvoices(Array.isArray(data) ? data : []);
        setHasMore(Array.isArray(data) && data.length === PAGE_SIZE);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  // Fetch all items for InvoicePreview (to show item names)
  useEffect(() => {
    fetch("http://localhost:8080/v1/items")
      .then((res) => res.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  // Fetch full invoice details by ID (for view button)
  const handleView = (id: number) => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/v1/invoices/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch invoice details");
        return res.json();
      })
      .then(setViewedInvoice)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  // Pagination controls
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => hasMore && setPage((p) => p + 1);

  // Print handler for InvoicePreview (match create invoice page layout)
  const handlePrint = (ref: React.RefObject<HTMLDivElement>) => {
    printInvoiceWithLayout(ref, "PUZZLE PIZZA");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-900 tracking-tight">Invoice Management</h1>
      <div className="flex justify-end mb-6">
        <div className="flex gap-2 items-center">
          <PrimaryButton onClick={handlePrev} disabled={page === 1} type="button">Prev</PrimaryButton>
          <span className="px-2 text-gray-700 font-medium text-lg">Page {page}</span>
          <PrimaryButton onClick={handleNext} disabled={!hasMore} type="button">Next</PrimaryButton>
        </div>
      </div>
      <Message type="error" message={error} />
      <div className="overflow-x-auto rounded-lg shadow mb-8">
        <table className="w-full text-base bg-white">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">Invoice ID</th>
              <th className="p-4 text-left font-semibold text-gray-700">Customer</th>
              <th className="p-4 text-left font-semibold text-gray-700">Date</th>
              <th className="p-4 text-left font-semibold text-gray-700">Total</th>
              <th className="p-4 text-center font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 text-gray-900 whitespace-nowrap">{inv.id}</td>
                <td className="p-4 text-gray-700 whitespace-nowrap">{inv.customer_name}</td>
                <td className="p-4 text-gray-700 whitespace-nowrap">{new Date(inv.created_at).toLocaleString()}</td>
                <td className="p-4 text-gray-700 whitespace-nowrap">Rs. {inv.total.toFixed(2)}</td>
                <td className="p-4 flex gap-2 justify-center">
                  <ActionButton
                    className="border border-green-700 text-green-700 bg-transparent px-4 py-1.5 rounded-full hover:bg-green-50 focus:ring-2 focus:ring-green-100 transition font-normal text-sm shadow-sm"
                    onClick={() => handleView(inv.id)}
                    type="button"
                  >
                    View
                  </ActionButton>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-400 bg-gray-50 rounded-b-lg text-lg">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Invoice details view */}
      {viewedInvoice && (
        <div className="mb-10">
          <div className="flex justify-end mb-2">
            <PrimaryButton onClick={() => setViewedInvoice(null)} type="button" className="bg-red-100 text-red-600 px-4 py-1.5">Close</PrimaryButton>
          </div>
          <InvoicePreview invoice={viewedInvoice} items={items} onPrint={handlePrint} />
        </div>
      )}
    </div>
  );
} 