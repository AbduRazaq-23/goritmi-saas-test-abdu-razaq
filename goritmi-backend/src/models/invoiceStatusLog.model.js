import mongoose from "mongoose";

const invoiceStatusLogSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true,
    },
    fromStatus: {
      type: String,
      enum: ["DUE", "PAID", "CANCELLED"],
      required: true,
    },
    toStatus: {
      type: String,
      enum: ["DUE", "PAID", "CANCELLED"],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //admin
      required: true,
    },
    note: {
      type: String,
      default: null,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

const InvoiceStatusLog = mongoose.model(
  "InvoiceStatusLog ",
  invoiceStatusLogSchema
);

export default InvoiceStatusLog;
