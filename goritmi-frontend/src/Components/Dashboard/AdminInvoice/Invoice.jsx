import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { toast } from "react-toastify";
import gLogo from "../../../assets/g-logo.png";
import { IoIosPrint } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";

const Invoice = () => {
  const printRef = useRef();
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // FETCH INVOICE METHOD
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

  // USE EFFECT RUN ON ID TO FETCH INVOICE
  useEffect(() => {
    fetchInvoice();
  }, [id]);

  // HANDLE UPDATE STATUS
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

  // HANDLE PRINT
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: invoice ? `Invoice${invoice.invoiceNumber}` : "Invoice",
  });

  // ON LOADING
  if (loading) return <div className="p-6">Loading invoice...</div>;
  // ON ERROR
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  // IF NOT INVOICE
  if (!invoice) return null;

  // RETURN
  return (
    <>
      {/* PRINT BUTTON + Back Button */}
      <div className="flex justify-between">
        {/* Back Button */}
        <FaArrowLeft
          onClick={() => navigate("/dashboard/admin/invoices")}
          className=" text-blue-600 underline cursor-pointer"
        />

        <div className="flex items-center gap-2">
          {/* UPDATE BUTTON  */}
          {invoice.status === "DUE" && (
            <div
              onClick={() => navigate(`/dashboard/admin/invoices/update/${id}`)}
              className="flex items-center cursor-pointer gap-2 border border-gray-700 rounded-md p-1 text-sm font-semibold hover:scale-105 hover:text-blue-600 "
            >
              Update
              <GrUpdate />
            </div>
          )}

          {/* PRINT BUTTON */}
          <div
            onClick={handlePrint}
            className="flex items-center cursor-pointer gap-2 border border-gray-700 rounded-md p-1 text-sm font-semibold hover:scale-105 hover:text-blue-600 "
          >
            Print
            <IoIosPrint disabled={!invoice} />
          </div>
        </div>
      </div>
      <div ref={printRef} className="p-6 max-w-4xl mx-auto">
        {/* Logo & Name  */}
        <div className="w-full mb-5">
          <img
            src={gLogo}
            alt="Grok logo"
            width="200"
            height="200"
            loading="lazy"
            className="m-auto"
          />
        </div>
        {/* Header */}
        <div className="flex flex-col md:flex-row  justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Invoice {invoice?.invoiceNumber}
            </h1>
            <p className="text-gray-500">{invoice?.userId}</p>
            <p className="text-red-400">{invoice?.cancelReason}</p>
          </div>

          {updating && (
            <span className="text-sm text-gray-600">Updating...</span>
          )}

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
          {/* ===== Desktop Table ===== */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="p-3 text-left bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3">Contact</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">{invoice?.userId.email}</td>
                  <td className="p-3 ">{invoice?.userId.contact}</td>
                </tr>
              </tbody>
            </table>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-center">Unit Price</th>
                  <th className="p-3 text-center">Total</th>
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

          {/* ===== Mobile Cards ===== */}
          <div className="md:hidden space-y-4 p-4">
            {invoice?.items.map((item, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  {item.description}
                </h4>

                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Qty</span>
                  <span className="font-medium">{item.qty}</span>
                </div>

                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Unit Price</span>
                  <span className="font-medium">PKR {item.unitPrice}</span>
                </div>

                <div className="flex justify-between text-sm border-t pt-2 mt-2">
                  <span className="text-gray-700 font-medium">Total</span>
                  <span className="font-semibold text-gray-900">
                    PKR {item.qty * item.unitPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
      </div>
    </>
  );
};

export default Invoice;
