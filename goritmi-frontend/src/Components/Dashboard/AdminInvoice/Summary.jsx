import { useEffect, useState } from "react";
import axios from "axios";
import InvoiceList from "./InvoicesList";

const Summary = () => {
  const [summary, setSummary] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/admin/invoices/summary"
        );
        setSummary(res.data);
      } catch (err) {
        setError("Failed to load invoice summary");
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="p-6">Loading summary...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="mt- p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Receivable */}
        <div className="bg-green-100 p-5 rounded-lg shadow">
          <p className="text-sm text-gray-600">Grand Total</p>
          <h2 className="text-2xl font-bold text-green-700">
            PKR {summary.grandTotal}
          </h2>
        </div>
        <div className="bg-yellow-100 p-5 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Receivable</p>
          <h2 className="text-2xl font-bold text-yellow-700">
            PKR {summary.totalReceivable}
          </h2>
        </div>

        {/* Received */}
        <div className="bg-green-100 p-5 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Received</p>
          <h2 className="text-2xl font-bold text-green-700">
            PKR {summary.totalReceived}
          </h2>
        </div>

        {/* Cancelled */}
        <div className="bg-red-100 p-5 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Cancelled</p>
          <h2 className="text-2xl font-bold text-red-700">
            PKR {summary.totalCancelled}
          </h2>
        </div>
      </div>
      <InvoiceList />
    </div>
  );
};

export default Summary;
