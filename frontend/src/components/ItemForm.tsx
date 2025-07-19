import React, { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import type { Item } from "./ItemTable";

type ItemFormProps = {
  form: Partial<Item>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
};

const ItemForm: React.FC<ItemFormProps> = ({ form, onSubmit, onCancel, loading }) => {
  const [localForm, setLocalForm] = useState(form);

  React.useEffect(() => {
    setLocalForm(form);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalForm((f) => ({ ...f, [name]: name === "type" ? value.toLowerCase() : value }));
  };

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-10">
      <form
        className="bg-white border border-gray-200 rounded-xl p-10 shadow-lg w-full max-w-lg relative animate-fadeIn"
        onSubmit={(e) => {
          // Copy localForm values to parent form before submit
          Object.assign(form, localForm);
          onSubmit(e);
        }}
      >
        <h2 className="text-2xl font-semibold mb-8 text-gray-900">{form.id ? "Edit Item" : "Add Item"}</h2>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">Name</label>
          <input
            name="name"
            value={localForm.name || ""}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-base"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">Type/Category</label>
          <input
            name="type"
            value={localForm.type || ""}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 lowercase text-base"
            placeholder="pizza, beverage, dessert, topping"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">Price</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={localForm.price || ""}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-base"
          />
        </div>
        <div className="mb-8">
          <label className="block mb-2 text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            value={localForm.description || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50 text-base"
          />
        </div>
        <div className="flex gap-4 mt-2 justify-end">
          <PrimaryButton
            type="submit"
            className="bg-green-600 text-white px-7 py-2.5 rounded-full shadow hover:bg-green-700 transition font-medium text-base cursor-pointer"
            disabled={loading}
          >
            {form.id ? "Update" : "Add"}
          </PrimaryButton>
          <PrimaryButton
            type="button"
            className="bg-gray-100 text-gray-700 px-7 py-2.5 rounded-full border border-gray-300 hover:bg-gray-200 transition font-medium text-base cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default ItemForm; 