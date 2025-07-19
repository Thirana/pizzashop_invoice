"use client";
import React, { useEffect, useState } from "react";
import InvoiceForm, { Item } from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import Message from "@/components/Message";

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
    if (!invoiceRef.current) return;
    const printContents = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - PUZZELS</title>
            <style>
              body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; background: #f4f6fa; color: #222; margin: 0; padding: 0; }
              .print-invoice-container { max-width: 720px; margin: 40px auto; background: #fff; border-radius: 18px; box-shadow: 0 6px 32px 0 rgba(0,0,0,0.10); padding: 0 0 36px 0; }
              .header-bar { background: linear-gradient(90deg, #10b981 0%, #059669 100%); border-radius: 18px 18px 0 0; padding: 32px 0 24px 0; text-align: center; }
              .shop-header { color: #fff; font-size: 2.5rem; font-weight: 800; letter-spacing: 0.12em; margin-bottom: 0; }
              .invoice-title { color: #059669; font-size: 1.45rem; font-weight: 700; margin: 32px 0 18px 0; text-align: left; padding-left: 40px; }
              .info-row { display: flex; justify-content: space-between; padding: 0 40px 18px 40px; font-size: 1.08rem; color: #444; }
              .info-row div { margin-bottom: 0.2rem; }
              table { width: 90%; margin: 0 auto 1.5rem auto; border-collapse: collapse; border-radius: 8px; overflow: hidden; }
              th, td { border: 1px solid #e5e7eb; padding: 12px 14px; text-align: left; font-size: 1.05rem; }
              th { background: #f3f4f6; font-weight: 700; color: #059669; }
              tr:last-child td { border-bottom: 2px solid #059669; }
              .totals { width: 90%; margin: 0 auto; text-align: right; margin-top: 1.5rem; }
              .totals div { margin-bottom: 0.3rem; font-size: 1.08rem; }
              .totals .total { font-size: 1.25rem; font-weight: 700; color: #059669; }
              .footer { margin-top: 2.5rem; text-align: center; color: #888; font-size: 1.05rem; letter-spacing: 0.04em; }
              @media (max-width: 600px) {
                .print-invoice-container, .info-row, .invoice-title, .totals, table { padding-left: 10px !important; padding-right: 10px !important; width: 100% !important; }
              }
            </style>
          </head>
          <body>
            <div class="print-invoice-container">
              <div class="header-bar">
                <div class="shop-header">PUZZELS</div>
              </div>
              ${printContents}
              <div class="footer">Thank you for choosing PUZZELS!<br/>We hope to see you again soon.</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    }
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