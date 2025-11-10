"use client";

import Layout from "@/components/layout";
import "swiper/css";
import "swiper/css/effect-creative";
import AuthGuard from "@/components/common/AuthGuard/AuthGuard";
import ListChatPartner from "../connections/components/ListChatPartner";
import Discover from "./components/Discover";

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
