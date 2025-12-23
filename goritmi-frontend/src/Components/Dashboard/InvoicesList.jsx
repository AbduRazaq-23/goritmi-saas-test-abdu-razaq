import { useEffect, useState } from "react";
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

  //  Fetch invoices
  const fetchInvoices = async (e) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/invoices", {
        params: {
          page,
          limit: 3,
          status: status || undefined,
          search: search || undefined,
        },
      });

      setInvoices(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  //  Refetch when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvoices();
    }, 400);

    return () => clearTimeout(timer);
  }, [page, status, search]);

  return (
    <div className="mt-2">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Invoices</h1>

        <button
          onClick={() => navigate("/dashboard/admin/invoices/create")}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded"
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
      <table className="w-full border-collapse bg-white shadow rounded min-h-[200px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Invoice No</th>
            <th className="hidden md:table-cell p-3 text-left">User</th>
            <th className="hidden md:table-cell p-3 text-left">Amount</th>
            <th className="hidden md:table-cell p-3 text-left">Status</th>
            <th className="hidden md:table-cell p-3 text-left">Created</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
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
                <td className="hidden md:table-cell p-3">
                  {inv.userId?.email}
                </td>
                <td className="hidden md:table-cell p-3">
                  PKR {inv.totalAmount}
                </td>
                <td className="p-3">
                  <span
                    className={`hidden md:table-cell px-2 py-1 rounded text-sm font-medium
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
                <td className="hidden md:table-cell p-3">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <Link to={`/dashboard/admin/invoice/${inv._id}`}>
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 📄 Pagination */}
      <div className="flex justify-center items-center gap-4 mt-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InvoiceList;
