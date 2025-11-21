// src/app/quiz/[sessionId]/waiting/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuizSession } from "@/services/quiz/quiz.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function QuizWaitingPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkStatus();

    // Poll every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const checkStatus = async () => {
    try {
      const data = await getQuizSession(sessionId);
      setSession(data);

      // If completed, redirect to result
      if (data.status === "completed") {
        router.push(`/quiz/${sessionId}/result`);
      }
    } catch (error) {
      console.error("Failed to check status:", error);
    } finally {
      setChecking(false);
    }
  };

  if (checking && !session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  const partner = session?.initiator || session?.participant;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            {/* Animated Hearts */}
            <div className="mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="inline-block"
              >
                <Heart className="text-rose-500 fill-rose-500" size={64} />
              </motion.div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Waiting for {partner?.name}
            </h1>

            {/* Avatar */}
            {partner && (
              <Avatar className="w-24 h-24 mx-auto mb-6 border-4 border-white shadow-lg">
                <AvatarImage src={partner.photos[0]} />
                <AvatarFallback>{partner.name[0]}</AvatarFallback>
              </Avatar>
            )}

            {/* Message */}
            <p className="text-gray-600 mb-6">
              You've submitted your answers! We're waiting for your match to
              complete the quiz.
            </p>

            {/* Loading Animation */}
            <div className="flex justify-center gap-2 mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    delay: i * 0.2,
                  }}
                  className="w-3 h-3 bg-rose-500 rounded-full"
                />
              ))}
            </div>

            {/* Status */}
            <div className="bg-rose-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>Checking status...</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={checkStatus}
                disabled={checking}
                className="w-full"
              >
                {checking ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Checking...
                  </>
                ) : (
                  "Check Now"
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push("/matches")}
                className="w-full"
              >
                Back to Matches
              </Button>
            </div>

            {/* Tip */}
            <p className="text-xs text-gray-500 mt-6">
              💡 Tip: We'll automatically show the results when both of you have
              completed the quiz!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
