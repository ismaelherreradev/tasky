import { AnimatedFeatures } from "~/components/landing/animated-features";

const features = [
  {
    icon: "Calendar",
    title: "Organize",
    description:
      "Create boards and lists to structure your work the way you think. Intuitive and effortless.",
  },
  {
    icon: "Users",
    title: "Collaborate",
    description:
      "Share with your team and work together on what matters most. Real-time updates included.",
  },
  {
    icon: "Zap",
    title: "Focus",
    description:
      "Stay aligned on priorities and track progress. Built for speed and efficiency.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative px-6 py-32">
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="h-full w-full bg-repeat"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, hsl(var(--muted-foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <h2 className="mb-6 font-extralight text-4xl text-foreground tracking-tight lg:text-5xl">
            Everything you need
          </h2>

          <p className="mx-auto max-w-2xl font-light text-lg text-muted-foreground leading-relaxed">
            Simple tools that work the way you do
          </p>
        </div>

        <AnimatedFeatures features={features} />
      </div>

      <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-radial-gradient from-primary/2 via-primary/3 to-transparent opacity-50 blur-3xl" />
    </section>
  );
}
