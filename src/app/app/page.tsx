"use client";

import Layout from "@/components/layout";
import "swiper/css";
import "swiper/css/effect-creative";
import ListChatPartner from "./components/ListChatPartner";
import Discover from "./components/Discover";
import AuthGuard from "@/components/common/AuthGuard/AuthGuard";

export default function BumblePage() {
  return (
    <AuthGuard>
      <Layout
        asideChildren={<ListChatPartner />}
        mainChildren={<Discover />}
      ></Layout>
    </AuthGuard>
  );
}
