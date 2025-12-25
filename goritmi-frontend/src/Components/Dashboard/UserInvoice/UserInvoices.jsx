import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserInvoices = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/user/invoices");
      setInvoices(res.data.invoices);
    } catch (err) {
      setError("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInvoices();
  }, []);

  if (loading) {
    return <div className="p-6">Loading invoices...</div>;
  }

  if (invoices.length === 0) {
    return <div className="p-6">No invoices found</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Invoices</h1>

      <div className="w-full">
        {/* DESKTOP VERSION  */}
        <div className="hidden md:block">
          {invoices?.length === 0 ? (
            <p>No invoices found</p>
          ) : (
            <table className="w-full bg-white shadow rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Invoice No</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices?.map((inv) => (
                  <tr key={inv._id} className="border-t">
                    <td className="p-3">{inv.invoiceNumber}</td>
                    <td className="p-3">PKR {inv.totalAmount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium
                    ${
                      inv.status === "DUE"
                        ? "bg-yellow-100 text-yellow-700"
                        : inv.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/user/invoices/${inv._id}`)
                        }
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* MOBILE VERSION  */}
        {/* 📱 MOBILE CARDS */}
        <div className="md:hidden space-y-4 p-4">
          {loading ? (
            <div className="bg-white p-6 rounded shadow text-center text-gray-600">
              Loading invoices...
            </div>
          ) : invoices?.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-center text-gray-600">
              No invoices found
            </div>
          ) : (
            invoices.map((inv) => (
              <div
                key={inv._id}
                className="bg-white border rounded-lg p-4 shadow"
              >
                {/* Header with invoice number + status badge */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-900">
                    {inv.invoiceNumber}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
              ${
                inv.status === "DUE"
                  ? "bg-yellow-100 text-yellow-700"
                  : inv.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
                  >
                    {inv.status}
                  </span>
                </div>

                {/* Details */}
                {inv.userId?.email && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium text-gray-700">User:</span>{" "}
                    {inv.userId.email}
                  </p>
                )}

                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium text-gray-700">Amount:</span> PKR{" "}
                  {inv.totalAmount}
                </p>

                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium text-gray-700">Created:</span>{" "}
                  {new Date(inv.createdAt).toLocaleDateString()}
                </p>

                {/* Action button */}
                <button
                  onClick={() =>
                    navigate(`/dashboard/user/invoices/${inv._id}`)
                  }
                  className="w-full text-center text-blue-600 font-medium border border-gray-300 rounded py-2 hover:bg-gray-50 transition-colors"
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInvoices;
