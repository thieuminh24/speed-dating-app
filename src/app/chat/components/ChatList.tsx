// src/app/chat/components/ChatList.tsx - FIXED VERSION

"use client";

import { useChatStore, Conversation } from "@/store/chat.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";

interface ChatListProps {
  onSelectConversation: (conversation: Conversation) => void; // ← Remove optional
}

export default function ChatList({
  onSelectConversation = () => {},
}: ChatListProps) {
  const { conversations, activeConversation, onlineUsers } = useChatStore();

  const sortedConversations = [...conversations].sort((a, b) => {
    const dateA = new Date(a.lastMessageAt || 0).getTime();
    const dateB = new Date(b.lastMessageAt || 0).getTime();
    return dateB - dateA;
  });

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
        <MessageCircle size={48} className="mb-4 opacity-50" />
        <p className="text-sm">No conversations yet</p>
        <p className="text-xs mt-2">Start matching to begin chatting!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {sortedConversations.map((conversation) => {
          const isActive = activeConversation?._id === conversation._id;
          const isOnline = onlineUsers.has(conversation.partner._id);

          return (
            <div
              key={conversation._id}
              onClick={() => onSelectConversation(conversation)}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer
                transition-all duration-200
                ${isActive ? "bg-rose-50 border-2 border-rose-200" : "hover:bg-gray-50 border-2 border-transparent"}
              `}
            >
              {/* Avatar with online indicator */}
              <div className="relative flex-shrink-0">
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={conversation.partner.photos[0]}
                    alt={conversation.partner.name}
                  />
                  <AvatarFallback>
                    {conversation?.partner?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm truncate">
                    {conversation.partner.name}
                  </h3>
                  {conversation.lastMessageAt && (
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatDistanceToNow(
                        new Date(conversation.lastMessageAt),
                        {
                          addSuffix: true,
                        },
                      )}
                    </span>
                  )}
                </div>

                <div className="flex">
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage?.isMine && "You: "}
                    {conversation.lastMessage?.content || "No messages yet"}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-2 rounded-full h-5 min-w-[20px] flex items-center justify-center flex-shrink-0"
                    >
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
