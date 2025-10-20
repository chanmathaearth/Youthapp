import { differenceInYears, differenceInMonths, parseISO } from "date-fns";

export const dobFormat = (dob: string | Date): string => {
  if (!dob) return "-";

  const birthDate = typeof dob === "string" ? parseISO(dob) : dob;
  const now = new Date();

  const years = differenceInYears(now, birthDate);
  const months = differenceInMonths(now, birthDate) % 12;

  if (years === 0 && months === 0) return "น้อยกว่า 1 เดือน";
  if (years === 0) return `${months} เดือน`;
  if (months === 0) return `${years} ปี`;
  return `${years} ปี ${months} เดือน`;
};