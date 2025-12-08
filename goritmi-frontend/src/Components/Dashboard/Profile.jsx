import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, getProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [pass, setPass] = useState({ oldPassword: "", newPassword: "" });

  useEffect(() => {
    if (user) setForm({ name: user.name || "", email: user.email || "" });
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePsswordChange = (e) =>
    setPass({ ...pass, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/auth/update-profile",
        form
      );
      getProfile();
      // toast to be here
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handlePsswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/auth/update-password",
        pass
      );
      setPass({ oldPassword: "", newPassword: "" });
      console.log("success", res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h3 className="text-xl font-semibold mb-4">Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Full name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Save Changes
        </button>
      </form>
      {/* //============= // Password //============= */}
      <div className="w-full flex justify-between mt-5 gap-1">
        <input
          className="w-full border rounded-md px-3 py-2"
          type="password"
          name="oldPassword"
          value={pass.oldPassword}
          onChange={handlePsswordChange}
          placeholder="Old Password"
        />
        <input
          className="w-full border rounded-md px-3 py-2"
          type="password"
          name="newPassword"
          value={pass.newPassword}
          onChange={handlePsswordChange}
          placeholder="New Password"
        />
        <button
          onClick={handlePsswordSubmit}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Change
        </button>
      </div>
    </div>
  );
};
export default Profile;
