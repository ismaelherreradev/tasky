import type React from "react"

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "#/components/ui/alert-dialog"
import { Button } from "#/components/ui/button"

type ConfirmationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  variant?: "default" | "destructive"
  onConfirm: () => void
  onCancel?: () => void
  children?: React.ReactNode
} & Omit<React.ComponentProps<typeof AlertDialogPopup>, "children">

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  variant = "default",
  onConfirm,
  onCancel,
  children,
  ...popupProps
}: ConfirmationDialogProps) {
  const confirmVariant = variant === "destructive" ? "destructive" : "default"
  const cancelVariant = variant === "destructive" ? "outline" : "outline"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup {...popupProps}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {children ? (
            <AlertDialogDescription render={<div />}>{children}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant={cancelVariant} />} onClick={onCancel}>
            {cancelLabel}
          </AlertDialogClose>
          <Button variant={confirmVariant} loading={isLoading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
