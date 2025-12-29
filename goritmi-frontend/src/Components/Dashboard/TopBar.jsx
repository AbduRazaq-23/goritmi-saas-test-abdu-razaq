import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaFileInvoiceDollar } from "react-icons/fa";
import axios from "axios";

const TopBar = () => {
  const [length, setLength] = useState(null);
  const { user, loading } = useAuth();

  const fetchMyInvoices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/invoices");
      setLength(res.data.invoices.length);
    } catch (err) {
      console.log("this is error", err);
    }
  };

  const isUser = user?.role === "user";

  isUser &&
    useEffect(() => {
      fetchMyInvoices();
    }, []);

  return (
    <header className="sticky top-0 w-full z-50 bg-gray-900 text-gray-100 border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-sm ">
          Welcome back,{" "}
          <span className="font-medium text-gray-300">
            {loading ? "Loading..." : user?.name || "User"}
          </span>
        </div>
      </div>

      {/* BADGE & LOGO  */}
      <div className="flex items-center gap-5">
        {/* if user show badge  */}
        {isUser && (
          <div className="relative inline-block">
            <FaFileInvoiceDollar size={25} />

            <span
              className="
            absolute
            -top-2
            -right-2
            bg-red-600
            text-white
            text-xs
            font-semibold
            rounded-full
            w-5
            h-5
            flex
            items-center
            justify-center
          "
            >
              {length}
            </span>
          </div>
        )}
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};
export default TopBar;
