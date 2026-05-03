import type { OAuthStrategy } from "@clerk/shared/types"
import { useSignIn } from "@clerk/tanstack-react-start"
import { GithubLogoIcon } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"

export default function OAuth() {
  const { signIn, fetchStatus } = useSignIn()

  const isLoading = fetchStatus === "fetching"

  const signInWith = async (strategy: OAuthStrategy) => {
    if (isLoading) return

    const { error } = await signIn.sso({
      strategy,
      redirectCallbackUrl: "/sso-callback",
      redirectUrl: "/select-org",
    })

    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }
  }

  return (
    <Button disabled={isLoading} onClick={() => signInWith("oauth_github")}>
      <GithubLogoIcon weight="duotone" /> Github
    </Button>
  )
}
