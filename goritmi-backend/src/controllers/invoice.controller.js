import Invoice from "../models/invoice.model.js";
import User from "../models/user.model.js";
import generateInvoiceNo from "../utills/generateInvoiceNo.js";
import InvoiceStatusLog from "../models/invoiceStatusLog.model.js";

// ===========================================
//  CREATE INVOICE
// ===========================================

const createInvoice = async (req, res) => {
  try {
    const { items, tax = 0, discount = 0, dueDate, notes } = req.body;

    const userId = req.user.id;

    // 1 Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "User and invoice items are required" });
    }

    // 2️ Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️ Calculate totals
    let subTotal = 0;

    const calculatedItems = items.map((item) => {
      const lineTotal = item.qty * item.unitPrice;
      subTotal += lineTotal;

      return {
        description: item.description,
        qty: item.qty,
        unitPrice: item.unitPrice,
        lineTotal,
      };
    });

    const totalAmount = subTotal + tax - discount;

    if (totalAmount < 0) {
      return res
        .status(400)
        .json({ message: "Invalid tax or discount values" });
    }

    // 4️ Generate invoice number
    const invoiceNumber = await generateInvoiceNo();

    // 5️ Create invoice
    const invoice = await Invoice.create({
      invoiceNumber,
      userId,
      items: calculatedItems,
      subTotal,
      tax,
      discount,
      totalAmount,
      dueDate,
      notes,
      status: "DUE",
      createdBy: req.user.id, // admin ID from auth middleware
    });

    return res
      .status(201)
      .json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    console.error("Create invoice error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===========================================
//  UPDATE INVOICE STATUS
// ===========================================

const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, receivedAmount, cancelReason, note } = req.body;

    // 1 Validate status
    const allowedStatus = ["DUE", "PAID", "CANCELLED"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid invoice status" });
    }

    // 2 Find Invoice
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const fromStatus = invoice.status;

    // 3️ Prevent invalid transitions
    //  PAID
    if (fromStatus === "PAID") {
      return res
        .status(400)
        .json({ message: "Paid invoice cannot be modified" });
    }

    //   CANCELLED
    if (fromStatus === "CANCELLED") {
      return res
        .status(400)
        .json({ message: "Cancelled invoice cannot be modified" });
    }

    // 4️ Status-specific rules
    if (status === "PAID") {
      invoice.status = "PAID";
      invoice.paidAt = new Date();
      invoice.receivedAmount = receivedAmount ?? invoice.totalAmount;
      invoice.cancelledAt = null;
      invoice.notes = note || null;
      invoice.cancelReason = null;
    }

    if (status === "CANCELLED") {
      invoice.status = "CANCELLED";
      invoice.cancelledAt = new Date();
      invoice.cancelReason = cancelReason || "Cancelled by admin";
      invoice.paidAt = null;
      invoice.notes = note || null;
      invoice.receivedAmount = 0;
    }

    if (status === "DUE") {
      return res
        .status(400)
        .json({ message: "Reverting to DUE is not allowed" });
    }

    await invoice.save();

    // 5️ Create status log
    await InvoiceStatusLog.create({
      invoiceId: invoice._id,
      fromStatus,
      toStatus: status,
      changedBy: req.user.id, // admin
      note: note || null,
    });

    return res.status(200).json({
      message: "Invoice status updated successfully",
      invoice,
    });
  } catch (error) {
    console.error("Update invoice status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===========================================
//  ADMIN INVOICE LIST CONTROLLER
// ===========================================

const getAdminInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};

    // 1️ Status filter (DUE / PAID / CANCELLED)
    if (status && ["DUE", "PAID", "CANCELLED"].includes(status)) {
      query.status = status;
    }

    // 2️ Search by invoiceNo or user email
    if (search) {
      const users = await User.find({
        email: { $regex: search, $options: "i" },
      }).select("_id");

      query.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { userId: { $in: users.map((u) => u._id) } },
      ];
    }

    // 3️ Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Invoice.countDocuments(query),
    ]);

    return res.status(200).json({
      data: invoices,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Update invoice status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===========================================
//  GET INVOICE SUMMARY
// ===========================================

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    return res.status(200).json({ invoice });
  } catch (error) {
    console.error("Invoice  error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getInvoiceSummary = async (req, res) => {
  try {
    const summary = await Invoice.aggregate([
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$totalAmount" },
          totalReceived: { $sum: "$receivedAmount" },
        },
      },
    ]);

    // Default values
    let totalReceivable = 0;
    let totalReceived = 0;
    let totalCancelled = 0;

    summary.forEach((item) => {
      if (item._id === "DUE") {
        totalReceivable = item.totalAmount;
      }
      if (item._id === "PAID") {
        // receivedAmount preferred, fallback to totalAmount
        totalReceived = item.totalReceived || item.totalAmount;
      }
      if (item._id === "CANCELLED") {
        totalCancelled = item.totalAmount;
      }
    });

    return res.status(200).json({
      totalReceivable,
      totalReceived,
      totalCancelled,
    });
  } catch (error) {
    console.error("Invoice summary error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createInvoice,
  updateInvoiceStatus,
  getAdminInvoices,
  getInvoiceSummary,
  getInvoiceById,
};
