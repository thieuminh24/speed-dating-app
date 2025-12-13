// src/services/quiz/quiz.userService.ts
import userService from "../config";

export interface QuizAnswer {
  questionId: string;
  selectedOption: string;
}

export interface CreateQuizSessionDto {
  matchId: string;
  conversationId?: string;
}

export const createQuizSession = async (
  matchId: string,
  conversationId?: string,
) => {
  console.log("API: Creating quiz session", { matchId, conversationId });

  const payload: CreateQuizSessionDto = { matchId };
  if (conversationId) {
    payload.conversationId = conversationId;
  }

  const response = await userService.post("/quiz/sessions", payload);
  console.log("API: Quiz session created", response.data);
  return response.data;
};

export const acceptQuizSession = async (sessionId: string) => {
  console.log("API: Accepting quiz session", sessionId);

  const response = await userService.post(`/quiz/sessions/${sessionId}/accept`);
  console.log("API: Quiz accepted", response.data);
  return response.data;
};

export const getQuizSession = async (sessionId: string) => {
  console.log("API: Getting quiz session", sessionId);

  const response = await userService.get(`/quiz/sessions/${sessionId}`);
  console.log("API: Quiz session retrieved", response.data);
  return response.data;
};

export const submitQuizAnswers = async (
  sessionId: string,
  answers: QuizAnswer[],
) => {
  console.log("API: Submitting quiz answers", {
    sessionId,
    answerCount: answers.length,
  });
  console.log("API: Answers payload:", answers);

  // Validate answers before sending
  if (!answers || answers.length === 0) {
    throw new Error("No answers to submit");
  }

  const invalidAnswers = answers.filter(
    (a) => !a.questionId || !a.selectedOption,
  );
  if (invalidAnswers.length > 0) {
    console.error("Invalid answers:", invalidAnswers);
    throw new Error("Some answers are missing questionId or selectedOption");
  }

  const response = await userService.post(
    `/quiz/sessions/${sessionId}/submit`,
    {
      answers,
    },
  );

  console.log("API: Answers submitted", response.data);
  return response.data;
};

export const getQuizResult = async (sessionId: string) => {
  console.log("API: Getting quiz result", sessionId);

  const response = await userService.get(`/quiz/sessions/${sessionId}/result`);
  console.log("API: Result retrieved", response.data);
  return response.data;
};

export const getUserQuizHistory = async () => {
  console.log("API: Getting user quiz history");

  const response = await userService.get("/quiz/my-history");
  console.log("API: History retrieved", response.data);
  return response.data;
};
