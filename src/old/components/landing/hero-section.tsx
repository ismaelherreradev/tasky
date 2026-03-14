import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedHero } from "~/components/landing/animated-hero";
import { Button } from "~/components/ui/button";
import { Paths, SiteConfig } from "~/config/site";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full bg-repeat"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--muted-foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--muted-foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-gradient from-primary/3 via-primary/5 to-transparent blur-3xl" />

      <AnimatedHero>
        <h1 className="mb-8 font-extralight text-6xl text-foreground tracking-tight lg:text-8xl">
          {SiteConfig.title}
        </h1>

        <p className="mx-auto mb-12 max-w-2xl font-light text-muted-foreground text-xl leading-relaxed">
          {SiteConfig.description}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden rounded-full px-10 py-6 font-medium text-base shadow-lg transition-all hover:shadow-xl"
          >
            <Link href={Paths.SignUpPage} className="flex items-center gap-3">
              Start now
              <ArrowRight size={18} />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            asChild
            className="rounded-full px-8 py-6 font-medium text-base text-muted-foreground transition-all hover:text-foreground"
          >
            <Link href={Paths.SignInPage}>Sign in</Link>
          </Button>
        </div>
      </AnimatedHero>
    </section>
  );
}
