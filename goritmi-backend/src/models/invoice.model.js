import mongoose from "mongoose";

// =============================
// INVOICE ITEM SCHEMA
// =============================
const invoiceItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// =============================
// INVOICE SCHEMA
// =============================

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [invoiceItemSchema],
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "PKR",
    },
    status: {
      type: String,
      enum: ["DUE", "PAID", "CANCELLED"],
      default: "DUE",
      index: true,
    },
    receivedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancelReason: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //admin
      required: true,
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ createdAt: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
