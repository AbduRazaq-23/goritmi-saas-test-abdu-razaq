import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const BusinessProfile = () => {
  const fileInputRef = useRef(null);

  const [editLogo, setEditLogo] = useState(false);
  const [editForm, setEditForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    email: "",
    contact: "",
    location: "",
  });

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  //   FETCH BUSINESS DATA
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/business/profile"
        );

        if (res.data?.businessProfile) {
          setForm(res.data.businessProfile);
          setPreview(res.data.businessProfile.logo?.url || "");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load profile");
      }
    };

    fetchBusiness();
  }, []);

  //   HANDLE FORM VALUE
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // HANDLE FILE
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  //  OPENS THE HIDDEN FILE INPUT WHEN A CUSTOM BUTTON CLICKED
  const triggerFileInput = () => fileInputRef.current.click();

  // UPLOAD LOGO
  const handleLogoUpload = async () => {
    if (!logo) return;
    const data = new FormData();
    data.append("logo", logo);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/business/profile/upload/logo",
        data
      );
      setPreview(res.data.logo.url);
      toast.success("Logo updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
      setLogo(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setEditLogo(false);
    }
  };

  // UPDATE BUSINESS DATA
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.patch(
        "http://localhost:5000/api/business/profile/update",
        form
      );
      setEditForm(false);
      toast.success("Business updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto md:px-4 sm:px-6 py-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ================= LOGO CARD ================= */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white text-gray-900 shadow-2xl rounded-xl p-5 flex flex-col items-center"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-gray-400 overflow-hidden bg-gray-50 mb-4">
            {preview ? (
              <img
                src={preview}
                alt="logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No Logo
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => {
              triggerFileInput();
              setEditLogo(true);
            }}
            className="text-xl sm:text-2xl font-bold"
          >
            +
          </button>

          {/* upload logo button  */}
          {editLogo && (
            <button
              onClick={handleLogoUpload}
              disabled={!logo || loading}
              className="mt-3 px-4 py-2 text-gray-900 border rounded-lg text-sm disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          )}
        </motion.div>

        {/* ================= FORM ================= */}
        <motion.form
          onSubmit={handleSubmit}
          className="md:col-span-2 bg-white text-gray-800  shadow-2xl rounded-xl p-5 sm:p-6 space-y-4"
        >
          {!editForm ? (
            <>
              <button
                type="button"
                onClick={() => setEditForm(true)}
                className="mb-4 border border-gray-400 rounded-md px-3 py-1 text-sm"
              >
                Update
              </button>

              {["title", "email", "contact", "location"].map((field) => (
                <div key={field}>
                  <label className="text-xs sm:text-sm capitalize text-gray-800">
                    {field}
                  </label>
                  <div className="mt-1  px-3 py-2 text-sm md:text-xl font-bold">
                    {form[field]}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {["title", "email", "contact", "location"].map((field) => (
                <div key={field}>
                  <label className="text-xs sm:text-sm capitalize text-gray-800">
                    {field}
                  </label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm text-gray-800"
                  />
                </div>
              ))}

              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="w-full border bg-gray-900 text-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Business"}
              </motion.button>
            </>
          )}
        </motion.form>
      </div>
    </motion.div>
  );
};

export default BusinessProfile;
