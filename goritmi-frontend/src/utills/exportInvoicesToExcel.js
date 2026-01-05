import * as XLSX from "xlsx";

export const exportInvoicesToExcel = (invoices) => {
  // data
  const data = invoices.map((inv) => ({
    "Invoice No": inv.invoiceNumber,
    User: inv.userId?.email || "-",
    Amount: `PKR ${inv.totalAmount}`,
    Status: inv.status,
    Created: new Date(inv.createdAt).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  // ✅ Column widths
  worksheet["!cols"] = [
    { wch: 15 }, // Invoice No
    { wch: 30 }, // User
    { wch: 15 }, // Amount
    { wch: 15 }, // Status
    { wch: 18 }, // Created
  ];
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
  XLSX.writeFile(workbook, "invoices.xlsx");
};
