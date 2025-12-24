import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateInvoice = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    items: [{ description: "", qty: 1, unitPrice: 0 }],
    tax: 0,
    discount: 0,
    dueDate: "",
    notes: "",
  });

  // 🔹 Load users for dropdown
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

  // 🔹 Handle item change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm({ ...form, items: updatedItems });
  };

  // 🔹 Add new item row
  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", qty: 1, unitPrice: 0 }],
    });
  };

  // 🔹 Remove item row
  const removeItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userId || form.items.length === 0) {
      return alert("User and items are required");
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/admin/invoices", form);
      navigate("/dashboard/admin/invoices");
    } catch (err) {
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto rounded-md shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Create Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User */}
        <div>
          <label className="block mb-1 font-medium">User</label>
          <select
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select user</option>
            {users?.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

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
                  required
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
                  required
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
                  required
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
              placeholder="Discount"
              value={form.tax === 0 ? "" : form.tax}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setForm({ ...form, tax: value === "" ? "" : Number(value) });
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
            required
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
  );
};

export default CreateInvoice;
