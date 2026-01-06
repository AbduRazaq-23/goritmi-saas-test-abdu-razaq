import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";

const AnalyticsCards = () => {
  const [overview, setOverview] = useState({ line: [], bar: [] });
  const [users, setUsers] = useState({
    totalUsers: 0,
    last30DaysUsers: 0,
    percentage: 0,
  });
  const [revenue, setRevenue] = useState({ revenue: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  const dummyBar = [
    { name: "Free", value: 240 },
    { name: "Pro", value: 130 },
    { name: "Enterprise", value: 50 },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [monthsRes, analyticsRes, revenueRes, getPlan] =
          await Promise.all([
            axios.get("http://localhost:5000/api/user/months"),
            axios.get("http://localhost:5000/api/user/analytics"),
            axios.get("http://localhost:5000/api/admin/invoices/revenue"),
            axios.get("http://localhost:5000/api/admin/invoices/plan"),
          ]);

        setOverview({ line: monthsRes.data, bar: getPlan.data });
        setUsers(analyticsRes.data);
        setRevenue(revenueRes.data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = [
    {
      name: "Total User",
      val: users?.totalUsers,
      per: 100,
    },
    {
      name: "Revenue",
      val: revenue?.revenue,
      per: revenue?.percentage,
    },
    {
      name: "New Users",
      val: users?.last30DaysUsers,
      per: users?.percentageChange,
    },
  ];

  if (loading) {
    return <div className="text-center py-10">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {stats.map((s) => {
          return (
            <motion.div
              key={s.name}
              className="bg-white p-6 rounded-2xl shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm text-gray-500">{s.name}</h4>
              <div className="mt-3 text-2xl font-bold">{s.val}</div>
              <div
                className={`text-sm text-green-600 ${
                  s.per < 0 && "text-red-500"
                } mt-2 `}
              >
                {s.per}% {s.name !== "Total User" && "(last 30d)"}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 ">
        <div className="bg-white p-6 rounded-2xl ">
          <h4 className="text-lg font-semibold mb-4">Users (Last 6 months)</h4>
          <div className="w-full h-64  block">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overview?.line}>
                <XAxis dataKey="name" />
                <YAxis
                  domain={[0, "dataMax"]}
                  allowDecimals={false}
                  tickCount={6}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#1f2937"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow ">
          <h4 className="text-lg font-semibold mb-4">Plans Distribution</h4>
          <div className="w-full h-64  block min-w-0">
            <ResponsiveContainer>
              <BarChart data={overview?.bar || dummyBar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  domain={[0, "dataMax"]}
                  allowDecimals={false}
                  tickCount={6}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#1f2937" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsCards;
