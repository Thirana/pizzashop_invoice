"use client";
import React, { useEffect, useState } from "react";
// Import new components
import PrimaryButton from "@/components/PrimaryButton";
import ItemTable from "@/components/ItemTable";
import ItemForm from "@/components/ItemForm";
import Message from "@/components/Message";

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
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Item>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");

  // Fetch all items for filtering
  useEffect(() => {
    fetch("http://localhost:8080/v1/items")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch all items");
        return res.json();
      })
      .then((data) => {
        setAllItems(data);
      })
      .catch((e) => console.error("Failed to fetch all items:", e));
  }, []);

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

  // Get unique types from all items
  const getUniqueTypes = () => {
    const types = [...new Set(allItems.map(item => item.type))];
    return types.sort();
  };

  // Filter items based on selected type
  const filterItems = () => {
    if (selectedType === "all") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => item.type === selectedType);
      setFilteredItems(filtered);
    }
  };

  // Apply filter when items or selectedType changes
  useEffect(() => {
    filterItems();
  }, [items, selectedType]);

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
      // Refresh all items for filter options
      fetch("http://localhost:8080/v1/items")
        .then((res) => res.json())
        .then(setAllItems);
      // Refetch current page
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
      // Refresh both all items and current page items
      setAllItems((prev) => prev.filter((item) => item.id !== id));
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
        <div className="flex items-center gap-4">
          <PrimaryButton
            onClick={() => {
              setShowForm(true);
              setForm({});
              setEditId(null);
            }}
          >
            + Add Item
          </PrimaryButton>
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg">
            <label htmlFor="typeFilter" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filter by Type
            </label>
            <select
              id="typeFilter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-900 hover:border-gray-400 transition-colors duration-200 cursor-pointer"
            >
              <option value="all" className="font-medium">All Types</option>
              {getUniqueTypes().map((type) => (
                <option key={type} value={type} className="font-medium">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
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
        items={filteredItems}
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
