/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal from "sweetalert2";

export function validateForm<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): boolean {
  const complete = requiredFields.every((field) => {
    const value = data[field];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  });

  if (!complete) {
    Swal.fire({
      icon: "warning",
      title: "กรอกไม่ครบถ้วน",
      text: "กรุณากรอกข้อมูลให้ครบก่อนบันทึก",
      confirmButtonColor: "#f59e0b",
    });
    return false;
  }

  return true;
}
