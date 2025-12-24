import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editShow, setEditShow] = useState(false);
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
        "http://localhost:5000/api/user/update-profile",
        form
      );
      setEditShow(!editShow);
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
      setEditShow(!editShow);
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
    <div className=" max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h3 className="text-xl font-bold text-center mb-4">Profile</h3>
      {!editShow ? (
        <div className="text-center text-gray-800">
          <div className="flex justify-center items-center gap-2">
            <h1 className="font-semibold">{form.name} </h1>
            <CiEdit
              className="cursor-pointer"
              onClick={() => setEditShow(!editShow)}
            />
          </div>
          <h2 className="text-gray-700">{form.email}</h2>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className=" w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-md"
            >
              Save Changes
            </button>
          </form>

          {/* //============= // Password //============= */}
          <form onSubmit={handlePasswordSubmit}>
            <h1 className="text-xl font-semibold text-center  my-5">
              Change Password
            </h1>
            <div className="w-full flex flex-col  justify-between mt-2 gap-4">
              <input
                className="w-full border rounded-md px-3 py-2"
                type="password"
                name="oldPassword"
                value={pass.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Old Password"
                autoComplete="old-password"
              />
              <input
                className="w-full border rounded-md px-3 py-2"
                type="password"
                name="newPassword"
                value={pass.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                autoComplete="new-password"
              />
              <button
                type="submit"
                className="py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-md"
              >
                Change
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
export default Profile;
