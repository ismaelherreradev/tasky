import { HeroSection } from "~/components/landing";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 opacity-[0.015]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--muted-foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--muted-foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "120px 120px",
          }}
        />
      </div>

      <div className="from-background via-background to-muted/20 fixed inset-0 -z-10 bg-gradient-to-b" />

      <HeroSection />
    </div>
  );
}
