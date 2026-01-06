import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { FaSave } from "react-icons/fa";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editName, setEditName] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
  });

  // ======= HANDLE LOGO =====
  const [preview, setPreview] = useState(user?.logo?.url);
  const [logo, setLogo] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => fileInputRef.current.click();

  // select file
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  // update logo
  const updateLogo = async () => {
    if (!logo) return;

    const data = new FormData();
    data.append("logo", logo);
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/user/upload/logo",
        data
      );
      toast.success(res?.data?.message, { autoClose: 1000 });
      setUser(res?.data?.user);
      setPreview(res?.data?.user?.logo?.url);
      setLogo(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "failled to upload");
    }
  };

  useEffect(() => {
    if (user)
      setForm({
        name: user.name || "",
        email: user.email || "",
        contact: user.contact || "",
        location: user.location || "",
      });
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/user/update-profile",
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

  const isAdmin = user.role === "admin";

  return (
    <div className=" max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl">
      {/* Logo  */}
      <div className="w-full flex justify-around mb-5">
        <div className="relative w-24 h-24 group flex flex-col">
          <img
            className="h-24 w-24 rounded-full object-cover"
            src={preview}
            alt="profile"
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
          {!logo ? (
            <button
              onClick={handleClick}
              className="absolute inset-0 flex items-center justify-center text-gray-200 text-2xl font-bold cursor-pointer    opacity-0 group-hover:opacity-100 transition-opacity"
            >
              +
            </button>
          ) : (
            <button
              className="text-gray-600 border border-gray-300 rounded "
              onClick={updateLogo}
            >
              upload
            </button>
          )}
        </div>
      </div>

      <div className=" p-2 text-gray-800">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {/* TABLE */}
          <table className="w-full">
            <tbody className="divide-y">
              {/* Name */}
              <tr className="grid grid-cols-1 md:table-row p-4 md:p-0">
                <td className="font-semibold text-gray-600 md:px-4 md:py-3">
                  Name
                </td>
                <td className="md:px-4 md:py-3">
                  {!editName ? (
                    <div className="flex justify-between items-center">
                      {form.name}
                      <CiEdit
                        className=" cursor-pointer "
                        onClick={() => setEditName(!editName)}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className=" border rounded-md text-center"
                        autoComplete="username"
                      />

                      <FaSave
                        className=" cursor-pointer "
                        onClick={() => {
                          handleSubmit();
                          setEditName(!editName);
                        }}
                      />
                    </div>
                  )}
                </td>
              </tr>
              {/* Email */}
              <tr className="grid grid-cols-1 md:table-row p-4 md:p-0">
                <td className="font-semibold text-gray-600 md:px-4 md:py-3">
                  Email
                </td>
                <td className="break-all md:px-4 md:py-3">{form.email}</td>
              </tr>
              {/* Contact */}
              <tr className="grid grid-cols-1 md:table-row p-4 md:p-0">
                <td className="font-semibold text-gray-600 md:px-4 md:py-3">
                  Contact
                </td>
                <td className="md:px-4 md:py-3">
                  {!editContact ? (
                    <div className="flex justify-between items-center">
                      {form.contact}
                      <CiEdit
                        className=" cursor-pointer "
                        onClick={() => setEditContact(!editContact)}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <input
                        name="contact"
                        value={form.contact}
                        onChange={handleChange}
                        className=" border rounded-md text-center"
                        autoComplete="contact"
                      />

                      <FaSave
                        className=" cursor-pointer "
                        onClick={() => {
                          handleSubmit();
                          setEditContact(!editContact);
                        }}
                      />
                    </div>
                  )}
                </td>
              </tr>
              {/* IF ADMIN SHOW THE ADRESS */}
              {isAdmin && (
                <>
                  {/* Address */}
                  <tr className="grid grid-cols-1 md:table-row p-4 md:p-0">
                    <td className="font-semibold text-gray-600 md:px-4 md:py-3">
                      Address
                    </td>
                    <td className="md:px-4 md:py-3">
                      {!editAddress ? (
                        <div className="flex justify-between items-center">
                          {form.location}
                          <CiEdit
                            className=" cursor-pointer "
                            onClick={() => setEditAddress(!editAddress)}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            className=" border rounded-md text-center"
                            autoComplete="location"
                          />

                          <FaSave
                            className=" cursor-pointer "
                            onClick={() => {
                              handleSubmit();
                              setEditAddress(!editAddress);
                            }}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Profile;
