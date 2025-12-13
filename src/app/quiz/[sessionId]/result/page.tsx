// src/app/quiz/[sessionId]/result/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuizResult } from "@/services/quiz/quiz.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  Loader2,
  MessageCircle,
  TrendingUp,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResult();
  }, [sessionId]);

  const loadResult = async () => {
    try {
      const data = await getQuizResult(sessionId);
      setResult(data);

      // Celebration effect if score is high
      if (data.compatibilityScore >= 70) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }, 500);
      }
    } catch (error) {
      console.error("Failed to load result:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Result not found</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Perfect Match! 💕";
    if (score >= 80) return "Excellent Compatibility! 🌟";
    if (score >= 70) return "Great Match! ✨";
    if (score >= 60) return "Good Compatibility! 😊";
    if (score >= 50) return "Some Common Ground! 👍";
    return "Opposites Attract! 🤔";
  };

  const categoryIcons: Record<string, string> = {
    personality: "😊",
    lifestyle: "🏃",
    values: "💎",
    entertainment: "🎬",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <AvatarImage src={result.user1.photos[0]} />
              <AvatarFallback>{result.user1.name[0]}</AvatarFallback>
            </Avatar>

            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Heart className="text-rose-500 fill-rose-500" size={48} />
            </motion.div>

            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <AvatarImage src={result.user2.photos[0]} />
              <AvatarFallback>{result.user2.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Quiz Complete!
          </h1>
          <p className="text-gray-600">Here's how compatible you are...</p>
        </motion.div>

        {/* Compatibility Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-2xl border-0 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-8 text-center">
              <Sparkles className="mx-auto mb-4 text-white" size={48} />
              <div className={`text-7xl font-bold text-white mb-2`}>
                {result.compatibilityScore}%
              </div>
              <p className="text-2xl text-white font-semibold">
                {getScoreMessage(result.compatibilityScore)}
              </p>
            </div>

            <CardContent className="p-8">
              <div className="text-center mb-6">
                <p className="text-lg text-gray-600">
                  You matched on{" "}
                  <span className="font-bold text-rose-500">
                    {result.matchedAnswers} out of {result.totalQuestions}
                  </span>{" "}
                  questions!
                </p>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="mr-2 text-rose-500" size={20} />
                  Category Breakdown
                </h3>

                {Object.entries(result.categoryScores).map(
                  ([category, score]: [string, any]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center capitalize">
                          <span className="mr-2">
                            {categoryIcons[category]}
                          </span>
                          {category}
                        </span>
                        <span className="font-semibold">{score} / 3</span>
                      </div>
                      <Progress value={(score / 3) * 100} className="h-2" />
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-xl border-0 mb-8">
            <CardContent className="p-8">
              <h3 className="font-semibold text-gray-800 mb-6 text-xl">
                Answer Comparison
              </h3>

              <div className="space-y-4">
                {result.detailedComparison.map((item: any, idx: number) => (
                  <div
                    key={item.questionId._id}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${
                        item.matched
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-800 flex-1">
                        {idx + 1}. {item.questionId.question}
                      </p>
                      {item.matched ? (
                        <Check
                          className="text-green-500 flex-shrink-0 ml-2"
                          size={20}
                        />
                      ) : (
                        <X
                          className="text-gray-400 flex-shrink-0 ml-2"
                          size={20}
                        />
                      )}
                    </div>

                    <div className="flex gap-4 text-sm mt-3">
                      <div className="flex-1">
                        <span className="text-gray-500">
                          {result.user1.name}:
                        </span>
                        <span className="ml-2 font-medium">
                          {item.user1Answer.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-500">
                          {result.user2.name}:
                        </span>
                        <span className="ml-2 font-medium">
                          {item.user2Answer.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4"
        >
          <Button
            onClick={() => router.push("/chat")}
            className="px-8 py-6 text-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          >
            <MessageCircle className="mr-2" size={24} />
            Start Chatting
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/app")}
            className="px-8 py-6 text-lg"
          >
            Back to Matches
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
