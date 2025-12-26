import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const InvoiceList = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // debounced search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  //  Fetch invoices
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/admin/invoices", {
        params: {
          page,
          limit: 10,
          status: status || undefined,
          search: debouncedSearch || undefined,
        },
      });

      setInvoices(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  }, [page, status, debouncedSearch]);

  // Fetch immediately when deps change
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <div className="mt-2">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Invoices</h1>

        {/* Create invoice button  */}
        <button
          onClick={() => navigate("/dashboard/admin/invoices/create")}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded cursor-pointer"
        >
          + Create Invoice
        </button>
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search invoice no / email"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border p-2 rounded md:w-64"
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className=" border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="DUE">DUE</option>
          <option value="PAID">PAID</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* 📋 Table */}
      {/* 📋 Desktop Table */}
      <div className="hidden md:block min-h-[350px]">
        <table className="w-full border-collapse bg-white shadow rounded min-h-[200px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Invoice No</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="relative">
            {loading ? (
              <tr className="absolute inset-0 bg-white/70">
                <td colSpan="6" className="p-6 text-center">
                  Loading invoices...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv._id} className="border-t">
                  <td className="p-3">{inv.invoiceNumber}</td>
                  <td className="p-3">{inv.userId?.email}</td>
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
                    <Link to={`/dashboard/admin/invoice/${inv._id}`}>
                      <button className="text-blue-600 hover:underline">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="bg-white p-6 rounded shadow text-center">
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center">
            No invoices found
          </div>
        ) : (
          invoices.map((inv) => (
            <div
              key={inv._id}
              className="bg-white border rounded-lg p-4 shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{inv.invoiceNumber}</span>
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

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">User:</span> {inv.userId?.email}
              </p>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Amount:</span> PKR{" "}
                {inv.totalAmount}
              </p>

              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Created:</span>{" "}
                {new Date(inv.createdAt).toLocaleDateString()}
              </p>

              <Link to={`/dashboard/admin/invoice/${inv._id}`}>
                <button className="w-full text-center text-blue-600 font-medium border border-gray-600 rounded py-2 hover:bg-gray-50">
                  View
                </button>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-center items-center gap-1 md:gap-4 mt-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="border px-1 md:px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="border px-1 md:px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InvoiceList;
