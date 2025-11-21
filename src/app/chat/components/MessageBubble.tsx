// src/app/chat/components/MessageBubble.tsx (Fixed)
"use client";

import { Message } from "@/store/chat.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Smile, Trash2 } from "lucide-react";
import { useState } from "react";

interface MessageBubbleProps {
  message: Message;
  onReact: (emoji: string) => void;
  onDelete: () => void;
}

const EMOJIS = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

export default function MessageBubble({
  message,
  onReact,
  onDelete,
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div
      className={`flex gap-2 mb-4 ${message.isMine ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      {/* Avatar (for other user) */}
      {!message.isMine && (
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={message.sender.photos[0]}
            alt={message.sender.name}
          />
          <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`flex flex-col ${message.isMine ? "items-end" : "items-start"}`}
      >
        {/* Message bubble */}
        <div
          className={`
            relative max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
            ${
              message.isMine
                ? "bg-rose-500 text-white rounded-br-none"
                : "bg-gray-100 text-gray-900 rounded-bl-none"
            }
          `}
        >
          {/* Text message */}
          {message.type === "text" && (
            <p className="text-sm break-words">{message.content}</p>
          )}

          {/* Image message */}
          {message.type === "image" && message.fileUrl && (
            <div className="relative w-64 h-64 rounded-lg overflow-hidden">
              <img
                src={message.fileUrl}
                alt="Shared image"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* File message */}
          {message.type === "file" && message.fileUrl && (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm underline"
            >
              📎 {message.fileName || "Download file"}
            </a>
          )}

          {/* Quiz Invite message */}
          {message.type === "quiz_invite" && (message as any).quizSessionId && (
            <div className="space-y-2">
              <p className="text-sm">{message.content}</p>
              <a
                href={`/quiz/${(message as any).quizSessionId}`}
                className="inline-block mt-2 px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                🧠 Take Quiz
              </a>
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="absolute -bottom-2 right-2 flex gap-1">
              {message.reactions.map((reaction, idx) => (
                <span
                  key={`${reaction.userId}-${idx}`}
                  className="bg-white rounded-full px-2 py-0.5 text-xs shadow-md border"
                  title={reaction.userName}
                >
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp, read status & actions */}
        <div className="flex items-center gap-2 mt-1 px-2">
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </span>

          {/* Read status for sent messages */}
          {message.isMine && message.readStatus && (
            <span className="text-xs text-gray-500">
              {message.readStatus === "read" && "✓✓"}
              {message.readStatus === "delivered" && "✓"}
              {message.readStatus === "sent" && "✓"}
            </span>
          )}

          {showActions && (
            <div className="flex gap-1 relative">
              {/* React button */}
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-1 hover:bg-gray-200 rounded-full transition"
                >
                  <Smile size={14} className="text-gray-500" />
                </button>

                {/* Emoji picker popup */}
                {showReactions && (
                  <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border p-2 flex gap-2 z-50">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          onReact(emoji);
                          setShowReactions(false);
                        }}
                        className="text-xl hover:scale-125 transition"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete button (only for own messages) */}
              {message.isMine && (
                <button
                  onClick={onDelete}
                  className="p-1 hover:bg-red-100 rounded-full transition"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Avatar (for current user) */}
      {message.isMine && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={message.sender.photos[0]} alt="You" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
