import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
export function CTA() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border bg-card overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,200,180,0.1),transparent_50%)]" />
          
          <div className="relative px-8 py-16 md:px-16 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl capitalize font-bold tracking-tight text-foreground sm:text-4xl text-balance">
                Ready to transform your dermatology practice?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of healthcare providers using DermaAI to deliver faster, more accurate diagnoses to their patients.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register?role=doctor">
                <Button
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 px-8"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </Link>
                <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  Schedule a Demo
                </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required. 14-day free trial included.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
