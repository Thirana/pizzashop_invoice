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

export default function ItemManagement() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Item>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

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
    <div className="max-w-3xl mx-auto p-4 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">Item Management</h1>
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition font-medium text-base"
          onClick={() => {
            setShowForm(true);
            setForm({});
            setEditId(null);
          }}
        >
          + Add Item
        </button>
        <div className="flex gap-2 items-center">
          <button
            className="px-4 py-1 border border-gray-300 rounded-full bg-white shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
            onClick={handlePrev}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="px-2 text-gray-700 font-medium">Page {page}</span>
          <button
            className="px-4 py-1 border border-gray-300 rounded-full bg-white shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
            onClick={handleNext}
            disabled={!hasMore}
          >
            Next
          </button>
        </div>
      </div>
      {error && <div className="text-red-600 mb-4 text-center bg-red-50 border border-red-200 rounded p-2">{error}</div>}
      {loading && <div className="text-gray-500 text-center mb-4">Loading...</div>}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm bg-white">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-700">Name</th>
              <th className="p-3 text-left font-semibold text-gray-700">Type</th>
              <th className="p-3 text-left font-semibold text-gray-700">Price</th>
              <th className="p-3 text-left font-semibold text-gray-700">Description</th>
              <th className="p-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-gray-900">{item.name}</td>
                <td className="p-3 capitalize text-gray-700">{item.type}</td>
                <td className="p-3 text-gray-700">{item.price.toFixed(2)}</td>
                <td className="p-3 text-gray-700">{item.description}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full font-medium border border-blue-100 transition"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-full font-medium border border-red-100 transition"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-400 bg-gray-50 rounded-b-lg">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Item Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-10">
          <form
            className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg w-full max-w-md relative animate-fadeIn"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-900">{editId ? "Edit Item" : "Add Item"}</h2>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 font-medium">Name</label>
              <input
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 font-medium">Type/Category</label>
              <input
                name="type"
                value={form.type || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 lowercase"
                placeholder="pizza, beverage, dessert, topping"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700 font-medium">Price</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 text-gray-700 font-medium">Description</label>
              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
              />
            </div>
            <div className="flex gap-3 mt-2 justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition font-medium"
                disabled={loading}
              >
                {editId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-full border border-gray-300 hover:bg-gray-200 transition font-medium"
                onClick={() => {
                  setShowForm(false);
                  setForm({});
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
