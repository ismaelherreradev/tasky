import { createFileRoute } from "@tanstack/react-router"
import { SignUp } from "@clerk/clerk-react"

export const Route = createFileRoute("/_auth/sign-up")({
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      fallbackRedirectUrl="/select-org"
    />
  )
}
