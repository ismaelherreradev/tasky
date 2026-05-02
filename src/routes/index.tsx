import { createFileRoute } from "@tanstack/react-router"

import { AuthModal } from "#/components/auth-modal"
import siteConfig from "#/config/site"

export const Route = createFileRoute("/")({ component: MainApp })

function MainApp() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="mb-8 text-6xl font-extralight tracking-tight text-foreground lg:text-8xl">
        {siteConfig.name}
      </h1>

      <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed font-light text-muted-foreground">
        {siteConfig.mainDescription}
      </p>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <AuthModal />
      </div>
    </section>
  )
}
