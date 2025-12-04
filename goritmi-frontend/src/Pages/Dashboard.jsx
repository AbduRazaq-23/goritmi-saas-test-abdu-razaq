import React from "react";
import Sidebar from "../Components/Dashboard/SideBar";
import Topbar from "../Components/Dashboard/TopBar";
import AnalyticsCards from "../Components/Dashboard/AnalyticsCards";
import Profile from "../Components/Dashboard/Profile";
import { Routes, Route } from "react-router-dom";
import GetAllUser from "../Components/Dashboard/GetAllUser";

const Dashboard = () => {
  return (
    <div className="min-h-screen  flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 min-w-0">
          <div>
            <Routes>
              <Route path="/" element={<AnalyticsCards />} />
              <Route path="profile" element={<Profile />} />
              <Route path="all-users" element={<GetAllUser />} />
              // Add more protected routes here
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Dashboard;
