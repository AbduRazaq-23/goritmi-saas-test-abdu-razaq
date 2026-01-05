import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaUsers, FaSignOutAlt, FaBars } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

import { useAuth } from "../../context/AuthContext";

const SideBar = () => {
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const loc = useLocation();

  const nav = [
    {
      path: "/dashboard",
      label: "Overview",
      icon: <FaHome />,
      roles: ["admin", "user"],
    },
    {
      path:
        user?.role === "admin"
          ? "/dashboard/admin/invoices"
          : "/dashboard/user/invoices",
      label: "Invoices",
      icon: <FaFileInvoiceDollar />,
      roles: ["admin", "user"],
    },
    {
      path: "/dashboard/profile",
      label: "Profile",
      icon: <FaUser />,
      roles: ["admin", "user"],
    },
    {
      path: "/dashboard/admin/business/profile",
      label: "Business Profile",
      icon: <CgProfile />,
      roles: ["admin"],
    },
    {
      path: "/dashboard/admin/all-users",
      label: "Users",
      icon: <FaUsers />,
      roles: ["admin"],
    },
  ];

  const filterNav = nav.filter((n) => n.roles.includes(user?.role));

  return (
    <aside
      className={`sticky top-0 z-50 h-screen bg-gray-900 p-2 transition-all duration-200 min-w-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="text-white font-bold text-lg">
            {!collapsed && "GoritmiDev"}
          </div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-gray-100 text-white hover:text-gray-900"
        >
          <FaBars />
        </button>
      </div>

      <nav className="mt-4 ">
        {filterNav.map((n) => {
          const active =
            loc.pathname === n.path ||
            (n.path !== "/dashboard" && loc.pathname.startsWith(n.path));
          return (
            <Link
              to={n.path}
              key={n.label}
              className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 hover:text-gray-900 ${
                active ? "bg-gray-50 text-gray-900 font-semibold" : "text-white"
              }`}
            >
              <span className="text-lg">{n.icon}</span>
              {!collapsed && <span>{n.label}</span>}
            </Link>
          );
        })}

        <div className="mt-6 border-t border-gray-700 pt-4 px-2">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full text-left text-red-600 hover:text-red-300 hover:bg-red-600 px-1  py-2 rounded-md"
          >
            <FaSignOutAlt /> <span>{!collapsed && "Logout"}</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
export default SideBar;
