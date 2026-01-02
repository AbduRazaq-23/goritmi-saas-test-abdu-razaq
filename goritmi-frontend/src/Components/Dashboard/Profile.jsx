import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { FaSave } from "react-icons/fa";
import gLogo from "../../assets/g-logo.png";

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
        <img
          src={gLogo}
          alt="Grok logo"
          width="200"
          height="200"
          loading="lazy"
        />
        <img
          className="h-24 w-24 rounded-full"
          src={user?.logo.url}
          alt="profile"
        />
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
