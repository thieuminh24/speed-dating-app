// components/ChatBox.tsx
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Smile,
  Image as ImageIcon,
  Gift,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Message {
  id: string;
  text?: string;
  image?: string;
  gif?: string;
  sender: "me" | "other";
  timestamp: Date;
}

const mockMessages: Message[] = [
  { id: "1", text: "Uaaa", sender: "me", timestamp: new Date() },
  { id: "2", text: "Sao lại đồ", sender: "me", timestamp: new Date() },
  {
    id: "3",
    image:
      "https://tte.edu.vn/public/upload/2025/01/gai-xinh-tiktok-viet-nam-nhay-03.webp",
    sender: "me",
    timestamp: new Date(),
  },
  { id: "4", text: "trước là xanh", sender: "other", timestamp: new Date() },
  {
    id: "5",
    text: "Xin chào",
    sender: "other",
    timestamp: new Date(),
  },
  { id: "6", text: "Hello hi", sender: "other", timestamp: new Date() },
  { id: "7", text: "What your name", sender: "other", timestamp: new Date() },
  { id: "8", text: "Ôoo", sender: "me", timestamp: new Date() },
  { id: "9", text: "Mêmmememem", sender: "me", timestamp: new Date() },
  {
    id: "10",
    gif: "https://media.giphy.com/media/3o7TKMt1VVNkHV2Yc/giphy.gif",
    sender: "me",
    timestamp: new Date(),
  },
];

export default function ChatBox() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://tte.edu.vn/public/upload/2025/01/gai-xinh-tiktok-viet-nam-nhay-03.webp" />
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">Dili, 24</p>
            <p className="text-xs text-green-600">Active now</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "me" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-3xl relative ${
                  msg.sender === "me"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.text && <p className="text-sm">{msg.text}</p>}
                {msg.image && (
                  <div className="relative w-48 h-48 rounded-2xl overflow-hidden">
                    {/* <Image
                      src={msg.image}
                      alt="photo"
                      fill
                      className="object-cover"
                    /> */}
                  </div>
                )}
                {msg.gif && (
                  <div className="relative">
                    <div className="relative w-48 h-48 rounded-2xl overflow-hidden">
                      {/* <Image
                        src={msg.gif}
                        alt="GIF"
                        fill
                        className="object-cover"
                      /> */}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      GIPHY
                    </div>
                  </div>
                )}
                <p
                  className={`text-xs mt-1 ${msg.sender === "me" ? "text-yellow-700" : "text-gray-500"}`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <form className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Smile className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Gift className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Start chatting..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-full"
          />
          <Button
            size="icon"
            className="rounded-full bg-rose-500 hover:bg-rose-600"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
