"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/services/auth";

interface TopBarProps {
  user: any;
  isLoading: boolean;
}

export function TopBar({ user, isLoading }: TopBarProps) {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("accessToken");
    const pathname = window.location.pathname;
    let redirectPath = "/login";
    if (pathname.includes("/doctor")) {
      redirectPath = "/doctor/login";
    } else if (pathname.includes("/patient")) {
      redirectPath = "/patient/login";
    }
    router.push(redirectPath);
  };

  return (
    <header className="flex h-16 items-center justify-end border-b border-border bg-card px-8">
      <div className="flex items-center gap-4">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : user ? (
          <>
            <div className="flex flex-col items-end">
              <p className="text-sm font-medium text-foreground">
                {user.user.firstName} {user.user.lastName}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user.user.role || "User"}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                >
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage
                      src={user.user.avatar}
                      alt={`${user.user.firstName} ${user.user.lastName}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.user.firstName}
                      {user.user.lastName}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user?.firstName} {user.user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : null}
      </div>
    </header>
  );
}
