import OAuth from "#/integrations/clerk/oauth"

import { Button } from "./ui/button"
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Start now</DialogTrigger>
      <DialogPopup className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sign in to Tasky</DialogTitle>
          <DialogDescription>Welcome back! Please sign in to continue</DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <OAuth />
        </DialogPanel>
      </DialogPopup>
    </Dialog>
  )
}
