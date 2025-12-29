import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const UpdateInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    items: [],
    tax: 0,
    discount: 0,
    dueDate: "",
    notes: "",
  });

  // 1️⃣ Fetch existing invoice
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin/invoice/${id}`
        );
        const invoice = res.data.invoice;

        setForm({
          items: invoice.items.map((i) => ({
            description: i.description,
            qty: i.qty,
            unitPrice: i.unitPrice,
          })),
          tax: invoice.tax,
          discount: invoice.discount,
          dueDate: invoice.dueDate?.slice(0, 10),
          notes: invoice.notes || "",
        });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  // 2️ Item handlers
  const handleItemChange = (index, field, value) => {
    const updated = [...form.items];
    updated[index][field] = value;
    setForm({ ...form, items: updated });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", qty: 1, unitPrice: 0 }],
    });
  };

  const removeItem = (index) => {
    const updated = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updated });
  };

  // 3️ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await axios.patch(
        `http://localhost:5000/api/admin/invoices/update/${id}`,
        form
      );
      toast.success("updated successfully");
      navigate(`/dashboard/admin/invoice/${id}`);
    } catch (err) {
      toast.error(err.response?.data || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      <FaArrowLeft
        onClick={() => navigate(`/dashboard/admin/invoices/${id}`)}
        className=" text-blue-600 underline cursor-pointer"
      />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Update Invoice</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Items */}
          <div>
            <h2 className="font-semibold mb-2">Items</h2>

            {form.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 mb-2">
                <div className="flex flex-col col-span-2">
                  <label htmlFor="description">Description</label>
                  <input
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="border p-2 rounded "
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="Qty">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", Number(e.target.value))
                    }
                    className="border p-2 rounded"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="unit price">Unit price</label>

                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "unitPrice",
                        Number(e.target.value)
                      )
                    }
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
            <div className="flex flex-col">
              <label htmlFor="Tax">Tax</label>
              <input
                type="number"
                placeholder="Tax"
                value={form.tax}
                onChange={(e) =>
                  setForm({ ...form, tax: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="Discount">Discount</label>
              <input
                type="number"
                placeholder="Discount"
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />
            </div>
          </div>

          {/* Due date */}
          <div>
            <label htmlFor="due date">Due date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes">Notes</label>
            <textarea
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Invoice"}
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateInvoice;
