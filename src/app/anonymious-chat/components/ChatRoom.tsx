"use client";

import { useState, useEffect, useRef } from "react";
import { useAnonymousChatStore } from "@/store/anonymous-chat.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  LogOut,
  User,
  AlertCircle,
  Loader2,
  WifiOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";

export default function ChatRoom() {
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

  // Auto-scroll to bottom when new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      startTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
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
    if (confirm("Are you sure you want to leave this chat?")) {
      leaveRoom();
    }
  };

  if (!currentRoom) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 bg-white/20">
                <AvatarFallback className="bg-white/20 text-white">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {currentRoom.partnerAnonymousName}
                </h3>
                <p className="text-xs text-purple-100">
                  {isPartnerDisconnected
                    ? "Disconnected..."
                    : isPartnerTyping
                      ? "typing..."
                      : "Online"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full hidden sm:inline">
                You: {currentRoom.yourAnonymousName}
              </span>
              <Button
                onClick={handleLeave}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave
              </Button>
            </div>
          </div>
        </div>

        {/* Partner Disconnected Warning */}
        {isPartnerDisconnected && (
          <div className="p-3 bg-yellow-50 border-b border-yellow-200">
            <Alert className="bg-transparent border-0 p-0">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-sm ml-2">
                Partner disconnected. Waiting for reconnection...
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <User className="w-16 h-16 text-gray-300 mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                  Chat Started!
                </h4>
                <p className="text-sm text-gray-500">
                  Say hi to {currentRoom.partnerAnonymousName}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message._id || index}
                    message={message}
                    yourName={currentRoom.yourAnonymousName}
                  />
                ))}

                {/* Typing Indicator */}
                {isPartnerTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-end gap-2"
                  >
                    <Avatar className="w-8 h-8 bg-gray-200">
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-2xl px-4 py-2 flex items-center gap-1">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-white"
              maxLength={500}
              disabled={isPartnerDisconnected}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={!inputValue.trim() || isPartnerDisconnected}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {inputValue.length}/500 characters
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Message Bubble Component
function MessageBubble({
  message,
  yourName,
}: {
  message: any;
  yourName: string;
}) {
  const isSystem = message.type === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center"
      >
        <div className="bg-gray-100 text-gray-600 text-xs px-4 py-2 rounded-full">
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${message.isMine ? "justify-end" : ""}`}
    >
      {!message.isMine && (
        <Avatar className="w-8 h-8 bg-gray-200">
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          message.isMine
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        {!message.isMine && (
          <p className="text-xs font-semibold mb-1 opacity-70">
            {message.senderAnonymousName}
          </p>
        )}
        <p className="break-words">{message.content}</p>
        <p
          className={`text-xs mt-1 ${message.isMine ? "text-purple-100" : "text-gray-500"}`}
        >
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>

      {message.isMine && (
        <Avatar className="w-8 h-8 bg-purple-600">
          <AvatarFallback className="bg-purple-600 text-white">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}
