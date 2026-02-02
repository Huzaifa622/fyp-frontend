import { Upload, Cpu, FileCheck, CalendarCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Upload Image",
    description:
      "Take or upload a clear photo of the skin condition. Our system accepts multiple angles for better accuracy.",
    icon: Upload,
  },
  {
    step: "02",
    title: "AI Analysis",
    description:
      "Our advanced AI model analyzes the image, comparing against millions of dermatological cases.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Get Report",
    description:
      "Receive a detailed report with condition identification, confidence score, and treatment suggestions.",
    icon: FileCheck,
  },
  {
    step: "04",
    title: "Book Appointment",
    description:
      "Connect with a specialist dermatologist instantly based on the AI recommendation.",
    icon: CalendarCheck,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-accent mb-3">How it Works</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            From image to diagnosis in minutes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A simple four-step process to get accurate skin condition analysis
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card">
                    <step.icon className="h-7 w-7 text-accent" />
                  </div>
                  <span className="mt-4 text-xs font-medium text-accent">
                    Step {step.step}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Preview */}
     
      </div>
    </section>
  );
}
