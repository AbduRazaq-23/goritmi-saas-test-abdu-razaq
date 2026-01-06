import Invoice from "../models/invoice.model.js";
import User from "../models/user.model.js";
import generateInvoiceNo from "../utills/generateInvoiceNo.js";
import InvoiceStatusLog from "../models/invoiceStatusLog.model.js";

// ===========================================
//  CREATE INVOICE
// ===========================================

const createInvoice = async (req, res) => {
  try {
    const { userId, items, tax = 0, discount = 0, dueDate, notes } = req.body;

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
//  UPDATE INVOICE DETAILS ONLY DUE
// ===========================================
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, tax = 0, discount = 0, dueDate, notes } = req.body;

    // 1️ Find existing invoice
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    if (!invoice.status) return;

    // If invoice paid or cancelled can't update
    if (invoice.status === "PAID") {
      return res.status(400).json("only due can be update");
    }

    // 2️ Validate items if provided
    let calculatedItems = invoice.items;
    let subTotal = invoice.subTotal;

    if (items && Array.isArray(items) && items.length > 0) {
      subTotal = 0;

      calculatedItems = items.map((item) => {
        if (!item.description || item.qty <= 0 || item.unitPrice < 0) {
          return res.status(400).json({ message: "Invalid invoice item data" });
        }

        const lineTotal = item.qty * item.unitPrice;
        subTotal += lineTotal;

        return {
          description: item.description,
          qty: item.qty,
          unitPrice: item.unitPrice,
          lineTotal,
        };
      });
    }

    // 3️ Recalculate totals (ONLY if needed)
    const updatedTax = tax ?? invoice.tax;
    const updatedDiscount = discount ?? invoice.discount;

    const totalAmount = subTotal + updatedTax - updatedDiscount;

    if (totalAmount < 0) {
      return res
        .status(400)
        .json({ message: "Total amount cannot be negative" });
    }

    // 4️ Update allowed fields ONLY
    invoice.items = calculatedItems;
    invoice.subTotal = subTotal;
    invoice.tax = updatedTax;
    invoice.discount = updatedDiscount;
    invoice.totalAmount = totalAmount;
    invoice.dueDate = dueDate ?? invoice.dueDate;
    invoice.notes = notes ?? invoice.notes;

    await invoice.save();

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (error) {
    console.error("Update invoice error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
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

// =============================================
//  ADMIN INVOICE LIST CONTROLLER BY FILTRATION
// =============================================

const getAdminInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, month } = req.query;

    const query = {};

    // 1️ Status filter (DUE / PAID / CANCELLED)
    if (status && ["DUE", "PAID", "CANCELLED"].includes(status)) {
      query.status = status;
    }

    // Filter by month
    if (month) {
      const currentYear = new Date().getFullYear();

      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 1);

      query.createdAt = {
        $gte: startDate,
        $lt: endDate,
      };
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

    // grand total of all
    let grandTotal = totalReceived + totalReceivable + totalCancelled || 0;

    return res.status(200).json({
      grandTotal,
      totalReceivable,
      totalReceived,
      totalCancelled,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================================
//  GET INVOICE BY ID
// ===========================================
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate(
      "userId",
      "email contact -_id"
    );

    return res.status(200).json({ invoice });
  } catch (error) {
    console.error("Invoice  error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================================
//  DELETE INVOICES BY ID'S
// ===========================================
const bulkDeleteInvoices = async (req, res) => {
  try {
    const { ids } = req.body;

    // Basic Validation
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No invoice IDs provided" });
    }

    // Delete Invoices By Id's
    const delMany = await Invoice.deleteMany({ _id: { $in: ids } });

    // Response
    return res.status(200).json({
      message: `${delMany.deletedCount} invoices deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// ===========================================
//  GET INOVICE REVENUE FOR ANALYTICS
// ===========================================
const getRevenue = async (req, res) => {
  try {
    const now = new Date();
    const last30Start = new Date(now);
    last30Start.setDate(now.getDate() - 30);

    const prev30Start = new Date(now);
    prev30Start.setDate(now.getDate() - 60);
    const prev30End = new Date(last30Start);

    // Current 30 days revenue
    const currentRevenue = await Invoice.aggregate([
      {
        $match: {
          status: "PAID", // adjust if needed
          createdAt: { $gte: last30Start },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Previous 30 days revenue
    const previousRevenue = await Invoice.aggregate([
      {
        $match: {
          status: "PAID",
          createdAt: { $gte: prev30Start, $lt: prev30End },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const currentTotal = currentRevenue[0]?.total || 0;
    const previousTotal = previousRevenue[0]?.total || 0;

    const percentageChange =
      previousTotal === 0
        ? currentTotal > 0
          ? 100
          : 0
        : ((currentTotal - previousTotal) / previousTotal) * 100;

    res.status(200).json({
      revenue: Math.round(currentTotal), // e.g., 9800
      percentage: Math.round(percentageChange), // e.g., 100
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch revenue" });
  }
};
// ===========================================
//  GET INOVICE PLAN
// ===========================================
// GET /api/admin/plans-distribution
const getPlan = async (req, res) => {
  try {
    // Aggregate users and count their invoices to determine plan
    const plans = await User.aggregate([
      {
        $lookup: {
          from: "invoices", // name of the Invoice collection (lowercase + s usually)
          localField: "_id",
          foreignField: "userId",
          as: "invoices",
        },
      },
      {
        $addFields: {
          invoiceCount: { $size: "$invoices" },
        },
      },
      {
        $group: {
          _id: null,
          free: {
            $sum: {
              $cond: [{ $eq: ["$invoiceCount", 0] }, 1, 0],
            },
          },
          pro: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$invoiceCount", 1] },
                    { $lte: ["$invoiceCount", 4] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          enterprise: {
            $sum: {
              $cond: [{ $gte: ["$invoiceCount", 5] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          distribution: [
            { name: "Free", value: "$free" },
            { name: "Pro", value: "$pro" },
            { name: "Enterprise", value: "$enterprise" },
          ],
        },
      },
    ]);

    const result =
      plans.length > 0
        ? plans[0].distribution
        : [
            { name: "Free", value: 0 },
            { name: "Pro", value: 0 },
            { name: "Enterprise", value: 0 },
          ];

    return res.status(200).json(result);
  } catch (error) {
    console.error("Plans distribution error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch plans distribution" });
  }
};

export {
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  getAdminInvoices,
  getInvoiceSummary,
  getInvoiceById,
  bulkDeleteInvoices,
  getRevenue,
  getPlan,
};
