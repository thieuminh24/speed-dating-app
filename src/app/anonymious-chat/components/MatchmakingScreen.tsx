"use client";

import { useAnonymousChatStore } from "@/store/anonymous-chat.store";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Loader2, Users, Shield, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MatchmakingScreenProps {
  isSearching: boolean;
}

export default function MatchmakingScreen({
  isSearching,
}: MatchmakingScreenProps) {
  const { startMatching, cancelMatching } = useAnonymousChatStore();

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <MessageCircle className="w-20 h-20 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">Anonymous Chat</h2>
          <p className="text-purple-100">
            Connect with strangers and chat anonymously
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="searching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="inline-block"
                >
                  <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Finding someone to chat...
                </h3>
                <p className="text-gray-600 mb-8">
                  This might take a few seconds
                </p>

                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Button
                    onClick={cancelMatching}
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel Search
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <FeatureCard
                    icon={Shield}
                    title="Anonymous"
                    description="Your identity stays hidden"
                  />
                  <FeatureCard
                    icon={Users}
                    title="Random Match"
                    description="Connect with anyone globally"
                  />
                  <FeatureCard
                    icon={Zap}
                    title="Instant"
                    description="Start chatting in seconds"
                  />
                </div>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={startMatching}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-12 py-6 text-lg font-semibold shadow-lg"
                  >
                    <MessageCircle className="w-6 h-6 mr-2" />
                    Start Anonymous Chat
                  </Button>
                </motion.div>

                <p className="text-sm text-gray-500 mt-6">
                  By starting, you agree to be respectful and follow community
                  guidelines
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Info Cards */}
      {!isSearching && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200"
        >
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-600" />
            Safety Tips
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Don't share personal information (phone, address, etc.)</li>
            <li>• Be respectful and kind to others</li>
            <li>• Report inappropriate behavior</li>
            <li>• You can leave the chat anytime</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100"
    >
      <Icon className="w-10 h-10 text-purple-600 mx-auto mb-3" />
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
}
