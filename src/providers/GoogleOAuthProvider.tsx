// providers/GoogleOAuthProvider.tsx
"use client";

import { GoogleOAuthProvider as GoogleProvider } from "@react-oauth/google";

export default function GoogleOAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error("⚠️ Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
    return <>{children}</>;
  }

  return <GoogleProvider clientId={clientId}>{children}</GoogleProvider>;
}
