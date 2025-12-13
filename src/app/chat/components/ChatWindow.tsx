// src/app/chat/components/ChatWindow.tsx - FIXED VERSION

"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore, Conversation } from "@/store/chat.store";
import { getMessages, uploadFile, markAsRead } from "@/services/chat/chat.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Loader2,
} from "lucide-react";
import MessageBubble from "./MessageBubble";
import { useAuth } from "@/store/auth.store";
import { toast } from "@/hook/useToast";
import QuizInviteButtonChat from "./QuizInviteButtonChat";

interface ChatWindowProps {
  conversation: Conversation;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const { user } = useAuth();
  const {
    messages,
    typingUsers,
    onlineUsers,
    setMessages,
    addMessage,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    reactToMessage,
    deleteMessageSocket,
    unmatchUser,
    blockUser,
  } = useChatStore();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationMessages = messages[conversation._id] || [];
  const isPartnerOnline = onlineUsers.has(conversation.partner._id);
  const typingStatus = typingUsers[conversation._id];

  // Load messages on mount
  useEffect(() => {
    loadMessages();
    joinConversation(conversation._id);

    // Mark as read when entering conversation
    handleMarkAsRead();

    return () => {
      leaveConversation(conversation._id);
    };
  }, [conversation._id]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages.length]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await getMessages(conversation._id);

      // ===== FIX: Correctly set isMine based on current user =====
      const processedMessages = data.messages.map((msg: any) => ({
        ...msg,
        isMine: msg.sender._id === user?._id, // ← CRITICAL FIX
        reactions: msg.reactions || [],
      }));

      setMessages(conversation._id, processedMessages);
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMarkAsRead = async () => {
    try {
      await markAsRead(conversation._id);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    sendMessage({
      conversationId: conversation._id,
      type: "text",
      content: inputValue.trim(),
    });

    setInputValue("");
    stopTyping(conversation._id);
    inputRef.current?.focus();
  };

  const handleTyping = (value: string) => {
    setInputValue(value);

    if (!typingTimeoutRef.current) {
      startTyping(conversation._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(conversation._id);
      typingTimeoutRef.current = null;
    }, 3000);
  };

  const handleFileUpload = async (file: File, type: "image" | "file") => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const uploadData = await uploadFile(file);

      sendMessage({
        conversationId: conversation._id,
        type: type,
        fileUrl: uploadData.fileUrl,
        fileName: uploadData.fileName,
        fileSize: uploadData.fileSize,
      });

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      handleFileUpload(file, "image");
    }
    e.target.value = "";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, "file");
    }
    e.target.value = "";
  };

  const handleUnmatch = async () => {
    if (
      confirm(
        `Are you sure you want to unmatch with ${conversation.partner.name}?`,
      )
    ) {
      try {
        await unmatchUser(conversation._id);
        toast({
          title: "Unmatched",
          description: `You have unmatched with ${conversation.partner.name}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to unmatch",
          variant: "destructive",
        });
      }
    }
  };

  const handleBlock = async () => {
    if (
      confirm(`Are you sure you want to block ${conversation.partner.name}?`)
    ) {
      try {
        await blockUser(conversation._id, conversation.partner._id);
        toast({
          title: "Blocked",
          description: `You have blocked ${conversation.partner.name}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to block user",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full flex flex-col h-[100vh] justify-between bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={conversation?.partner?.photos[0]}
                alt={conversation?.partner?.name}
              />
              <AvatarFallback>
                {conversation?.partner?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isPartnerOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>

          <div>
            <h2 className="font-semibold text-lg">
              {conversation.partner.name}
            </h2>
            <p className="text-xs text-gray-500">
              {isPartnerOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Video size={20} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleUnmatch}
                className="text-orange-600"
              >
                Unmatch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlock} className="text-red-600">
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages - Messenger Style */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
              </div>
            ) : conversationMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
                <p>No messages yet</p>
                <p className="text-sm mt-2">
                  Say hi to start the conversation! 👋
                </p>
              </div>
            ) : (
              <>
                {conversationMessages.map((message, index) => {
                  // Check if we need to show avatar (first message or different sender from previous)
                  const showAvatar =
                    index === 0 ||
                    conversationMessages[index - 1].sender._id !==
                      message.sender._id;

                  return (
                    <MessageBubble
                      key={message._id}
                      message={message}
                      showAvatar={showAvatar}
                      onReact={(emoji) => reactToMessage(message._id, emoji)}
                      onDelete={() => deleteMessageSocket(message._id)}
                    />
                  );
                })}

                {/* Typing indicator */}
                {typingStatus?.isTyping && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={conversation.partner.photos[0]} />
                    </Avatar>
                    <div className="flex gap-1 bg-gray-200 rounded-full px-3 py-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        {uploading && (
          <div className="mb-2 text-sm text-gray-600 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading file...
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleImageSelect}
              disabled={uploading}
            />
            <Button variant="ghost" size="icon" disabled={uploading} asChild>
              <div>
                <ImageIcon size={20} />
              </div>
            </Button>
          </label>

          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <Button variant="ghost" size="icon" disabled={uploading} asChild>
              <div>
                <Paperclip size={20} />
              </div>
            </Button>
          </label>

          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-full"
            disabled={uploading}
          />

          <QuizInviteButtonChat
            conversationId={conversation._id}
            matchId={conversation.matchId}
          />

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || uploading}
            className="bg-rose-500 hover:bg-rose-600 rounded-full"
            size="icon"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
