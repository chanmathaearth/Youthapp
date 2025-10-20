import wfaData from "../data/wfa.json";
import hfaData from "../data/hfa.json";
import wfhData from "../data/wfh.json";

type Gender = "male" | "female";

interface GrowthInput {
  gender: Gender;
  ageMonth: number;
  weight: number;
  height: number;
}

type GrowthRef = Record<string, Record<string, [number, number]>>;
type GrowthData = Record<Gender, GrowthRef>;

const wfa = wfaData as GrowthData;
const hfa = hfaData as GrowthData;
const wfh = wfhData as GrowthData;

export const evaluateGrowth = ({ gender, ageMonth, weight, height }: GrowthInput) => {
  const wfaGenderData = wfa[gender];
  const hfaGenderData = hfa[gender];
  const wfhGenderData = wfh[gender];

  let weightResult = "ไม่พบข้อมูล";
  let heightResult = "ไม่พบข้อมูล";
  let weightHeightResult = "ไม่พบข้อมูล";

  // ✅ น้ำหนักตามอายุ
  const wfaRow = wfaGenderData?.[String(ageMonth)];
  if (wfaRow) {
    for (const [label, [min, max]] of Object.entries(wfaRow)) {
      if (weight >= min && weight <= max) {
        weightResult = label;
        break;
      }
    }
  }

  // ✅ ส่วนสูงตามอายุ
  const hfaRow = hfaGenderData?.[String(ageMonth)];
  if (hfaRow) {
    for (const [label, [min, max]] of Object.entries(hfaRow)) {
      if (height >= min && height <= max) {
        heightResult = label;
        break;
      }
    }
  }

  // ✅ น้ำหนักตามส่วนสูง
  if (wfhGenderData) {
    const heightKeys = Object.keys(wfhGenderData).map(parseFloat).sort((a, b) => a - b);
    const closestHeight = heightKeys.reduce((prev, curr) =>
      Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
    );
    const roundedKey = closestHeight.toFixed(1);

    const row = wfhGenderData[roundedKey];

    if (row) {
      for (const [label, [min, max]] of Object.entries(row)) {
        if (weight >= min && weight <= max) {
          weightHeightResult = label;
          break;
        }
      }
    }
  }

  return {
    weightResult,
    heightResult,
    weightHeightResult,
  };
};
