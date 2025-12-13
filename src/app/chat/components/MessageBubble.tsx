// src/app/chat/components/MessageBubble.tsx - MESSENGER STYLE

"use client";

import { Message } from "@/store/chat.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Smile, Trash2 } from "lucide-react";
import { useState } from "react";

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  onReact: (emoji: string) => void;
  onDelete: () => void;
}

const EMOJIS = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

export default function MessageBubble({
  message,
  showAvatar = true,
  onReact,
  onDelete,
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div
      className={`flex gap-2 ${message.isMine ? "justify-end" : "justify-start"} ${showAvatar ? "mt-3" : "mt-0.5"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      {/* Avatar (left side for partner, only show if showAvatar) */}
      {!message.isMine && showAvatar && (
        <Avatar className="w-7 h-7 flex-shrink-0">
          <AvatarImage
            src={message.sender.photos[0]}
            alt={message.sender.name}
          />
          <AvatarFallback className="text-xs">
            {message.sender.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Spacer when no avatar */}
      {!message.isMine && !showAvatar && <div className="w-7 flex-shrink-0" />}

      {/* Message content */}
      <div
        className={`flex flex-col ${message.isMine ? "items-end" : "items-start"} max-w-[70%]`}
      >
        {/* Sender name (only for partner messages with avatar) */}
        {!message.isMine && showAvatar && (
          <span className="text-xs text-gray-500 mb-1 px-3">
            {message.sender.name}
          </span>
        )}

        {/* Message bubble */}
        <div
          className={`
            relative px-3 py-2 rounded-2xl break-words
            ${
              message.isMine
                ? "bg-rose-500 text-white"
                : "bg-gray-200 text-gray-900"
            }
            ${!showAvatar ? "mt-0.5" : ""}
          `}
        >
          {/* Text message */}
          {message.type === "text" && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Image message */}
          {message.type === "image" && message.fileUrl && (
            <div className="relative max-w-xs rounded-lg overflow-hidden">
              <img
                src={message.fileUrl}
                alt="Shared image"
                className="w-full h-auto object-cover"
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
          {message.type === "quiz_invite" && message.quizSessionId && (
            <div className="space-y-2 min-w-[200px]">
              <p className="text-sm font-medium">{message.content}</p>
              <a
                href={`/quiz/${message.quizSessionId}`}
                className={`
                  inline-block w-full text-center px-4 py-2 rounded-lg font-semibold transition
                  ${message.isMine ? "bg-white text-rose-500 hover:bg-rose-50" : "bg-rose-500 text-white hover:bg-rose-600"}
                `}
              >
                🧠 Take Quiz
              </a>
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="absolute -bottom-2 left-2 flex gap-0.5 bg-white rounded-full px-2 py-0.5 shadow-md border">
              {message.reactions.slice(0, 3).map((reaction, idx) => (
                <span
                  key={`${reaction.userId}-${idx}`}
                  className="text-xs"
                  title={reaction.userName}
                >
                  {reaction.emoji}
                </span>
              ))}
              {message.reactions.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{message.reactions.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Timestamp and actions */}
        {showActions && (
          <div className="flex items-center gap-2 mt-1 px-2">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
              })}
            </span>

            {/* Actions */}
            <div className="flex gap-1">
              {/* React button */}
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-1 hover:bg-gray-200 rounded-full transition"
                >
                  <Smile size={14} className="text-gray-500" />
                </button>

                {/* Emoji picker */}
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
          </div>
        )}
      </div>
    </div>
  );
}
