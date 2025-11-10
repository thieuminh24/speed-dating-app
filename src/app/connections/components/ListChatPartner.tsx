// components/ListChatPartner.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  isGif?: boolean;
  timestamp: Date;
  unread?: number;
}

const mockChats: ChatItem[] = [
  {
    id: "1",
    name: "Dili",
    avatar: "https://i.pravatar.cc/100?img=3",
    lastMessage: "You sent a GIF",
    isGif: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unread: 1,
  },
  {
    id: "2",
    name: "Minh",
    avatar: "https://i.pravatar.cc/100?img=1",
    lastMessage: "Hey, are we still on for tonight?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: 0,
  },
];

export default function ListChatPartner() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <ChevronLeft
          className="w-6 h-6 cursor-pointer"
          onClick={() => router.back()}
        />
        <h2 className="text-lg font-semibold">Conversations (Recent)</h2>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-1">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition w-full"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.unread ? (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white font-medium">
                    {chat.unread}
                  </span>
                ) : null}
              </div>

              {/* Info sát avatar */}
              <div className="flex flex-col min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate text-base">
                  {chat.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {chat.isGif ? (
                    <span className="italic">You sent a GIF</span>
                  ) : (
                    chat.lastMessage
                  )}
                </p>
              </div>

              {/* Thời gian */}
              <p className="text-xs text-gray-400 whitespace-nowrap ml-auto">
                {formatDistanceToNow(chat.timestamp, { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
