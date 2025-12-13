"use client";

import { Card, CardContent } from "@/components/ui/card";
import "swiper/css";
import "swiper/css/effect-creative";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth.store";
import { PremiumAvatar } from "../common/Premium/PremiumBadge";
import MatchNotificationListener from "../common/MatchNotificationListener/MatchNotificationListener";

export default function Layout({
  asideChildren,
  mainChildren,
}: {
  asideChildren: React.ReactNode;
  mainChildren: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  console.log("user", user);

  const showBackIcon = pathname !== "/app";

  // Check premium status
  const isPremium =
    user?.isPremium &&
    user?.premiumUntil &&
    new Date(user.premiumUntil) > new Date();
  const tier = isPremium ? user?.subscriptionTier || "Premium" : "Free";

  return (
    <div className="flex h-auto">
      {/* Sidebar */}
      <MatchNotificationListener />
      <aside className="w-3/12 border-r flex flex-col items-center justify-start py-4 px-4">
        {/* Avatar + Name */}
        <div className="flex items-center mb-4 justify-between w-full">
          {showBackIcon ? (
            <ChevronLeft
              className="cursor-pointer hover:bg-gray-100 rounded-full p-1"
              onClick={() => router.back()}
            />
          ) : (
            <div></div>
          )}

          <div
            className="cursor-pointer"
            onClick={() => router.push("/edit-profile")}
          >
            <PremiumAvatar
              src={user?.avatar || "https://via.placeholder.com/56"}
              alt={user?.name || "User"}
              tier={tier as any}
              size={56}
            />
          </div>

          <div></div>
        </div>

        <div className="w-full flex flex-col items-center text-center">
          {asideChildren}
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center h-[100vh]">
        <Card className="w-full shadow-none h-11/12 border-0 rounded-4xl flex flex-col justify-center py-0">
          <CardContent className="flex flex-col items-center w-full h-full px-0">
            {mainChildren}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
