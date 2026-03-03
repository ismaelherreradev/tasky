import { createFileRoute } from "@tanstack/react-router"
import { SignIn } from "@clerk/clerk-react"

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignInPage,
})

function SignInPage() {
  return (
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/select-org"
    />
  )
}
