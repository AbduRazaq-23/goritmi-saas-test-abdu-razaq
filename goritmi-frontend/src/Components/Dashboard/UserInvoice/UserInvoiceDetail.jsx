import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import gLogo from "../../../assets/g-logo.png";
import { IoIosPrint } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";

const UserInvoiceDetail = () => {
  const printRef = useRef(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH INVOICE API FUNCTION
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

  // USE EFFECT TO FETCH INVOICE RUN BY ID CHANGING
  useEffect(() => {
    fetchInvoice();
  }, [id]);

  // PRINT HANDLING
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: invoice ? `Invoice-${invoice.invoiceNo}` : "Invoice",
  });

  // IF LOADING
  if (loading) return <div className="p-6">Loading invoice...</div>;
  // IF ERROR
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  // RETURN
  return (
    <>
      {/* PRINT BUTTON + Back Button */}
      <div className="flex justify-between">
        {/* Back Button */}
        <FaArrowLeft
          onClick={() => navigate("/dashboard/user/invoices")}
          className=" text-blue-600 underline cursor-pointer"
        />

        {/* PRINT BUTTON */}
        <IoIosPrint
          onClick={handlePrint}
          disabled={!invoice}
          size={25}
          className="hover:scale-110 hover:text-blue-600 cursor-pointer"
        />
      </div>

      {/* PRINT AREA */}
      <div ref={printRef} className="p-3 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="w-full mb-5">
          <img
            src={gLogo}
            alt="Grok logo"
            width="200"
            loading="lazy"
            className="m-auto"
          />
        </div>

        {/* Header */}
        <div className="md:flex space-y-3 md:space-y-0 justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{invoice.invoiceNumber}</h1>
            <p className="text-gray-500">
              Issued on {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex">
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${
                invoice.status === "DUE"
                  ? "bg-yellow-100 text-yellow-700"
                  : invoice.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {invoice.status}
            </span>
            {invoice.status === "DUE" && (
              <p className="text-gray-500">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white shadow rounded mb-6">
          {/* Desktop */}
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
                  <td className="p-3">{invoice.userId.email}</td>
                  <td className="p-3 ">{invoice.userId.contact}</td>
                </tr>
              </tbody>
            </table>
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

          {/* Mobile */}
          <div className="md:hidden space-y-4 p-2">
            <div>
              <h1 className="font-semibold">Email</h1>
              <p className="text-sm">{invoice.userId.email}</p>
              <h1 className="font-semibold">Contact</h1>
              <p className="text-sm">{invoice.userId.contact}</p>
            </div>
            {invoice.items.map((item, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <h4 className="font-semibold mb-2">{item.description}</h4>

                <div className="flex justify-between text-sm">
                  <span>Qty</span>
                  <span>{item.qty}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Unit Price</span>
                  <span>PKR {item.unitPrice}</span>
                </div>

                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>PKR {item.qty * item.unitPrice}</span>
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

        {/* Notes */}
        {(invoice.notes || invoice.cancelReason) && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-2">
              {invoice.cancelReason ? "Cancel Reason" : "Notes"}
            </h3>
            <p>{invoice.cancelReason || invoice.notes}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default UserInvoiceDetail;
