// src/services/quiz/quiz.api.ts
import userService from "../config";

// Create quiz session (invite partner)
export const createQuizSession = async (matchId: string) => {
  const { data } = await userService.post("/quiz/sessions", { matchId });
  return data;
};

// Accept quiz invitation
export const acceptQuiz = async (sessionId: string) => {
  const { data } = await userService.post(`/quiz/sessions/${sessionId}/accept`);
  return data;
};

// Get quiz session with questions
export const getQuizSession = async (sessionId: string) => {
  const { data } = await userService.get(`/quiz/sessions/${sessionId}`);
  return data;
};

// Submit quiz answers
export const submitQuizAnswers = async (
  sessionId: string,
  answers: Array<{ questionId: string; selectedOption: string }>,
) => {
  const { data } = await userService.post(
    `/quiz/sessions/${sessionId}/submit`,
    { answers },
  );
  return data;
};

// Get quiz result
export const getQuizResult = async (sessionId: string) => {
  const { data } = await userService.get(`/quiz/sessions/${sessionId}/result`);
  return data;
};

// Get quiz history
export const getQuizHistory = async () => {
  const { data } = await userService.get("/quiz/my-history");
  return data;
};
