import { useClerk, useSignIn, useSignUp } from "@clerk/tanstack-react-start"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useEffect, useRef } from "react"

export const Route = createFileRoute("/sso-callback")({
  component: SSOCallbackPage,
})

function SSOCallbackPage() {
  const clerk = useClerk()
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()
  const router = useRouter()
  const hasRun = useRef(false)

  const navigateToSignIn = () => router.navigate({ to: "/" })

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: async ({ session, decorateUrl }) => {
        console.log(session)

        const url = decorateUrl("/")
        if (url.startsWith("http")) {
          window.location.href = url
        } else {
          void router.navigate({ to: url })
        }
      },
    })
  }

  const finalizeSignUp = async () => {
    await signUp.finalize({
      navigate: async ({ session, decorateUrl }) => {
        console.log(session)

        const url = decorateUrl("/")
        if (url.startsWith("http")) {
          window.location.href = url
        } else {
          void router.navigate({ to: url })
        }
      },
    })
  }

  useEffect(() => {
    void (async () => {
      if (!clerk.loaded || hasRun.current) return
      hasRun.current = true

      if (signIn.status === "complete") {
        await finalizeSignIn()
        return
      }

      if (signUp.isTransferable) {
        await signIn.create({ transfer: true })
        const status = signIn.status as typeof signIn.status | "complete"
        if (status === "complete") {
          await finalizeSignIn()
          return
        }
        return navigateToSignIn()
      }

      if (signIn.isTransferable) {
        await signUp.create({ transfer: true })
        if (signUp.status === "complete") {
          await finalizeSignUp()
          return
        }
        return router.navigate({ to: "/" })
      }

      if (signUp.status === "complete") {
        await finalizeSignUp()
        return
      }

      const existingSessionId =
        signIn.existingSession?.sessionId ?? signUp.existingSession?.sessionId

      if (existingSessionId) {
        await clerk.setActive({
          session: existingSessionId,
          navigate: async ({ session, decorateUrl }) => {
            console.log(session)

            const url = decorateUrl("/")
            if (url.startsWith("http")) {
              window.location.href = url
            } else {
              void router.navigate({ to: url })
            }
          },
        })
        return
      }
    })()
  }, [clerk.loaded, signIn, signUp])

  return (
    <div id="clerk-captcha">
      <p>Completing sign-in…</p>
    </div>
  )
}
