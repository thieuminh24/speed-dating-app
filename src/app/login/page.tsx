"use client";

import LoginForm from "./LoginForm";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  return <LoginForm />;
}
