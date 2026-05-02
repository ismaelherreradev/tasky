import { toastManager } from "#/components/ui/toast"

export function toastSuccess(title: string, description?: string) {
  toastManager.add({ type: "success", title, description })
}

export function toastError(title: string, description?: string) {
  toastManager.add({ type: "error", title, description })
}

export function toastInfo(title: string, description?: string) {
  toastManager.add({ type: "info", title, description })
}

export function toastWarning(title: string, description?: string) {
  toastManager.add({ type: "warning", title, description })
}
