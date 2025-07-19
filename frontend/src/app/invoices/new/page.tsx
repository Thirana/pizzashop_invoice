"use client";
import React, { useEffect, useState } from "react";
import InvoiceForm, { Item } from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import Message from "@/components/Message";
import { printInvoiceWithLayout } from "@/utils/printInvoice";

export default function InvoiceCreatePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdInvoice, setCreatedInvoice] = useState<any | null>(null);
  const [showPrint, setShowPrint] = useState(false);

  // Fetch items from backend
  useEffect(() => {
    fetch("http://localhost:8080/v1/items")
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setError("Failed to fetch items"));
  }, []);

  // Handle form submit
  const handleFormSubmit = async (formData: any) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    setShowPrint(false);
    setCreatedInvoice(null);
    try {
      const res = await fetch("http://localhost:8080/v1/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create invoice");
      }
      const data = await res.json();
      setCreatedInvoice(data);
      setShowPrint(true);
      setSuccess("Invoice created successfully!");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Print handler
  const handlePrint = (invoiceRef: React.RefObject<HTMLDivElement>) => {
    printInvoiceWithLayout(invoiceRef, "PUZZELS");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">Create Invoice</h1>
      {!createdInvoice && (
        <InvoiceForm
          items={items}
          loading={loading}
          error={error}
          onSubmit={handleFormSubmit}
        />
      )}
      {createdInvoice && (
        <>
          <Message type="success" message={success} />
          <InvoicePreview
            invoice={createdInvoice}
            items={items}
            onPrint={handlePrint}
          />
          <div className="flex justify-end mt-6">
            <button
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-200 transition font-medium text-base cursor-pointer"
              onClick={() => {
                setCreatedInvoice(null);
                setSuccess(null);
                setShowPrint(false);
              }}
            >
              Create Another Invoice
            </button>
          </div>
        </>
      )}
    </div>
  );
} 