"use client";

import { useState, useEffect, useRef } from "react";
import { useAnonymousChatStore } from "@/store/anonymous-chat.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft, MoreVertical, User, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MobileChatRoom() {
  const {
    currentRoom,
    messages,
    isPartnerTyping,
    isPartnerDisconnected,
    sendMessage,
    leaveRoom,
    startTyping,
    stopTyping,
  } = useAnonymousChatStore();

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      startTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping();
    }, 1000);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputValue.trim()) return;

    sendMessage(inputValue);
    setInputValue("");

    if (isTyping) {
      setIsTyping(false);
      stopTyping();
    }
  };

  const handleLeave = () => {
    if (confirm("Leave this chat?")) {
      leaveRoom();
    }
  };

  if (!currentRoom) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={handleLeave}
            className="p-2 hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <Avatar className="w-9 h-9 bg-white/20 flex-shrink-0">
            <AvatarFallback className="bg-white/20 text-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">
              {currentRoom.partnerAnonymousName}
            </h3>
            <p className="text-xs text-purple-100 truncate">
              {isPartnerDisconnected
                ? "Disconnected..."
                : isPartnerTyping
                  ? "typing..."
                  : "Online"}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <span className="text-xs text-gray-500">
                You: {currentRoom.yourAnonymousName}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLeave} className="text-red-600">
              Leave Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Warning Banner */}
      {isPartnerDisconnected && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <p className="text-xs text-yellow-800">
            Partner disconnected. Waiting...
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <User className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">
                Say hi to {currentRoom.partnerAnonymousName}!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message._id || index}
                  message={message}
                  isMine={message.isMine}
                />
              ))}

              {isPartnerTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end gap-2"
                >
                  <Avatar className="w-7 h-7 bg-gray-200">
                    <AvatarFallback>
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white rounded-2xl px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Message..."
            className="flex-1 rounded-full text-sm"
            maxLength={500}
            disabled={isPartnerDisconnected}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex-shrink-0"
            disabled={!inputValue.trim() || isPartnerDisconnected}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message, isMine }: { message: any; isMine: boolean }) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center">
        <div className="bg-white text-gray-600 text-xs px-3 py-1.5 rounded-full shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isMine ? "justify-end" : ""}`}
    >
      {!isMine && (
        <Avatar className="w-7 h-7 bg-gray-200 flex-shrink-0">
          <AvatarFallback>
            <User className="w-3 h-3" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
          isMine
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
        }`}
      >
        <p className="break-words">{message.content}</p>
        <p
          className={`text-xs mt-0.5 ${isMine ? "text-purple-100" : "text-gray-500"}`}
        >
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          }).replace("about ", "")}
        </p>
      </div>
    </motion.div>
  );
}
