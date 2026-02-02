"use client";

import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/services/auth";
import { Loader2, Eye, EyeOff, Check } from "lucide-react";

// ---------------- Schema ----------------
const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
    role: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ---------------- Component ----------------
const RegisterForm = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "patient";
  const router = useRouter();

  const [registerUser, { isLoading }] = useRegisterMutation();
  const [error, setError] = React.useState<string | null>(null);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    try {
      await registerUser(data).unwrap();
      router.push(`/verify-email?role=${data.role}&email=${data.email}`);
    } catch (err: any) {
      setError(err?.data?.message || "Registration failed. Please try again.");
    }
  };

  const inputClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Image */}
      <div className="hidden lg:flex relative items-center justify-center bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
        <img
          src="/images/health.png"
          alt="Healthcare"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-md text-center space-y-4 px-6">
          <h2 className="text-4xl font-bold">Join Our Platform</h2>
          <p className="text-primary-foreground/80">
            Register as a <span className="font-semibold capitalize">{role}</span>
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-xl shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground">
              Get started as a{" "}
              <span className="text-primary font-semibold capitalize">{role}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input {...register("firstName")} placeholder="First name" className={inputClass} />
                {errors.firstName && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <input {...register("lastName")} placeholder="Last name" className={inputClass} />
                {errors.lastName && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <input {...register("email")} type="email" placeholder="Email address" className={inputClass} />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
              <span
                className={`mt-1 flex h-4 w-4 items-center justify-center rounded border ${
                  agreed ? "bg-primary border-primary text-primary-foreground" : "border-input"
                }`}
                onClick={() => setAgreed(!agreed)}
              >
                {agreed && <Check size={12} />}
              </span>
              <span>
                I agree to the{" "}
                <span className="text-primary underline">Terms</span> &{" "}
                <span className="text-primary underline">Privacy Policy</span>
              </span>
            </label>

            <input type="hidden" {...register("role")} />

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ---------------- Suspense Wrapper ----------------
const Register = () => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
    <RegisterForm />
  </Suspense>
);

export default Register;
