import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportInvoicesToPdf = (invoices) => {
  const doc = new jsPDF();

  doc.text("Invoice Report ", 14, 15);

  autoTable(doc, {
    startY: 20,
    head: [["Invoice No", "User", "Amount", "Status", "Created"]],

    body: invoices.map((inv) => [
      inv.invoiceNumber,
      inv.userId?.email || "-",
      `PKR ${inv.totalAmount}`,
      inv.status,
      new Date(inv.createdAt).toLocaleDateString(),
    ]),
  });
  doc.save("Invoices.pdf");
};
