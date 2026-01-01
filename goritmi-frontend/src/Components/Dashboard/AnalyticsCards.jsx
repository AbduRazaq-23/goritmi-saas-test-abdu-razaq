import React, { useEffect, useState } from "react";
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

const AnalyticsCards = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState(null);

  // Dummy data fallback
  const dummyLine = [
    { name: "Jan", users: 120 },
    { name: "Feb", users: 210 },
    { name: "Mar", users: 340 },
    { name: "Apr", users: 280 },
    { name: "May", users: 420 },
    { name: "Jun", users: 520 },
    // { name: "Jul", users: 520 },
    // { name: "Aug", users: 520 },
    // { name: "Sep", users: 520 },
    // { name: "Oct", users: 520 },
    // { name: "Nov", users: 520 },
    // { name: "Dec", users: 520 },
  ];

  const dummyBar = [
    { name: "Free", value: 240 },
    { name: "Pro", value: 130 },
    { name: "Enterprise", value: 50 },
  ];

  useEffect(() => {
    //  dummy data
    setOverview({
      line: dummyLine,
      bar: dummyBar,
      stats: { users, revenue: 9800, newUsers: users },
    });
  }, []);

  const stats = [
    {
      name: "Total User",
      val: 3,
      per: 100,
    },
    {
      name: "Revenue",
      val: 9800,
      per: 100,
    },
    {
      name: "New Users",
      val: 3,
      per: 100,
    },
  ];

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
                  s.per < 1 && "text-red-500"
                } mt-2 `}
              >
                {s.per}% (last 30d)
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
              <LineChart data={overview?.line || dummyLine}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#2563eb"
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
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsCards;
