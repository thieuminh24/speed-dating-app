// src/app/quiz/[sessionId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuizSession, submitQuizAnswers } from "@/services/quiz/quiz.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  _id: string;
  question: string;
  category: string;
  options: Array<{ text: string; value: string }>;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      console.log("Loading quiz session:", sessionId);
      const data = await getQuizSession(sessionId);
      console.log("Quiz data received:", data);

      setSession(data);

      // Fix: Check if questions exist
      if (data.questions && Array.isArray(data.questions)) {
        console.log("Questions loaded:", data.questions.length);
        setQuestions(data.questions);
      } else {
        console.error("No questions found in session:", data);
      }
    } catch (error: any) {
      console.error("Failed to load quiz:", error);
      console.error("Error details:", error.response?.data);
      alert(
        "Failed to load quiz: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isAnswered = currentQuestion && answers[currentQuestion._id];
  const allAnswered = questions.every((q) => answers[q._id]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = questions.map((q) => ({
        questionId: q._id,
        selectedOption: answers[q._id],
      }));

      const result = await submitQuizAnswers(sessionId, formattedAnswers);

      if (result.status === "completed") {
        router.push(`/quiz/${sessionId}/result`);
      } else {
        router.push(`/quiz/${sessionId}/waiting`);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!session || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Quiz not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
              <AvatarImage src={session.initiator.photos[0]} />
              <AvatarFallback>{session.initiator.name[0]}</AvatarFallback>
            </Avatar>

            <Heart className="text-rose-500 fill-rose-500" size={32} />

            <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
              <AvatarImage src={session.participant.photos[0]} />
              <AvatarFallback>{session.participant.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Compatibility Quiz
          </h1>
          <p className="text-gray-600">
            Answer honestly to find out how compatible you are! 💕
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4">
                <span className="text-white text-sm font-medium uppercase tracking-wide">
                  {currentQuestion.category}
                </span>
              </div>

              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">
                  {currentQuestion.question}
                </h2>

                <RadioGroup
                  value={answers[currentQuestion._id] || ""}
                  onValueChange={(value) =>
                    handleAnswer(currentQuestion._id, value)
                  }
                  className="space-y-4"
                >
                  {currentQuestion?.options?.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Label
                        htmlFor={option.value}
                        className={`
                          flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                          ${
                            answers[currentQuestion._id] === option.value
                              ? "border-rose-500 bg-rose-50 shadow-md"
                              : "border-gray-200 hover:border-rose-300 hover:bg-gray-50"
                          }
                        `}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="mr-4"
                        />
                        <span className="text-lg">{option.text}</span>
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6"
          >
            <ArrowLeft className="mr-2" size={20} />
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="px-8 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                "Submit Quiz"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            >
              Next
              <ArrowRight className="ml-2" size={20} />
            </Button>
          )}
        </div>

        {/* Answered Questions Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {questions.map((q, idx) => (
            <button
              key={q._id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`
                w-3 h-3 rounded-full transition-all
                ${
                  answers[q._id]
                    ? "bg-rose-500 scale-110"
                    : idx === currentQuestionIndex
                      ? "bg-rose-300 scale-125"
                      : "bg-gray-300"
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
