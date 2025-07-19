"use client";
import React, { useEffect, useState } from "react";

// Item type based on backend item.go and init.sql
export type Item = {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
};

const PAGE_SIZE = 10;

// Import new components
import PrimaryButton from "@/components/PrimaryButton";
import ItemTable from "@/components/ItemTable";
import ItemForm from "@/components/ItemForm";
import Message from "@/components/Message";

export default function ItemManagement() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Item>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch items with pagination
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/v1/items/paginated?page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch items");
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setHasMore(data.length === PAGE_SIZE);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "type" ? value.toLowerCase() : value }));
  };

  // Add or update item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const method = editId ? "PUT" : "POST";
    const url = editId ? `http://localhost:8080/v1/items/${editId}` : "http://localhost:8080/v1/items";
    // Ensure payload matches backend expectations
    const { name, type, price, description } = form;
    const payload = {
      name: name?.toString() ?? "",
      type: type?.toString() ?? "",
      price: typeof price === "string" ? parseFloat(price) : price,
      description: description?.toString() ?? "",
    };
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save item");
      setShowForm(false);
      setForm({});
      setEditId(null);
      setSuccess(editId ? "Item updated successfully!" : "Item added successfully!");
      // Refresh items
      setPage(1);
      // Optionally, refetch current page
      fetch(`http://localhost:8080/v1/items/paginated?page=${page}` )
        .then((res) => res.json())
        .then(setItems);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit item
  const handleEdit = (item: Item) => {
    setForm(item);
    setEditId(item.id);
    setShowForm(true);
  };

  // Delete item
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/v1/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination controls
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => hasMore && setPage((p) => p + 1);

  console.log(items)

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-900 tracking-tight">Item Management</h1>
      <div className="flex justify-between items-center mb-8">
        <PrimaryButton
          onClick={() => {
            setShowForm(true);
            setForm({});
            setEditId(null);
          }}
        >
          + Add Item
        </PrimaryButton>
        <div className="flex gap-2 items-center">
          <PrimaryButton
            onClick={handlePrev}
            disabled={page === 1}
            type="button"
          >
            Prev
          </PrimaryButton>
          <span className="px-2 text-gray-700 font-medium text-lg">Page {page}</span>
          <PrimaryButton
            onClick={handleNext}
            disabled={!hasMore}
            type="button"
          >
            Next
          </PrimaryButton>
        </div>
      </div>
      <Message type="error" message={error} />
      <Message type="success" message={success} />
      <ItemTable
        items={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {/* Add/Edit Item Form */}
      {showForm && (
        <ItemForm
          form={form}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setForm({});
            setEditId(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
}
