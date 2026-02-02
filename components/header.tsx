"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          <Link href="/">
          <Image src={"/images/logo.png"} alt="Logo" width={100} height={100} />
       </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-foreground">
              Login
            </Button>
          </Link>
          
          <Link href="/register">
            <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
              Get Started
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="space-y-1 px-6 py-4">
            <Link
              href="#features"
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              How it Works
            </Link>
            <Link
              href="#pricing"
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Link href="/login" className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-foreground justify-start">
                  Doctor Login
                </Button>
              </Link>
              <Link href="/login" className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-foreground justify-start">
                  Patient Login
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button size="sm" className="w-full bg-foreground text-background hover:bg-foreground/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
