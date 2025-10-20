import Swal from "sweetalert2";

export const confirmDelete = async (text: string) => {
  const result = await Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ใช่, ลบเลย",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
  });

  return result.isConfirmed;
};
