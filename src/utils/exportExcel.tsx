/* eslint-disable @typescript-eslint/no-explicit-any */

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * ฟังก์ชันสำหรับ export ข้อมูล JSON เป็นไฟล์ Excel (.xlsx)
 * @param data ข้อมูล Array ของ Object เช่น [{ name: "A", age: 20 }]
 * @param fileName ชื่อไฟล์ (ค่าเริ่มต้น: "data.xlsx")
 */
export const exportToExcel = (data: any[], fileName = "data.xlsx") => {
  if (!data || data.length === 0) {
    console.warn("❗ ไม่มีข้อมูลสำหรับ export");
    return;
  }

  try {
    // ✅ 1. แปลง JSON → Sheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // ✅ 2. สร้าง Workbook ใหม่
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // ✅ 3. แปลง workbook เป็น binary buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // ✅ 4. สร้าง Blob ให้ browser ดาวน์โหลด
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // ✅ 5. บันทึกไฟล์
    saveAs(blob, fileName);

    console.log(`✅ Export สำเร็จ: ${fileName}`);
  } catch (error) {
    console.error("❌ Export Excel ผิดพลาด:", error);
  }
};
