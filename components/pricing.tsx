import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for individual practitioners",
    price: "$49",
    period: "/month",
    features: [
      "50 AI analyses per month",
      "Basic patient reports",
      "Email support",
      "Single user access",
      "Standard processing",
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Professional",
    description: "For growing clinics and practices",
    price: "$149",
    period: "/month",
    features: [
      "500 AI analyses per month",
      "Comprehensive reports",
      "Priority support",
      "Up to 5 team members",
      "Fast processing",
      "Appointment scheduling",
      "EMR integration",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    description: "For hospitals and large organizations",
    price: "Custom",
    period: "",
    features: [
      "Unlimited AI analyses",
      "Custom report templates",
      "Dedicated support",
      "Unlimited team members",
      "Instant processing",
      "Full API access",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-accent mb-3">Pricing</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your practice. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.featured
                  ? "border-accent bg-accent/5"
                  : "border-border bg-card"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-foreground px-3 py-1 text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.featured
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
