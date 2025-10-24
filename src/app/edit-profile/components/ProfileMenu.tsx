"use client";

import { Zap } from "lucide-react";
import { Star } from "lucide-react";
import { Funnel } from "lucide-react";

const premiumFeatures = [
  {
    title: "See who likes you",
    icon: <Star className="text-white" />,
    style: {
      backgroundColorIcon: "bg-rose-400",
      backgroundColorBtn: "bg-rose-100",
    },
  },
  {
    title: "Unlimited swipes",
    icon: <Zap className="text-white" />,
    style: {
      backgroundColorIcon: "bg-amber-400",
      backgroundColorBtn: "bg-amber-100",
    },
  },
  {
    title: "Advanced filters",
    icon: <Funnel className="text-white" />,
    style: {
      backgroundColorIcon: "bg-purple-400",
      backgroundColorBtn: "bg-purple-100",
    },
  },
];

const menuItems = [
  { link: "/", text: "View Profile" },
  { link: "/", text: "Settings" },
  { link: "/", text: "Help & Support" },
  { link: "/", text: "Logout" },
];

export default function ProfileMenu() {
  return (
    <div className="w-full">
      <>
        {premiumFeatures.map((feature, index) => (
          <PremiumButton
            key={index}
            title={feature.title}
            icon={feature.icon}
            style={feature.style}
          />
        ))}
      </>
      <div className="flex flex-col">
        {menuItems.map((item, index) => (
          <MenuItem key={index} link={item.link} text={item.text} />
        ))}
      </div>
    </div>
  );
}

// 🧩 Sub-component for each menu item
function MenuItem({ link, text }: { link: string; text: string }) {
  return (
    <div className="flex items-center px-3 py-5 rounded-lg hover:bg-gray-50 cursor-pointer transition group justify-center">
      <a href={link} className="font-medium text-gray-700 transition">
        {text}
      </a>
    </div>
  );
}

function PremiumButton({
  title,
  icon,
  style,
}: {
  title: string;
  icon: React.ReactNode;
  style: Record<string, string>;
}) {
  return (
    <div
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
