import React, { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import Message from "./Message";

export type Item = {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
};

interface InvoiceItem {
  itemId: number;
  quantity: number;
  price: number;
  name: string;
}

interface InvoiceFormProps {
  items: Item[];
  loading: boolean;
  error: string | null;
  onSubmit: (data: {
    customer_name: string;
    tax: number;
    items: { item_id: number; quantity: number; price: number }[];
  }) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ items, loading, error, onSubmit }) => {
  const [customerName, setCustomerName] = useState("");
  const [tax, setTax] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { itemId: 0, quantity: 1, price: 0, name: "" },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));
  };

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

  const subtotal = invoiceItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxAmount = subtotal * (tax / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!customerName.trim()) {
      setFormError("Customer name is required");
      return;
    }
    if (invoiceItems.length === 0) {
      setFormError("At least one item is required");
      return;
    }
    if (invoiceItems.some((item) => !item.itemId || item.quantity < 1)) {
      setFormError("All items must be selected and have quantity >= 1");
      return;
    }
    onSubmit({
      customer_name: customerName,
      tax,
      items: invoiceItems.map((item) => ({
        item_id: item.itemId,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  };

  return (
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
      <Message type="error" message={formError || error} />
      <div className="flex justify-end">
        <PrimaryButton type="submit" className="px-10 py-3 text-lg" disabled={loading}>
          Finalize & Print
        </PrimaryButton>
      </div>
    </form>
  );
};

export default InvoiceForm; 