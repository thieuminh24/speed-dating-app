"use client";

import { useAnonymousChatStore } from "@/store/anonymous-chat.store";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnonymousChatContainerProps {
  children: React.ReactNode;
}

export default function AnonymousChatContainer({
  children,
}: AnonymousChatContainerProps) {
  const { isConnected } = useAnonymousChatStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Connection Status Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Anonymous Chat
              </h1>
              <span className="text-xs text-gray-500">· Chat anonymously</span>
            </div>

            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="flex items-center gap-1.5 text-green-600 text-sm">
                  <Wifi className="w-4 h-4" />
                  <span className="hidden sm:inline">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-red-600 text-sm">
                  <WifiOff className="w-4 h-4" />
                  <span className="hidden sm:inline">Disconnected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Connection Warning */}
      {!isConnected && (
        <div className="container mx-auto px-4 py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connection lost. Trying to reconnect...
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">{children}</div>

      {/* Privacy Notice */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm text-white py-2 text-center text-xs">
        <p>
          🔒 Your identity is anonymous. Be respectful and have fun! · No
          personal info is shared
        </p>
      </div>
    </div>
  );
}
