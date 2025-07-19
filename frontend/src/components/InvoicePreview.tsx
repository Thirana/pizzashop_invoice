import React, { useRef } from "react";
import PrintButton from "./PrintButton";
import type { Item } from "./InvoiceForm";

interface InvoicePreviewProps {
  invoice: any;
  items: Item[];
  onPrint: (ref: React.RefObject<HTMLDivElement>) => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, items, onPrint }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={invoiceRef} className="mt-12 bg-white border border-gray-200 rounded-xl shadow-lg p-10 print:p-0 print:shadow-none print:border-0">
        <div className="invoice-title text-2xl font-bold text-green-700 mb-4 tracking-widest text-left">Invoice</div>
        <div className="info-row flex justify-between mb-8 text-gray-700">
          <div><span className="font-medium">Customer:</span> {invoice.customer_name}</div>
          <div><span className="font-medium">Date:</span> {invoice.created_at ? new Date(invoice.created_at).toLocaleString() : "-"}</div>
          <div><span className="font-medium">Invoice ID:</span> {invoice.id}</div>
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
            {invoice.items.map((item: any, idx: number) => {
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
        <div className="totals flex flex-col items-end gap-1 text-gray-800">
          <div>Subtotal: <span className="font-semibold">Rs. {invoice.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0).toFixed(2)}</span></div>
          <div>Tax ({invoice.tax}%): <span className="font-semibold">Rs. {((invoice.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)) * (invoice.tax / 100)).toFixed(2)}</span></div>
          <div className="total text-lg font-bold">Total: Rs. {invoice.total.toFixed(2)}</div>
        </div>
      </div>
      {/* Print Button below the invoice, only visible on screen */}
      <div className="flex justify-end mt-4">
        <PrintButton onClick={() => onPrint(invoiceRef)} />
      </div>
    </>
  );
};

export default InvoicePreview; 