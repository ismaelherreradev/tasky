import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { AnimatedHero } from "~/components/landing/animated-hero"
import { Button } from "~/components/ui/button"
import { SiteConfig } from "~/config/site"

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

      <div className="bg-radial-gradient from-primary/3 via-primary/5 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full to-transparent blur-3xl" />

      <AnimatedHero>
        <h1 className="text-foreground mb-8 text-6xl font-extralight tracking-tight lg:text-8xl">
          {SiteConfig.title}
        </h1>

        <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl leading-relaxed font-light">
          {SiteConfig.description}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden rounded-full px-10 py-6 text-base font-medium shadow-lg transition-all hover:shadow-xl"
          >
            <Link to="/sign-up" className="flex items-center gap-3">
              Start now
              <ArrowRight size={18} />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            asChild
            className="text-muted-foreground hover:text-foreground rounded-full px-8 py-6 text-base font-medium transition-all"
          >
            <Link to="/sign-in">Sign in</Link>
          </Button>
        </div>
      </AnimatedHero>
    </section>
  )
}
