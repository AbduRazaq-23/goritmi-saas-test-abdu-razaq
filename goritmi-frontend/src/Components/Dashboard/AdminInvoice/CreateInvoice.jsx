import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const CreateInvoice = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    items: [{ description: "", qty: 1, unitPrice: null }],
    tax: 0,
    discount: 0,
    dueDate: "",
    notes: "",
  });

  //  Load users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/get-all-users"
        );
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  //  Handle item change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm({ ...form, items: updatedItems });
  };

  //  Add new item row
  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", qty: 1, unitPrice: 0 }],
    });
  };

  //  Remove item row
  const removeItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  };

  //  Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/admin/invoices", form);
      navigate("/dashboard/admin/invoices");
    } catch (error) {
      // Backend may return message (string) or errors (array)
      const data = error?.response?.data;

      if (data?.errors && Array.isArray(data.errors)) {
        // If multiple errors, show each toast
        data.errors.forEach((msg) => toast.error(msg));
      } else if (data?.message) {
        // Single error message
        toast.error(data.message);
      } else {
        // Fallback generic error
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  //  Select User
  const options = users.map((u) => ({
    value: u._id,
    label: `${u.email} (${u.name})`,
  }));

  return (
    <>
      <FaArrowLeft
        onClick={() => navigate("/dashboard/admin/invoices")}
        className=" text-blue-600 underline cursor-pointer"
      />
      <div className="p-6 max-w-5xl mx-auto rounded-md shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Create Invoice</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User */}
          <Select
            options={options}
            onChange={(opt) => setForm({ ...form, userId: opt.value })}
            placeholder="Search user..."
            isSearchable
            // box style
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? "#000" : "#000",
                boxShadow: state.isFocused ? "0 0 0 1px #000" : "none",
                "&:hover": {
                  borderColor: "#000",
                },
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#e5e7eb" : "#fff",
                color: "#000",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#000",
              }),
            }}
          />

          {/* Items */}
          <div>
            <h2 className="font-semibold mb-2">Items</h2>

            {form?.items?.map((item, index) => (
              <div key={index} className="md:grid grid-cols-4 gap-4 mb-2">
                <div className="flex flex-col col-span-2">
                  <label>Description</label>
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    className="border p-2 rounded "
                  />
                </div>

                <div className="flex flex-col">
                  <label>Qty</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", Number(e.target.value))
                    }
                    className="border p-2 rounded"
                  />
                </div>

                <div className="flex flex-col">
                  <label>Unit Price</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^\d*$/.test(v)) {
                        handleItemChange(
                          index,
                          "unitPrice",
                          v === "" ? "" : Number(v)
                        );
                      }
                    }}
                    className="border p-2 rounded"
                  />
                </div>

                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="text-blue-600 mt-2"
            >
              + Add Item
            </button>
          </div>

          {/* Tax & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Tax</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Tax"
                value={form.tax === 0 ? "" : form.tax}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setForm({
                      ...form,
                      tax: value === "" ? "" : Number(value),
                    });
                  }
                }}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-1">Discount</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Discount"
                value={form.discount === 0 ? "" : form.discount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setForm({
                      ...form,
                      discount: value === "" ? "" : Number(value),
                    });
                  }
                }}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block mb-1">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateInvoice;
