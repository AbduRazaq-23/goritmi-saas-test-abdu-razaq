import Invoice from "../models/invoice.model.js";

// ======================================================
// Utility function to generate invoice number
// Format: INV-YYYY-0001
// ======================================================
const generateInvoiceNo = async () => {
  // Get current year (e.g., 2025)
  const year = new Date().getFullYear();

  // Find the most recent invoice of the current year
  // Regex ensures only invoices starting with "INV-YYYY-" are matched
  const lastInvoice = await Invoice.findOne({
    invoiceNumber: new RegExp(`^INV-${year}-`),
  })
    // Sort by creation date (latest first)
    .sort({ createdAt: -1 });

  // Default invoice sequence number
  // Used when no invoice exists for the current year
  let nextNumber = 1;

  // If an invoice already exists for this year
  if (lastInvoice) {
    // Split invoice number: "INV-2025-0042" → ["INV", "2025", "0042"]
    // Extract the numeric sequence and convert it to a number
    const lastSeq = parseInt(lastInvoice.invoiceNumber.split("-")[2], 10);

    // Increment the sequence for the next invoice
    nextNumber = lastSeq + 1;
  }

  // Convert number to string and pad with zeros to always make 4 digits
  // Example: 43 → "0043"
  return `INV-${year}-${String(nextNumber).padStart(4, "0")}`;
};

// Export the utility so it can be reused in controllers/services
export default generateInvoiceNo;
