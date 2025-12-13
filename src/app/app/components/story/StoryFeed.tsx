"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/store/auth.store";
import { useStory } from "@/store/story.store";
import { StoryViewer } from "./StoryViewer";
import { StoryGroup } from "@/services/story/story.types";
import { StoryCreator } from "./StoryCreator";

export function StoryFeed() {
  const { user } = useAuth();
  const { myStories, feed, fetchMyStories, fetchFeed } = useStory();
  const [showCreator, setShowCreator] = useState(false);
  const [viewingStories, setViewingStories] = useState<{
    stories: any[];
    index: number;
    isOwner: boolean;
  } | null>(null);

  useEffect(() => {
    fetchMyStories();
    fetchFeed();
  }, []);

  const handleViewMyStories = () => {
    if (myStories.length > 0) {
      setViewingStories({
        stories: myStories,
        index: 0,
        isOwner: true,
      });
    }
  };

  const handleViewUserStories = (group: StoryGroup, index: number = 0) => {
    setViewingStories({
      stories: group.stories,
      index,
      isOwner: false,
    });
  };

  return (
    <>
      <div
        style={{ zIndex: 2000 }}
        className="flex gap-4 overflow-x-auto pb-4 px-4"
      >
        {/* My Story */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <button
            onClick={
              myStories.length > 0
                ? handleViewMyStories
                : () => setShowCreator(true)
            }
            className="relative"
          >
            <div
              className={`w-20 h-20 rounded-full ${
                myStories.length > 0
                  ? "bg-gradient-to-tr from-pink-500 to-purple-500 p-[3px]"
                  : "bg-gray-200"
              }`}
            >
              <div className="w-full h-full rounded-full bg-white p-1">
                <img
                  src={user?.avatar || "https://via.placeholder.com/80"}
                  alt="Your story"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            {myStories.length === 0 && (
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white">
                <Plus className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
          <span className="text-xs font-medium text-center max-w-[80px] truncate">
            {myStories.length > 0 ? "Story của bạn" : "Thêm Story"}
          </span>
        </div>

        {/* Other Users Stories */}
        {feed.map((group) => (
          <div
            key={group.user._id}
            className="flex flex-col items-center gap-2 shrink-0"
          >
            <button
              onClick={() => handleViewUserStories(group)}
              className="relative"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 p-[3px]">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <img
                    src={group.user.avatar || "https://via.placeholder.com/80"}
                    alt={group.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              {group.stories.length > 1 && (
                <div className="absolute top-0 right-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                  {group.stories.length}
                </div>
              )}
            </button>
            <span className="text-xs font-medium text-center max-w-[80px] truncate">
              {group.user.name}
            </span>
          </div>
        ))}
      </div>

      {/* Story Creator */}
      {showCreator && (
        <StoryCreator
          onClose={() => {
            setShowCreator(false);
            fetchMyStories();
            fetchFeed();
          }}
        />
      )}

      {/* Story Viewer */}
      {viewingStories && (
        <StoryViewer
          stories={viewingStories.stories}
          initialIndex={viewingStories.index}
          isOwner={viewingStories.isOwner}
          onClose={() => {
            setViewingStories(null);
            fetchMyStories();
            fetchFeed();
          }}
        />
      )}
    </>
  );
}
