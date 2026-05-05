export type SurveyAnswers = {
  state?: string;
  respondent_type?: "student" | "professional" | "business_owner";
  university?: string;
  industry?: string;
  company_size?: string;
  uses_ai?: string;
  ai_tools?: string[];
  employer_training?: string;
  hours_saved?: string;
  career_impact?: string;
};

export type StepKey = keyof SurveyAnswers;

export type SurveySubmission = Required<Pick<SurveyAnswers, "state">> &
  Omit<SurveyAnswers, "state"> & {
    completion_time_seconds: number;
    user_agent: string;
    referrer: string;
  };

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  label: string;
  type: "dropdown" | "radio" | "multiselect";
  options: QuestionOption[];
}

const ALL_QUESTIONS: Record<StepKey, Question> = {
  state: {
    label: "State",
    type: "dropdown",
    options: [
      { value: "Kuala Lumpur", label: "Kuala Lumpur" },
      { value: "Selangor", label: "Selangor" },
      { value: "Penang", label: "Penang" },
      { value: "Johor", label: "Johor" },
      { value: "Sabah", label: "Sabah" },
      { value: "Sarawak", label: "Sarawak" },
      { value: "Perak", label: "Perak" },
      { value: "Kedah", label: "Kedah" },
      { value: "Kelantan", label: "Kelantan" },
      { value: "Terengganu", label: "Terengganu" },
      { value: "Pahang", label: "Pahang" },
      { value: "Negeri Sembilan", label: "Negeri Sembilan" },
      { value: "Melaka", label: "Melaka" },
      { value: "Perlis", label: "Perlis" },
      { value: "Putrajaya", label: "Putrajaya" },
      { value: "Labuan", label: "Labuan" },
      { value: "Other", label: "Other" },
    ],
  },
  respondent_type: {
    label: "I am currently a...",
    type: "radio",
    options: [
      { value: "student", label: "Student" },
      { value: "professional", label: "Working Professional" },
      { value: "business_owner", label: "Business Owner / Freelancer" },
    ],
  },
  university: {
    label: "University / College",
    type: "dropdown",
    options: [
      { value: "UM", label: "UM" },
      { value: "UTM", label: "UTM" },
      { value: "UPM", label: "UPM" },
      { value: "UTAR", label: "UTAR" },
      { value: "MMU", label: "MMU" },
      { value: "APU", label: "APU" },
      { value: "TARUMT", label: "TARUMT" },
      { value: "Sunway", label: "Sunway" },
      { value: "Taylors", label: "Taylor's" },
      { value: "INTI", label: "INTI" },
      { value: "Monash Malaysia", label: "Monash Malaysia" },
      { value: "Other Public University", label: "Other Public University" },
      { value: "Other Private University", label: "Other Private University" },
    ],
  },
  industry: {
    label: "Industry",
    type: "dropdown",
    options: [
      { value: "Technology", label: "Technology" },
      { value: "Finance & Banking", label: "Finance & Banking" },
      { value: "Education", label: "Education" },
      { value: "Healthcare", label: "Healthcare" },
      { value: "Retail & E-commerce", label: "Retail & E-commerce" },
      { value: "Manufacturing", label: "Manufacturing" },
      { value: "Marketing & Media", label: "Marketing & Media" },
      { value: "Property & Construction", label: "Property & Construction" },
      { value: "F&B", label: "F&B" },
      {
        value: "Government / Public Sector",
        label: "Government / Public Sector",
      },
      { value: "Other", label: "Other" },
    ],
  },
  company_size: {
    label: "Company size",
    type: "radio",
    options: [
      { value: "Just me", label: "Just me" },
      { value: "2–10", label: "2–10" },
      { value: "11–50", label: "11–50" },
      { value: "51–200", label: "51–200" },
      { value: "200+", label: "200+" },
    ],
  },
  uses_ai: {
    label: "Do you currently use AI tools?",
    type: "radio",
    options: [
      { value: "regularly", label: "Yes, regularly" },
      { value: "occasionally", label: "Yes, occasionally" },
      { value: "tried", label: "Tried it once or twice" },
      { value: "never", label: "Never used AI" },
    ],
  },
  ai_tools: {
    label: "Which AI tools have you used?",
    type: "multiselect",
    options: [
      { value: "Claude", label: "Claude" },
      { value: "ChatGPT", label: "ChatGPT" },
      { value: "Gemini", label: "Gemini" },
      { value: "Copilot", label: "Copilot" },
      { value: "Perplexity", label: "Perplexity" },
      { value: "Other", label: "Other" },
      { value: "None", label: "None" },
    ],
  },
  employer_training: {
    label: "Does your employer / university provide AI training?",
    type: "radio",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "I'm not sure" },
    ],
  },
  hours_saved: {
    label: "Hours saved per week",
    type: "radio",
    options: [
      { value: "none", label: "I don't use AI yet" },
      { value: "less_than_1", label: "Less than 1 hour" },
      { value: "1_to_3", label: "1–3 hours" },
      { value: "3_to_5", label: "3–5 hours" },
      { value: "5_to_10", label: "5–10 hours" },
      { value: "10_plus", label: "10+ hours" },
    ],
  },
  career_impact: {
    label: "AI career impact belief",
    type: "radio",
    options: [
      { value: "definitely", label: "Yes, definitely" },
      { value: "probably_yes", label: "Probably yes" },
      { value: "not_sure", label: "Not sure" },
      { value: "probably_not", label: "Probably not" },
      { value: "no", label: "No" },
    ],
  },
};

export const QUESTIONS = ALL_QUESTIONS;

export function getVisibleSteps(answers: SurveyAnswers): StepKey[] {
  const steps: StepKey[] = [];

  steps.push("state");
  steps.push("respondent_type");

  if (answers.respondent_type === "student") {
    steps.push("university");
  } else if (
    answers.respondent_type === "professional" ||
    answers.respondent_type === "business_owner"
  ) {
    steps.push("industry");
  }

  if (answers.respondent_type !== "student") {
    steps.push("company_size");
  }

  steps.push("uses_ai");

  if (answers.uses_ai && answers.uses_ai !== "never") {
    steps.push("ai_tools");
  }

  if (
    answers.respondent_type === "student" ||
    answers.respondent_type === "professional"
  ) {
    steps.push("employer_training");
  } else if (answers.respondent_type === "business_owner") {
    steps.push("employer_training");
  }

  steps.push("hours_saved");
  steps.push("career_impact");

  return steps;
}

export function getStepQuestion(
  step: StepKey,
  answers: SurveyAnswers
): Question {
  const baseQuestion = ALL_QUESTIONS[step];

  if (step === "employer_training" && answers.respondent_type) {
    if (answers.respondent_type === "business_owner") {
      return {
        label: "Do you use AI in your business?",
        type: baseQuestion.type,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      };
    }

    return {
      label: "Does your employer / university provide AI training?",
      type: baseQuestion.type,
      options: baseQuestion.options,
    };
  }

  return baseQuestion;
}
