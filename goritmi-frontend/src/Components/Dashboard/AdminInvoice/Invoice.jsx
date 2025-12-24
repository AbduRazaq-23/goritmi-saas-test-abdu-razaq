import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/admin/invoice/${id}`
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

  const updateStatus = async (status) => {
    const confirmed = window.confirm(
      `Are you sure you want to mark invoice as ${status}?`
    );

    if (!confirmed) return;

    try {
      setUpdating(true);
      await axios.patch(
        `http://localhost:5000/api/admin/invoices/${id}/status`,
        { status }
      );
      await fetchInvoice();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Loading invoice...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!invoice) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Invoice {invoice?.invoiceNumber}
          </h1>
          <p className="text-gray-500">{invoice?.userId}</p>
          <p className="text-red-400">{invoice?.cancelReason}</p>
        </div>

        {updating && <span className="text-sm text-gray-600">Updating...</span>}

        {/* Actions */}
        {invoice?.status === "DUE" ? (
          <div className="flex items-center gap-4">
            <span className="font-medium">Status:</span>

            <select
              value={invoice?.status || ""}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updating}
              className={`px-4 py-2 rounded font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                invoice?.status === "DUE" &&
                "bg-orange-100 text-orange-800 border-orange-300"
              }`}
            >
              <option value="DUE">DUE</option>
              <option value="PAID">PAID</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        ) : (
          <span
            className={`px-3 py-1 rounded text-sm font-medium
            ${
              invoice.status === "PAID"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {invoice?.status}
          </span>
        )}
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
            {invoice?.items.map((item, idx) => (
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

      <button
        onClick={() => navigate("/dashboard/admin/invoices")}
        className="mt-6 text-blue-600 underline"
      >
        ← Back to list
      </button>
    </div>
  );
};

export default Invoice;
