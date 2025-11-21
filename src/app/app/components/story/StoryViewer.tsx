"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft, ChevronRight, Trash2, Eye } from "lucide-react";
import { Story, StoryType } from "@/services/story/story.types";
import {
  viewStory,
  deleteStory,
  getStoryViewers,
} from "@/services/story/story.api";
import { useAuth } from "@/store/auth.store";

interface StoryViewerProps {
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
  isOwner?: boolean;
}

export function StoryViewer({
  stories,
  initialIndex = 0,
  onClose,
  isOwner = false,
}: StoryViewerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [viewers, setViewers] = useState<any[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentStory = stories[currentIndex];
  const duration =
    currentStory.type === StoryType.VIDEO
      ? (currentStory.videoDuration || 15) * 1000
      : 5000;

  useEffect(() => {
    if (!currentStory) return;

    // Mark as viewed
    if (!isOwner && user) {
      viewStory(currentStory._id).catch(console.error);
    }

    // Reset progress
    setProgress(0);

    // Start timer
    if (!isPaused) {
      startProgress();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused]);

  const startProgress = () => {
    const interval = 50;
    const increment = (interval / duration) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Xóa story này?")) return;

    try {
      await deleteStory(currentStory._id);
      if (stories.length === 1) {
        onClose();
      } else if (currentIndex === stories.length - 1) {
        setCurrentIndex(currentIndex - 1);
      }
      router.refresh();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleShowViewers = async () => {
    try {
      const data = await getStoryViewers(currentStory._id);
      setViewers(data.viewers);
      setShowViewers(true);
    } catch (error) {
      console.error("Failed to load viewers:", error);
    }
  };

  const getUserInfo = () => {
    if (typeof currentStory.userId === "string") {
      return { name: "Unknown", avatar: "" };
    }
    return {
      name: currentStory.userId.name,
      avatar: currentStory.userId.photos[0] || "",
    };
  };

  const userInfo = getUserInfo();

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all"
              style={{
                width:
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex
                      ? `${progress}%`
                      : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3">
          <img
            src={userInfo.avatar || "https://via.placeholder.com/40"}
            alt={userInfo.name}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-white font-semibold">{userInfo.name}</p>
            <p className="text-white/70 text-sm">
              {new Date(currentStory.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <button
                onClick={handleShowViewers}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <Eye className="w-5 h-5" />
                <span className="text-xs ml-1">{currentStory.viewCount}</span>
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Story Content */}
      <div
        className="relative w-full h-full max-w-lg"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {currentStory.type === StoryType.TEXT ? (
          <div
            className="w-full h-full flex items-center justify-center p-8"
            style={{ background: currentStory.backgroundColor }}
          >
            <p
              style={{
                color: currentStory.textColor,
                fontSize: `${currentStory.fontSize}px`,
                fontFamily: currentStory.fontFamily,
                textAlign: currentStory.textAlign,
                fontWeight: currentStory.textBold ? "bold" : "normal",
                fontStyle: currentStory.textItalic ? "italic" : "normal",
              }}
            >
              {currentStory.text}
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={currentStory.videoUrl}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            onEnded={handleNext}
          />
        )}

        {/* Navigation */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Viewers Modal */}
      {showViewers && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[60vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Người xem ({viewers.length})</h3>
            <button onClick={() => setShowViewers(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {viewers.map((viewer: any) => (
              <div key={viewer._id} className="flex items-center gap-3">
                <img
                  src={viewer.photos?.[0] || "https://via.placeholder.com/40"}
                  alt={viewer.name}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{viewer.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
