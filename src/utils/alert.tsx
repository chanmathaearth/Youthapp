import Swal from "sweetalert2";

export const showSuccess = (title: string, text: string) => {
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#10b981",
  });
};

export const showError = (title: string, text: string) => {
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#ef4444",
  });
};

export const showSuccessAuto = (
  title: string,
  text: string,
  timer = 1500
) => {
  Swal.fire({
    icon: "success",
    title,
    text,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    iconColor: "#22c55e",  // green-500
    customClass: {
      popup: "rounded-xl shadow-lg",
      title: "text-lg font-semibold",
      htmlContainer: "text-sm",
    },
  });
};

export const showConfirm = (title: string, html: string) => {
  return Swal.fire({
    icon: "question",
    title,
    html,
    confirmButtonText: "ตรวจสอบแล้ว",
    cancelButtonText: "ยังไม่ได้ตรวจสอบ",
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#9ca3af",
    iconColor: "#3b82f6",

  });
};

