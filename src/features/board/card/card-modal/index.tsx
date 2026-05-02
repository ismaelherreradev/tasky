
import { useQuery } from "@tanstack/react-query"
import type { InferSelectModel } from "drizzle-orm"
import { useAtom } from "jotai"
import { useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "#/components/ui/dialog"
import { ScrollArea } from "#/components/ui/scroll-area"
import { toastManager } from "#/components/ui/toast"
import { cardModalAtom } from "#/hooks/use-card-modal"
import { useTRPC } from "#/integrations/trpc/react"
import type { CardSelect, lists } from "#/server/db/schema"

import Actions from "./actions"
import Activity from "./activity"
import Description from "./description"
import Header from "./header"

export type ListSelect = Omit<InferSelectModel<typeof lists>, "order">
export type CardWithList = CardSelect & { list: ListSelect }

export function CardModal() {
  const [modalState, dispatch] = useAtom(cardModalAtom)
  const { id: modalId, isOpen } = modalState

  const [cardRetryCount, setCardRetryCount] = useState(0)
  const [logsRetryCount, setLogsRetryCount] = useState(0)
  const maxRetries = 3

  const trpc = useTRPC()

  const {
    data: cardData,
    isLoading: isCardLoading,
    error: cardError,
  } = useQuery({
    ...trpc.card.getCardById.queryOptions({ id: modalId! }),
    enabled: !!modalId,
    retry:
      cardRetryCount < maxRetries
        ? () => {
            setCardRetryCount(cardRetryCount + 1)
            return true
          }
        : false,
  })

  const {
    data: auditLogsData,
    isLoading: isLogsLoading,
    error: logsError,
  } = useQuery({
    ...trpc.logs.getAuditLogs.queryOptions({ id: modalId! }),
    enabled: !!modalId,
    retry:
      logsRetryCount < maxRetries
        ? () => {
            setLogsRetryCount(cardRetryCount + 1)
            return true
          }
        : false,
  })

  const handleClose = () => {
    dispatch((state) => ({ ...state, isOpen: false }))
  }

  if (cardError) {
    toastManager.add({
      title: "Error",
      description: `Error loading card data: ${cardError.message}`,
    })

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <span className="sr-only">
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>Error loading card data</DialogDescription>
          </span>
          <div className="p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <svg
                  className="h-8 w-8 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <title>Error icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-3 text-lg font-semibold text-destructive">Failed to load card</h3>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {cardError.message}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (logsError) {
    toastManager.add({
      title: "Error",
      description: `Error loading audit logs: ${logsError.message}`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-5xl gap-0 overflow-hidden p-0">
        <span className="sr-only">
          <DialogTitle>{cardData?.title ?? "Card Details"}</DialogTitle>
          <DialogDescription>
            {cardData?.description ?? "Card information and activity"}
          </DialogDescription>
        </span>

        <div className="flex h-full max-h-[90vh] flex-col">
          <div className="border-b bg-card px-6 py-5">
            {isCardLoading || !cardData ? <Header.Skeleton /> : <Header data={cardData} />}
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <div className="grid h-full grid-cols-1 lg:grid-cols-4">
              <div className="flex flex-col overflow-hidden lg:col-span-3">
                <ScrollArea className="flex-1 px-6 py-6">
                  <div className="max-w-3xl space-y-8">
                    {cardData ? <Description data={cardData} /> : <Description.Skeleton />}
                    {isLogsLoading ? (
                      <Activity.Skeleton />
                    ) : (
                      <Activity items={auditLogsData ?? []} />
                    )}
                  </div>
                </ScrollArea>
              </div>

              <div className="border-l bg-muted/20 lg:col-span-1">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    {cardData ? <Actions data={cardData} /> : <Actions.Skeleton />}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
