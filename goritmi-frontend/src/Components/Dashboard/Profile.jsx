import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, setUser, getProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [pass, setPass] = useState({ oldPassword: "", newPassword: "" });

  useEffect(() => {
    if (user) setForm({ name: user.name || "", email: user.email || "" });
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPass({ ...pass, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/auth/update-profile",
        form
      );
      // update state on update
      setUser((prev) => ({ ...prev, ...res.data.user }));
      // toast to show success message
      toast.success(res?.data?.message || "Update profile s");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      // change password api call
      const res = await axios.patch(
        "http://localhost:5000/api/auth/update-password",
        pass
      );
      // set password field empty
      setPass({ oldPassword: "", newPassword: "" });
      // toast to success message
      toast.success(res?.data?.message, {
        position: "top-right",
        autoClose: "1000",
      });
    } catch (error) {
      // toast to show error
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: "1000",
      });
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
          onChange={handlePasswordChange}
          placeholder="Old Password"
        />
        <input
          className="w-full border rounded-md px-3 py-2"
          type="password"
          name="newPassword"
          value={pass.newPassword}
          onChange={handlePasswordChange}
          placeholder="New Password"
        />
        <button
          onClick={handlePasswordSubmit}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Change
        </button>
      </div>
    </div>
  );
};
export default Profile;
