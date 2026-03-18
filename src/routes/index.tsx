import { Button } from "#/components/ui/button"
import { SiteConfig } from "#/old/config/site"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })
function App() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="mb-8 font-extralight text-6xl text-foreground tracking-tight lg:text-8xl">
        {SiteConfig.title}
      </h1>

      <p className="mx-auto mb-12 max-w-2xl font-light text-muted-foreground text-xl leading-relaxed">
        {SiteConfig.description}
      </p>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg">Start now</Button>

        <Button variant="ghost" size="lg">
          Sign in
        </Button>
      </div>
    </section>
  )
}
