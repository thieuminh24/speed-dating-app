"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, X, Loader2, Crown, Lock } from "lucide-react";
import {
  getLikesReceived,
  likeUser,
  passUser,
} from "@/services/match/match.api";
import { useAuth } from "@/store/auth.store";

interface LikeProfile {
  _id: string;
  name: string;
  age: number;
  photos: string[];
  basic: any;
  aboutMe?: string;
  prompts: any[];
  jobsAndEducation: any;
  distance?: number;
  likedAt: string;
}

export function LikesReceived() {
  const router = useRouter();
  const { user } = useAuth();
  const [likes, setLikes] = useState<LikeProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium =
    user?.isPremium &&
    user?.premiumUntil &&
    new Date(user.premiumUntil) > new Date();

  useEffect(() => {
    if (isPremium) {
      fetchLikes();
    } else {
      setLoading(false);
    }
  }, [isPremium]);

  const fetchLikes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLikesReceived();
      setLikes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (actionLoading || likes.length === 0) return;

    const current = likes[currentIndex];
    setActionLoading(true);

    try {
      const response = await likeUser(current._id);

      // Check if it's a match
      if (response.message === "It's a match!") {
        alert(`🎉 Match với ${current.name}!`);
      }

      // Remove from list and move to next
      const newLikes = likes.filter((_, i) => i !== currentIndex);
      setLikes(newLikes);

      if (currentIndex >= newLikes.length && newLikes.length > 0) {
        setCurrentIndex(newLikes.length - 1);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePass = async () => {
    if (actionLoading || likes.length === 0) return;

    const current = likes[currentIndex];
    setActionLoading(true);

    try {
      await passUser(current._id);

      // Remove from list and move to next
      const newLikes = likes.filter((_, i) => i !== currentIndex);
      setLikes(newLikes);

      if (currentIndex >= newLikes.length && newLikes.length > 0) {
        setCurrentIndex(newLikes.length - 1);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setActionLoading(false);
    }
  };

  // Non-Premium View
  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-3xl opacity-30 absolute inset-0"></div>
          <div className="relative bg-white p-8 rounded-full shadow-2xl">
            <Lock className="w-16 h-16 text-pink-500" />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-3 text-center">
          Xem ai đã thích bạn
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-md">
          Nâng cấp lên Premium để xem những người đã thích bạn và tăng cơ hội
          match!
        </p>

        {/* Blurred profiles preview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative">
              <div className="w-32 h-40 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl blur-sm"></div>
              <Heart className="absolute inset-0 m-auto w-8 h-8 text-pink-500" />
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/payment")}
          className="px-8 py-4 rounded-full font-bold text-white text-lg
            bg-gradient-to-r from-pink-500 to-purple-500
            hover:from-pink-600 hover:to-purple-600
            shadow-lg hover:shadow-xl transform hover:scale-105 transition-all
            flex items-center gap-2"
        >
          <Crown className="w-6 h-6" />
          Nâng cấp Premium
        </button>

        <p className="text-sm text-gray-500 mt-4">Chỉ từ 99.000đ/tháng</p>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchLikes}
          className="px-6 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // No likes
  if (likes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Heart className="w-24 h-24 text-gray-300 mb-4" />
        <h3 className="text-2xl font-bold mb-2">Chưa có ai thích bạn</h3>
        <p className="text-gray-600 text-center">
          Hãy tiếp tục khám phá để tìm người phù hợp!
        </p>
        <button
          onClick={() => router.push("/app")}
          className="mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold"
        >
          Khám phá ngay
        </button>
      </div>
    );
  }

  const currentProfile = likes[currentIndex];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            Người đã thích bạn
          </h2>
          <p className="text-sm text-gray-600">{likes.length} người</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {currentIndex + 1} / {likes.length}
        </div>
      </div>

      {/* Profile Card */}
      <div className="flex-1 overflow-y-auto p-6">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardContent className="p-0">
            {/* Photo */}
            <div className="relative h-96 rounded-t-xl overflow-hidden">
              <img
                src={
                  currentProfile.photos[0] || "https://via.placeholder.com/400"
                }
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-3xl font-bold text-white mb-1">
                  {currentProfile.name}, {currentProfile.age}
                </h3>
                {currentProfile.distance && (
                  <p className="text-white/90 text-sm">
                    📍 Cách bạn {currentProfile.distance}km
                  </p>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-6 space-y-4">
              {currentProfile.aboutMe && (
                <div>
                  <h4 className="font-semibold mb-2 text-gray-700">
                    Giới thiệu
                  </h4>
                  <p className="text-gray-600">{currentProfile.aboutMe}</p>
                </div>
              )}

              {currentProfile.prompts && currentProfile.prompts.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Prompts</h4>
                  <div className="space-y-3">
                    {currentProfile.prompts.map((prompt, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-100"
                      >
                        <p className="text-sm text-gray-600 mb-1 font-medium">
                          {prompt.prompt}
                        </p>
                        <p className="text-gray-800">{prompt.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentProfile.jobsAndEducation && (
                <div className="space-y-3">
                  {currentProfile.jobsAndEducation.jobs?.map(
                    (job: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <span>💼</span>
                        <span>
                          {job.title} tại {job.company}
                        </span>
                      </div>
                    ),
                  )}
                  {currentProfile.jobsAndEducation.education?.map(
                    (edu: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <span>🎓</span>
                        <span>{edu.institution}</span>
                      </div>
                    ),
                  )}
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                  💕 Đã thích bạn lúc{" "}
                  {new Date(currentProfile.likedAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="p-6 border-t bg-white">
        <div className="max-w-2xl mx-auto flex justify-center gap-6">
          <button
            onClick={handlePass}
            disabled={actionLoading}
            className="w-16 h-16 rounded-full bg-white border-2 border-red-500
              hover:bg-red-50 flex items-center justify-center transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-110 shadow-lg"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>

          <button
            onClick={handleLike}
            disabled={actionLoading}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500
              hover:from-pink-600 hover:to-purple-600
              flex items-center justify-center transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-110 shadow-2xl"
          >
            {actionLoading ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : (
              <Heart className="w-10 h-10 text-white fill-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
