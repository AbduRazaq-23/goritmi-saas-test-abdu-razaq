import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import gLogo from "../../assets/g-logo.png";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editShow, setEditShow] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (user) setForm({ name: user.name || "", email: user.email || "" });
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/user/update-profile",
        form.name
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

  const isAdmin = user.role === "admin";

  return (
    <div className=" max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl">
      {/* Logo  */}
      <div className="w-full mb-5">
        {isAdmin ? (
          <img
            src={gLogo}
            alt="Grok logo"
            width="200"
            height="200"
            loading="lazy"
            className="m-auto"
          />
        ) : (
          <h1 className="text-center font-bold text-2xl">User Profile</h1>
        )}
      </div>

      <div className="flex flex-col items-center text-center border border-gray-400 rounded-md p-2 text-gray-800">
        {/* Name Edit Form + Name  */}
        {!editShow ? (
          <div className="flex justify-center items-center gap-2">
            <h1 className="font-semibold">{form.name} </h1>
            <CiEdit
              className="cursor-pointer"
              onClick={() => setEditShow(!editShow)}
            />{" "}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className=" flex  ">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className=" border rounded-l-md text-center"
              autoComplete="username"
            />

            <button
              type="submit"
              className=" bg-gray-700 rounded-r-md text-white px-1 hover:bg-gray-800  "
            >
              Save
            </button>
          </form>
        )}

        <h2 className="text-gray-700">{form.email}</h2>
        {isAdmin && (
          <>
            {" "}
            <h2 className="text-gray-700">+923065011190</h2>
            <h2 className="text-gray-700">
              Al Sayed Plaza University Road Peshawar
            </h2>
          </>
        )}
      </div>
    </div>
  );
};
export default Profile;
