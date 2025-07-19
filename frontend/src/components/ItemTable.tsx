import React from "react";
import ActionButton from "./ActionButton";

export type Item = {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
};

type ItemTableProps = {
  items: Item[];
  loading: boolean;
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
};

const ItemTable: React.FC<ItemTableProps> = ({ items, loading, onEdit, onDelete }) => (
  <div className="overflow-x-auto rounded-lg shadow">
    <table className="w-full text-base bg-white">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="p-4 text-left font-semibold text-gray-700">Name</th>
          <th className="p-4 text-left font-semibold text-gray-700">Type</th>
          <th className="p-4 text-left font-semibold text-gray-700">Price</th>
          <th className="p-4 text-left font-semibold text-gray-700">Description</th>
          <th className="p-4 text-center font-semibold text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b hover:bg-gray-50 transition">
            <td className="p-4 text-gray-900 whitespace-nowrap">{item.name}</td>
            <td className="p-4 capitalize text-gray-700 whitespace-nowrap">{item.type}</td>
            <td className="p-4 text-gray-700 whitespace-nowrap">{item.price.toFixed(2)}</td>
            <td className="p-4 text-gray-700">{item.description}</td>
            <td className="p-4 flex gap-2 justify-center">
              <ActionButton
                className="border border-green-700 text-green-700 bg-transparent px-4 py-1.5 rounded-full hover:bg-green-50 focus:ring-2 focus:ring-green-100 transition font-normal text-sm shadow-sm"
                onClick={() => onEdit(item)}
                type="button"
              >
                Edit
              </ActionButton>
              <ActionButton
                className="border border-red-600 text-red-600 bg-transparent px-4 py-1.5 rounded-full hover:bg-red-50 focus:ring-2 focus:ring-red-100 transition font-normal text-sm shadow-sm"
                onClick={() => onDelete(item.id)}
                type="button"
              >
                Delete
              </ActionButton>
            </td>
          </tr>
        ))}
        {items.length === 0 && !loading && (
          <tr>
            <td colSpan={5} className="text-center p-8 text-gray-400 bg-gray-50 rounded-b-lg text-lg">
              No items found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default ItemTable; 