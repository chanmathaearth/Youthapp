export interface QuestionnaireAnswer {
  questionnaire_item: number;
  answer: boolean;
}

export interface QuestionnaireSubmitPayload {
  children: number;
  questionnaire: number;
  answers: QuestionnaireAnswer[];
}

export interface QuestionnaireItem {
  id: number;
  title: string;
  type?: {
    name?: string;
    description?: string;
  };
  equipment?: string;
};