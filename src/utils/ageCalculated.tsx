import { differenceInMonths, parseISO } from "date-fns";

export const calculateAgeInMonths = (dob: string | Date): number => {
  if (!dob) return 0;

  const birthDate = typeof dob === "string" ? parseISO(dob) : dob;
  const now = new Date();

  const totalMonths = differenceInMonths(now, birthDate);

  // ป้องกันค่าติดลบกรณี dob ไม่ถูกต้อง
  return totalMonths >= 0 ? totalMonths : 0;
};