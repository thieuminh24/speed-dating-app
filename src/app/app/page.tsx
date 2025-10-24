"use client";

import Layout from "@/components/layout";
import "swiper/css";
import "swiper/css/effect-creative";
import ListChatPartner from "./components/ListChatPartner";
import Discover from "./components/Discover";

export default function BumblePage() {
  return (
    <>
      <Layout
        asideChildren={<ListChatPartner />}
        mainChildren={<Discover />}
      ></Layout>
    </>
  );
}
