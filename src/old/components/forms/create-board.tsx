"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

type CreateBoardDialogProps = {
  orgId: string;
  children?: React.ReactNode;
};

export function CreateBoardDialog({ children, orgId }: CreateBoardDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const router = useRouter();
  const utils = api.useUtils();

  const { mutate, error, isPending } = api.board.create.useMutation({
    onSuccess: async (data) => {
      toast.success(`Board "${data?.title}" created successfully!`);
      await utils.board.getBoards.invalidate({ orgId });
      setOpen(false);
      setTitle("");
      router.push(`/board/${data?.id}`);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (
          error as {
            data?: { zodError?: { fieldErrors?: { title?: string[] } } };
            message?: string;
          }
        )?.data?.zodError?.fieldErrors?.title?.[0] ??
        (error as { message?: string })?.message ??
        "Failed to create board. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Board title is required");
      return;
    }
    mutate({ title: title.trim(), orgId });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTitle("");
    }
  };

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus size={16} />
      Create Board
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={18} className="text-primary" />
            New Board
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="board-title">Board Title</Label>
            <Input
              id="board-title"
              name="title"
              type="text"
              placeholder="e.g. My Project Board"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-required="true"
              aria-invalid={
                !!(
                  error as {
                    data?: {
                      zodError?: { fieldErrors?: { title?: string[] } };
                    };
                  }
                )?.data?.zodError?.fieldErrors?.title
              }
              className={
                (
                  error as {
                    data?: {
                      zodError?: { fieldErrors?: { title?: string[] } };
                    };
                  }
                )?.data?.zodError?.fieldErrors?.title
                  ? "border-destructive"
                  : ""
              }
              autoFocus
            />
            {(
              error as {
                data?: { zodError?: { fieldErrors?: { title?: string[] } } };
              }
            )?.data?.zodError?.fieldErrors?.title && (
              <p className="text-destructive text-sm" role="alert">
                {
                  (
                    error as {
                      data?: {
                        zodError?: { fieldErrors?: { title?: string[] } };
                      };
                    }
                  )?.data?.zodError?.fieldErrors?.title?.[0]
                }
              </p>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim()}
              className="gap-2"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Board
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
