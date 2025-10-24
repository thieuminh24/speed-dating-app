"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-creative";

import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({
  asideChildren,
  mainChildren,
}: {
  asideChildren: React.ReactNode;
  mainChildren: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const showBackIcon = pathname !== "/app"; // Nếu không phải /app thì show icon
  console.log("Rendering Layout component", router);
  return (
    <div className="flex h-auto ">
      {/* Sidebar */}
      <aside className="w-3/12 border-r flex flex-col items-center justify-start py-4 px-4">
        {/* Avatar + Name */}
        <div className="flex items-center mb-4 justify-between w-full">
          {showBackIcon ? (
            <ChevronLeft
              className="cursor-pointer"
              onClick={() => router.back()}
            />
          ) : (
            <div></div>
          )}
          <img
            src="https://i.pravatar.cc/100?img=3"
            alt="avatar"
            className="w-14 h-14 rounded-full mb-2 cursor-pointer"
            onClick={() => router.push("/edit-profile")}
          />
          <div></div>
        </div>

        <div className="w-full flex flex-col items-center text-center ">
          {asideChildren}
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center ">
        <div className="flex mb-4 w-full flex-col items-center">
          <div className="w-[300px] h-[80px] overflow-hidden relative">
            <Image
              src="/image/CouplixMixLogo.png"
              alt="Couplix Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <Card className="w-11/12 shadow-none h-10/12 border-0 rounded-4xl flex flex-col justify-center py-0 ">
          <CardContent className="flex flex-col items-center w-full h-full px-0 ">
            {mainChildren}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
