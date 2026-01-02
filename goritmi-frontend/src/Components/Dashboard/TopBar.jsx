import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaFileInvoiceDollar } from "react-icons/fa";
import axios from "axios";

const TopBar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

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

  // click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 w-full z-50 bg-gray-900 text-gray-100 border-b p-4 flex items-center justify-end">
      {/* BADGE & LOGO  */}
      <div className=" flex items-center gap-5">
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

        <div ref={menuRef} className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold"
          >
            <img
              className="h-10 w-10 rounded-full"
              src={user?.logo.url}
              alt="logo"
            />
          </div>
          {open && (
            <div className="absolute right-0 text-center w-48 bg-gray-900 border rounded-md shadow-lg  z-50">
              <img
                className="rounded-full w-14 h-14 mx-auto mt-5"
                src={user?.logo.url}
                alt="logo"
              />
              <div className="px-4 py-2 text-sm text-gray-200">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-300">{user?.email}</p>
              </div>

              {/*  */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default TopBar;
