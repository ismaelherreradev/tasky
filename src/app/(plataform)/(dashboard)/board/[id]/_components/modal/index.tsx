"use client";

import { useState } from "react";
import type { CardSelect, lists } from "~/server/db/schema";
import { api } from "~/trpc/react";
import type { InferSelectModel } from "drizzle-orm";
import { toast } from "sonner";

import { useCardModal } from "~/hooks/use-card-modal";
import { Dialog, DialogContent } from "~/components/ui/dialog";

import { Actions } from "./actions";
import { Activity } from "./activity";
import { Description } from "./description";
import { Header } from "./header";

export type ListSelect = Omit<InferSelectModel<typeof lists>, "order">;
export type CardWithList = CardSelect & { list: ListSelect };

export function CardModal() {
  const modalId = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const [cardRetryCount, setCardRetryCount] = useState(0);
  const [logsRetryCount, setLogsRetryCount] = useState(0);
  const maxRetries = 3;

  const {
    data: cardData,
    isLoading: isCardLoading,
    error: cardError,
  } = api.card.getCardById.useQuery(
    { id: modalId ?? -1 },
    {
      enabled: !!modalId,
      retry:
        cardRetryCount < maxRetries
          ? () => {
              setCardRetryCount(cardRetryCount + 1);
              return true;
            }
          : false,
    },
  );

  const {
    data: auditLogsData,
    isLoading: isLogsLoading,
    error: logsError,
  } = api.logs.getAuditLogs.useQuery(
    { id: modalId ?? -1 },
    {
      enabled: !!modalId,
      retry:
        logsRetryCount < maxRetries
          ? () => {
              setLogsRetryCount(logsRetryCount + 1);
              return true;
            }
          : false,
    },
  );

  if (cardError) {
    toast.error(`Error loading card data: ${cardError.message}`);
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
            <div className="col-span-3">
              <div className="w-full space-y-6">
                <p className="text-red-500">Error loading card data: {cardError.message}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (logsError) {
    toast.error(`Error loading audit logs: ${logsError.message}`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {isCardLoading || !cardData ? <Header.Skeleton /> : <Header data={cardData} />}

        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {cardData ? <Description data={cardData} /> : <Description.Skeleton />}
              {isLogsLoading ? <Activity.Skeleton /> : <Activity items={auditLogsData ?? []} />}
            </div>
          </div>
          {cardData ? <Actions data={cardData} /> : <Actions.Skeleton />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
