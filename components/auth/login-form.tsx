"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/services/auth";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginMutation();
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const response = await loginUser(data).unwrap();

      const userRole = response.role.toLowerCase();
      if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else if (userRole === "doctor") {
        router.push("/doctor/dashboard");
      } else if (userRole === "patient") {
        router.push("/patient/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      if (err.status === "PARSING_ERROR") {
        setError("Server configuration error. Please ensure the API URL is correct.");
        return;
      }

      if (err.status === 403) {
        setError(err?.data?.message || "Account not verified");
        const errorRole = err?.data?.role?.toLowerCase() || "patient";
        router.push(`/verify-email?role=${errorRole}&email=${data.email}`);
        return;
      }

      setError(err?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-xl shadow-lg border border-border">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter">Welcome Back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="m@example.com"
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              errors.email ? "border-destructive" : "border-input"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password with eye toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className={`flex h-10 w-full rounded-md border px-3 py-2 pr-10 text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                errors.password ? "border-destructive" : "border-input"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      {/* Register links */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>Don’t have an account?</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register?role=patient"
            className="text-primary hover:underline font-medium"
          >
            Register as Patient
          </Link>
          <Link
            href="/register?role=doctor"
            className="text-primary hover:underline font-medium"
          >
            Register as Doctor
          </Link>
        </div>
      </div>
    </div>
  );
};
