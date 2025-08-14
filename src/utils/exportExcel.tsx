import * as XLSX from "xlsx";
import { saveAs } from "file-saver"

export const exportToExcel = (data: any[], fileName = "data.xlsx") => {
  const ws = XLSX.utils.json_to_sheet(data); // แปลง JSON -> sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};
