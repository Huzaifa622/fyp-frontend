import { LoginForm } from "@/components/auth/login-form";

export default function PatientLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm role="patient" />
    </main>
  );
}
