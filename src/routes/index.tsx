import { SignInButton } from "@clerk/tanstack-react-start"
import { auth } from "@clerk/tanstack-react-start/server"
import { redirect, isRedirect, createFileRoute } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import siteConfig from "#/config/site"

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    try {
      const { userId, orgId } = await auth()

      if (userId) {
        if (orgId) {
          throw redirect({
            to: "/organization/$orgId",
            params: { orgId },
          })
        } else {
          throw redirect({
            to: "/select-org",
          })
        }
      }
    } catch (error) {
      if (isRedirect(error)) throw error
      // redirect to home
    }
  },
  component: MainApp,
})

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
        <SignInButton mode="modal" forceRedirectUrl="/select-org">
          <Button size="lg">Start now</Button>
        </SignInButton>
      </div>
    </section>
  )
}
