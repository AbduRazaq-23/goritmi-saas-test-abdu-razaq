import Invoice from "../models/invoice.model.js";

// ==================================================
// GET USER ALL OWN INVOICES
// ==================================================
const getMyInvoices = async (req, res) => {
  try {
    const userId = req.user.id;

    const invoices = await Invoice.find({ userId })
      .sort({ createdAt: -1 })
      .select(
        "invoiceNumber status totalAmount currency dueDate paidAt createdAt"
      );

    return res.status(200).json({
      invoices,
    });
  } catch (error) {
    console.error("User invoices error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ==================================================
// GET USER INVOICE BY ID
// ==================================================

const getMyInvoiceById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const invoice = await Invoice.findOne({
      _id: id,
      userId,
    }).populate("createdBy", "name email");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json({
      invoice,
    });
  } catch (error) {
    console.error("User invoice detail error:", error);
    res.status(500).json({ message: error.message });
  }
};

export { getMyInvoices, getMyInvoiceById };
