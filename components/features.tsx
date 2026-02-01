import { Brain, FileText, Calendar, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    name: "AI Image Analysis",
    description:
      "Advanced machine learning algorithms analyze skin images to identify over 200+ conditions with clinical-grade accuracy.",
    icon: Brain,
  },
  {
    name: "Instant Reports",
    description:
      "Generate comprehensive patient reports in seconds, complete with condition details, severity assessment, and treatment recommendations.",
    icon: FileText,
  },
  {
    name: "Smart Scheduling",
    description:
      "Seamlessly book appointments with specialist dermatologists based on AI recommendations and availability.",
    icon: Calendar,
  },
  {
    name: "HIPAA Compliant",
    description:
      "Enterprise-grade security ensures all patient data is encrypted and handled according to healthcare regulations.",
    icon: Shield,
  },
  {
    name: "Real-time Processing",
    description:
      "Get diagnosis results in under 2 minutes with our optimized AI pipeline and cloud infrastructure.",
    icon: Zap,
  },
  {
    name: "Clinic Integration",
    description:
      "Connect with your existing EMR systems and clinic management software through our secure API.",
    icon: Users,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-accent mb-3">Features</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Everything you need for accurate skin diagnosis
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powered by cutting-edge AI trained on millions of dermatological cases
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-secondary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
