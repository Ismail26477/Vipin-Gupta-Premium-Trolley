import { Order } from "@/contexts/AuthContext";
import { Download } from "lucide-react";
import { toast } from "sonner";

function generateInvoiceHTML(order: Order): string {
  const itemsRows = order.items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;">${item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:right;">₹${item.price.toLocaleString()}</td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head><title>Invoice ${order.id}</title></head>
    <body style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:40px 20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;">
        <div>
          <h1 style="margin:0;font-size:28px;color:#5C3A1E;">Global Imports</h1>
          <p style="margin:4px 0 0;color:#666;font-size:12px;">Your Trusted Electronics Store</p>
        </div>
        <div style="text-align:right;">
          <h2 style="margin:0;font-size:20px;color:#333;">INVOICE</h2>
          <p style="margin:4px 0 0;color:#666;font-size:12px;">${order.id}</p>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;margin-bottom:24px;padding:16px;background:#f8f9fa;border-radius:8px;">
        <div>
          <p style="margin:0;font-size:11px;color:#666;text-transform:uppercase;">Order Date</p>
          <p style="margin:4px 0 0;font-size:14px;font-weight:bold;">${order.date}</p>
        </div>
        <div>
          <p style="margin:0;font-size:11px;color:#666;text-transform:uppercase;">Status</p>
          <p style="margin:4px 0 0;font-size:14px;font-weight:bold;">${order.status}</p>
        </div>
        <div style="text-align:right;">
          <p style="margin:0;font-size:11px;color:#666;text-transform:uppercase;">Ship To</p>
          <p style="margin:4px 0 0;font-size:12px;max-width:200px;">${order.address}</p>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#5C3A1E;color:white;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;">Item</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>

      <div style="text-align:right;margin-bottom:30px;">
        <p style="font-size:13px;color:#666;margin:4px 0;">Subtotal: ₹${order.total.toLocaleString()}</p>
        <p style="font-size:13px;color:#16a34a;margin:4px 0;">Shipping: Free</p>
        <hr style="border:none;border-top:2px solid #5C3A1E;margin:8px 0;width:200px;margin-left:auto;" />
        <p style="font-size:18px;font-weight:bold;margin:4px 0;">Total: ₹${order.total.toLocaleString()}</p>
      </div>

      <div style="text-align:center;padding-top:20px;border-top:1px solid #eee;">
        <p style="color:#666;font-size:11px;">Thank you for shopping with Global Imports!</p>
        <p style="color:#999;font-size:10px;">support@globalimports.com | www.globalimports.com</p>
      </div>
    </body>
    </html>
  `;
}

export default function InvoiceDownloadButton({ order }: { order: Order }) {
  const handleDownload = () => {
    const html = generateInvoiceHTML(order);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
      toast.success("Invoice opened for printing/download");
    } else {
      toast.error("Please allow popups to download invoice");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
    >
      <Download className="w-3.5 h-3.5" /> Invoice
    </button>
  );
}
