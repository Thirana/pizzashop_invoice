export function printInvoiceWithLayout(invoiceRef: React.RefObject<HTMLDivElement>, shopName: string = "PUZZLE PIZZA") {
  if (!invoiceRef.current) return;
  const printContents = invoiceRef.current.innerHTML;
  const printWindow = window.open('', '', 'height=800,width=800');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${shopName}</title>
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
              <div class="shop-header">${shopName}</div>
            </div>
            ${printContents}
            <div class="footer">Thank you for choosing ${shopName}!<br/>We hope to see you again soon.</div>
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
} 