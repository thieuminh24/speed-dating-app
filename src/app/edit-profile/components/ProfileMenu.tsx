"use client";

import { Zap, Star, Funnel, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth.store";
import { logout as logoutApi } from "@/services/auth/auth.api";
import { useState } from "react";
import { toast } from "@/hook/useToast";

const premiumFeatures = [
  {
    title: "See who likes you",
    icon: <Star className="text-white" />,
    style: {
      backgroundColorIcon: "bg-rose-400",
      backgroundColorBtn: "bg-rose-100",
    },
    link: "/payment",
  },
  {
    title: "Unlimited swipes",
    icon: <Zap className="text-white" />,
    style: {
      backgroundColorIcon: "bg-amber-400",
      backgroundColorBtn: "bg-amber-100",
    },
    link: "/payment",
  },
  {
    title: "Advanced filters",
    icon: <Funnel className="text-white" />,
    style: {
      backgroundColorIcon: "bg-purple-400",
      backgroundColorBtn: "bg-purple-100",
    },
    link: "/payment",
  },
];

const menuItems = [
  { link: "/profile", text: "View Profile", action: null },
  { link: "/settings", text: "Settings", action: null },
  { link: "/help", text: "Help & Support", action: null },
  { link: null, text: "Logout", action: "logout" },
];

export default function ProfileMenu() {
  const router = useRouter();
  const { logout: logoutStore } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Gọi API logout
      await logoutApi();

      // Clear store
      logoutStore();

      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });

      // Redirect
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);

      // Vẫn logout ở client
      logoutStore();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <div className="w-full">
      {/* Premium Features */}
      <>
        {premiumFeatures.map((feature, index) => (
          <PremiumButton
            key={index}
            title={feature.title}
            icon={feature.icon}
            style={feature.style}
            link={feature.link}
          />
        ))}
      </>

      {/* Menu Items */}
      <div className="flex flex-col">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            link={item.link}
            text={item.text}
            action={item.action}
            onLogout={() => setShowLogoutDialog(true)}
          />
        ))}
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <LogoutDialog
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutDialog(false)}
          isLoading={isLoggingOut}
        />
      )}
    </div>
  );
}

// Menu Item Component
function MenuItem({
  link,
  text,
  action,
  onLogout,
}: {
  link: string | null;
  text: string;
  action: string | null;
  onLogout?: () => void;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (action === "logout" && onLogout) {
      onLogout();
    } else if (link) {
      router.push(link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center px-3 py-5 rounded-lg hover:bg-gray-50 cursor-pointer transition group justify-center"
    >
      <span
        className={`font-medium transition ${
          action === "logout" ? "text-red-600" : "text-gray-700"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

// Premium Button Component
function PremiumButton({
  title,
  icon,
  style,
  link,
}: {
  title: string;
  icon: React.ReactNode;
  style: Record<string, string>;
  link: string;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(link)}
      className={`${style.backgroundColorBtn} w-full rounded-3xl p-1 flex items-center justify-between mb-2 cursor-pointer hover:scale-105 transition-transform`}
    >
      <div className="flex items-center w-4/5 justify-between">
        <div className={`${style.backgroundColorIcon} p-2 rounded-full`}>
          {icon}
        </div>
        <p className="text-gray-700 font-medium text-center flex-1">{title}</p>
        <div className="w-8"></div>
      </div>
    </div>
  );
}

// Logout Confirmation Dialog
function LogoutDialog({
  onConfirm,
  onCancel,
  isLoading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <LogOut className="text-red-600" size={24} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-center text-gray-900">
          Logout?
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center text-sm">
          Are you sure you want to logout? You'll need to login again to
          continue using the app.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
