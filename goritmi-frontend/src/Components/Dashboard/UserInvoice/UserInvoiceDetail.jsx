import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserInvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/user/invoices/${id}`
      );
      setInvoice(res.data.invoice);
    } catch (err) {
      setError("Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  if (loading) return <div className="p-6">Loading invoice...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!invoice) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Invoice {invoice.invoiceNo}
          </h1>
          <p className="text-gray-500">
            Issued on {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded text-sm font-medium
            ${
              invoice.status === "DUE"
                ? "bg-yellow-100 text-yellow-700"
                : invoice.status === "PAID"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {invoice.status}
        </span>
      </div>

      {/* Items */}
      <div className="bg-white shadow rounded mb-6">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Description</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Unit Price</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{item.description}</td>
                <td className="p-3 text-center">{item.qty}</td>
                <td className="p-3 text-center">PKR {item.unitPrice}</td>
                <td className="p-3 text-center">
                  PKR {item.qty * item.unitPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded shadow mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>PKR {invoice.subTotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>PKR {invoice.tax}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>PKR {invoice.discount}</span>
        </div>
        <div className="flex justify-between font-semibold mt-2">
          <span>Total</span>
          <span>PKR {invoice.totalAmount}</span>
        </div>
      </div>

      {/* Notes or Cancel Reason */}
      {(invoice.notes || invoice.cancelReason) && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="font-semibold mb-2">
            {invoice.cancelReason ? "Cancel Reason" : "Notes"}
          </h3>
          <p className="text-gray-700">
            {invoice.cancelReason ? invoice.cancelReason : invoice.notes}
          </p>
        </div>
      )}

      <button
        onClick={() => navigate("/dashboard/user/invoices")}
        className="text-blue-600 underline"
      >
        ← Back to invoices
      </button>
    </div>
  );
};

export default UserInvoiceDetail;
