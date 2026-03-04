export interface SubmissionAnswer {
  questionnaire_item: number;
  answer: boolean;
}

export interface SubmittedByDetail {
  id: number;
  first_name: string;
  last_name: string;
}

export interface SummaryByType {
  type_name: string;
  total: number;
  passed: number;
  is_passed: boolean;
  status_display: string;
}

export interface Submission {
  id: number;
  children: number;
  children_nickname?: string;

  questionnaire?: number;

  created_at: string;

  answers?: SubmissionAnswer[];

  total_items?: number;
  passed_items?: number;

  status_display?: string;
  status?: "ผ่าน" | "ไม่ผ่าน";

  round?: number;
  remarks?: string;

  submitted_by?: number;
  submitted_by_detail?: SubmittedByDetail;

  summary_by_type?: SummaryByType[];
}
