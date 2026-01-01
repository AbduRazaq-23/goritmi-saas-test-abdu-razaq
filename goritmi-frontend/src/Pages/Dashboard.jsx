import React from "react";
import Sidebar from "../Components/Dashboard/SideBar";
import Topbar from "../Components/Dashboard/TopBar";
import AnalyticsCards from "../Components/Dashboard/AnalyticsCards";
import Profile from "../Components/Dashboard/Profile";
import { Routes, Route } from "react-router-dom";
import GetAllUser from "../Components/Dashboard/GetAllUser";
import Summary from "../Components/Dashboard/AdminInvoice/Summary";
import Invoice from "../Components/Dashboard/AdminInvoice/Invoice";
import CreateInvoice from "../Components/Dashboard/AdminInvoice/CreateInvoice";
import UserInvoices from "../Components/Dashboard/UserInvoice/UserInvoices";
import UserInvoiceDetail from "../Components/Dashboard/UserInvoice/UserInvoiceDetail";
import UpdateInvoice from "../Components/Dashboard/AdminInvoice/UpdateInvoice";
import BusinessProfile from "../Components/Dashboard/BusinessProfile";

import { AdminRoute } from "../Routes/ProtectedRoutes";

const Dashboard = () => {
  return (
    <div className="min-h-screen  flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 min-w-0">
          <div>
            <Routes>
              {/* DASHBOARD HOME  */}
              <Route index element={<AnalyticsCards />} />
              {/* PROFILE  */}
              <Route path="profile" element={<Profile />} />
              {/* USER */}
              <Route path="user/invoices" element={<UserInvoices />} />
              <Route path="user/invoices/:id" element={<UserInvoiceDetail />} />
              {/* ADMIN   */}
              <Route
                path="admin/all-users"
                element={
                  <AdminRoute>
                    <GetAllUser />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/invoices"
                element={
                  <AdminRoute>
                    <Summary />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/invoices/update/:id"
                element={
                  <AdminRoute>
                    <UpdateInvoice />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/invoices/:id"
                element={
                  <AdminRoute>
                    <Invoice />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/invoices/create"
                element={
                  <AdminRoute>
                    <CreateInvoice />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/business/profile"
                element={
                  <AdminRoute>
                    <BusinessProfile />
                  </AdminRoute>
                }
              />
              {/* Add more protected routes here */}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Dashboard;
