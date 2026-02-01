"use client"

import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

function LoginContent() {
  const role = "admin";

  return <LoginForm role={role} />;
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
