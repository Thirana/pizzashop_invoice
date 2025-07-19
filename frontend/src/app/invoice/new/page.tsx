"use client";
import React, { useEffect, useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import Message from "@/components/Message";

// Item type from backend
export type Item = {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
};

// Invoice item for form state
interface InvoiceItem {
  itemId: number;
  quantity: number;
  price: number;
  name: string;
}

export default function InvoiceCreatePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [tax, setTax] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<any | null>(null);
  const [showPrint, setShowPrint] = useState(false);

  // Fetch items from backend
  useEffect(() => {
    fetch("http://localhost:8080/v1/items")
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setError("Failed to fetch items"));
  }, []);

  // Add a new item row
  const handleAddItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { itemId: 0, quantity: 1, price: 0, name: "" },
    ]);
  };

  // Remove an item row
  const handleRemoveItem = (idx: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));
  };

  // Handle item selection or quantity change
  const handleItemChange = (idx: number, field: "itemId" | "quantity", value: any) => {
    setInvoiceItems((prev) => {
      const updated = [...prev];
      if (field === "itemId") {
        const selected = items.find((it) => it.id === Number(value));
        if (selected) {
          updated[idx] = {
            ...updated[idx],
            itemId: selected.id,
            price: selected.price,
            name: selected.name,
          };
        }
      } else if (field === "quantity") {
        updated[idx] = { ...updated[idx], quantity: Number(value) };
      }
      return updated;
    });
  };

  // Calculate totals
  const subtotal = invoiceItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxAmount = subtotal * (tax / 100);
  const total = subtotal + taxAmount;

  // Handle form submit (to be implemented)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    setShowPrint(false);
    setCreatedInvoice(null);
    // Validate
    if (!customerName.trim()) {
      setError("Customer name is required");
      setLoading(false);
      return;
    }
    if (invoiceItems.length === 0) {
      setError("At least one item is required");
      setLoading(false);
      return;
    }
    if (invoiceItems.some((item) => !item.itemId || item.quantity < 1)) {
      setError("All items must be selected and have quantity >= 1");
      setLoading(false);
      return;
    }
    // Prepare payload
    const payload = {
      customer_name: customerName,
      tax,
      items: invoiceItems.map((item) => ({
        item_id: item.itemId,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    try {
      const res = await fetch("http://localhost:8080/v1/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create invoice");
      }
      const data = await res.json();
      setSuccess("Invoice created successfully!");
      setCreatedInvoice(data);
      setShowPrint(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">Create Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Customer Name</label>
          <input
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-base"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Items</label>
          <div className="space-y-4">
            {invoiceItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                  value={item.itemId}
                  onChange={(e) => handleItemChange(idx, "itemId", e.target.value)}
                  required
                >
                  <option value={0}>Select item</option>
                  {items.map((it) => (
                    <option key={it.id} value={it.id}>{it.name} ({it.type})</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className="w-20 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                  required
                />
                <span className="w-24 text-gray-700">{item.price ? `Rs. ${item.price.toFixed(2)}` : "-"}</span>
                <PrimaryButton type="button" className="bg-red-100 text-red-600 px-4 py-1.5 ml-2" onClick={() => handleRemoveItem(idx)}>
                  Remove
                </PrimaryButton>
              </div>
            ))}
            <PrimaryButton type="button" onClick={handleAddItem} className="mt-2">+ Add Item</PrimaryButton>
          </div>
        </div>
        <div className="flex gap-8 items-end">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Tax (%)</label>
            <input
              type="number"
              min={0}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
              required
            />
          </div>
          <div className="ml-auto text-right space-y-1">
            <div className="text-gray-700">Subtotal: <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span></div>
            <div className="text-gray-700">Tax: <span className="font-semibold">Rs. {taxAmount.toFixed(2)}</span></div>
            <div className="text-gray-900 text-lg font-bold">Total: Rs. {total.toFixed(2)}</div>
          </div>
        </div>
        <Message type="error" message={error} />
        <Message type="success" message={success} />
        <div className="flex justify-end">
          <PrimaryButton type="submit" className="px-10 py-3 text-lg" disabled={loading}>
            Finalize & Print
          </PrimaryButton>
        </div>
      </form>

      {/* Printable Invoice View */}
      {showPrint && createdInvoice && (
        <div className="mt-12 bg-white border border-gray-200 rounded-xl shadow-lg p-10 print:p-0 print:shadow-none print:border-0">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 print:hidden"
              onClick={() => window.print()}
            >
              Print
            </button>
          </div>
          <div className="mb-4 text-gray-700">
            <div><span className="font-medium">Customer:</span> {createdInvoice.customer_name}</div>
            <div><span className="font-medium">Date:</span> {createdInvoice.created_at ? new Date(createdInvoice.created_at).toLocaleString() : "-"}</div>
            <div><span className="font-medium">Invoice ID:</span> {createdInvoice.id}</div>
          </div>
          <table className="w-full mb-6 border-t border-b border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 text-left">Item</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Unit Price</th>
                <th className="py-2 px-4 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {createdInvoice.items.map((item: any, idx: number) => {
                const itemInfo = items.find((it) => it.id === item.item_id);
                return (
                  <tr key={idx}>
                    <td className="py-2 px-4">{itemInfo ? itemInfo.name : `Item #${item.item_id}`}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">Rs. {item.price.toFixed(2)}</td>
                    <td className="py-2 px-4">Rs. {(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex flex-col items-end gap-1 text-gray-800">
            <div>Subtotal: <span className="font-semibold">Rs. {createdInvoice.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0).toFixed(2)}</span></div>
            <div>Tax ({createdInvoice.tax}%): <span className="font-semibold">Rs. {((createdInvoice.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)) * (createdInvoice.tax / 100)).toFixed(2)}</span></div>
            <div className="text-lg font-bold">Total: Rs. {createdInvoice.total.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
} 