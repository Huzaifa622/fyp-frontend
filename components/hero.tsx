import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-muted-foreground">AI-Powered Diagnosis</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            The smartest way to diagnose{" "}
            <span className="text-accent">skin conditions</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Upload images of skin conditions and get instant AI-powered analysis. Generate comprehensive patient reports and book appointments with dermatologists seamlessly.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 px-8"
            >
              Start Free Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-secondary bg-transparent"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {[
            { value: "98%", label: "Accuracy Rate", company: "Clinical Trials" },
            { value: "50K+", label: "Patients Analyzed", company: "Worldwide" },
            { value: "2min", label: "Average Diagnosis", company: "Per Case" },
            { value: "500+", label: "Partner Clinics", company: "Network" },
          ].map((stat) => (
            <div key={stat.label} className="border-l border-border pl-4">
              <p className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{stat.company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
