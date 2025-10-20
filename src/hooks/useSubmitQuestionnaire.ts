import { useMutation } from "@tanstack/react-query";
import { postBody } from "../helpers/index";
import { showSuccess, showError } from "../utils/alert";
import type { AxiosError } from "axios";

type DjangoError = {
  detail?: string;
  [key: string]: unknown;
};

export interface QuestionnaireAnswer {
  questionnaire_item: number;
  answer: boolean;
}

export interface QuestionnaireSubmitPayload {
  children: number;
  questionnaire: number;
  answers: QuestionnaireAnswer[];
}

export const useSubmitQuestionnaire = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: async (payload: QuestionnaireSubmitPayload) => {
      return await postBody("development/api/v1/submissions/submit", payload);
    },

    onSuccess: () => {
      showSuccess("ส่งแบบประเมินสำเร็จ", "ระบบบันทึกผลแบบประเมินเรียบร้อยแล้ว");
      onSuccessCallback?.();
    },

    onError: (err: AxiosError<DjangoError>) => {
      const data = err.response?.data;
      let message = "เกิดข้อผิดพลาดจากระบบ";

      if (data?.detail) {
        message = data.detail;
      } else if (typeof data === "object") {
        message = Object.entries(data)
          .map(
            ([field, msgs]) =>
              `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
          )
          .join("\n");
      }

      showError("ส่งแบบประเมินไม่สำเร็จ", message);
    },
  });
};
