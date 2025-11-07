"use client";

import RedirectIfAuthenticated from "@/components/common/RedirectIfAuthenticated/RedirectIfAuthenticated";
import LoginForm from "./LoginForm";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  return (
    <>
      <RedirectIfAuthenticated>
        <LoginForm />
      </RedirectIfAuthenticated>
    </>
  );
}
