"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { api } from "~/trpc/server";

const createCardSchema = z.object({
  title: z.string().min(1, "Card title is required").max(100, "Title too long"),
  listId: z.number(),
  boardId: z.number(),
});

const updateCardSchema = z.object({
  cardId: z.number(),
  title: z.string().min(1, "Card title is required").max(100, "Title too long"),
  description: z.string().optional(),
});

const copyCardSchema = z.object({
  cardId: z.number(),
  boardId: z.number(),
});

type ActionState = {
  error?: string;
  success: boolean;
  data?: unknown;
};

export async function createCardAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { orgId } = await auth();

  if (!orgId) {
    return {
      error: "Unauthorized - Please sign in to create cards",
      success: false,
    };
  }

  try {
    const validatedFields = createCardSchema.safeParse({
      title: formData.get("title"),
      listId: Number(formData.get("listId")),
      boardId: Number(formData.get("boardId")),
    });

    if (!validatedFields.success) {
      return {
        error: "Invalid input",
        success: false,
      };
    }

    const { title, listId, boardId } = validatedFields.data;

    const card = await api.card.createCard({ title, listId });

    if (!card) {
      return {
        error: "Failed to create card",
        success: false,
      };
    }

    revalidatePath(`/board/${boardId}`);
    return {
      success: true,
      data: card,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[CREATE_CARD_ACTION]", errorMessage);
    return {
      error: "Internal server error",
      success: false,
    };
  }
}

export async function updateCardAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { orgId } = await auth();

  if (!orgId) {
    return {
      error: "Unauthorized",
      success: false,
    };
  }

  try {
    const validatedFields = updateCardSchema.safeParse({
      cardId: Number(formData.get("cardId")),
      title: formData.get("title"),
      description: formData.get("description"),
    });

    if (!validatedFields.success) {
      return {
        error: "Invalid input",
        success: false,
      };
    }

    const { cardId, title, description } = validatedFields.data;
    const boardId = Number(formData.get("boardId"));

    const card = await api.card.updateCard({ id: cardId, title, description });

    if (!card) {
      return {
        error: "Failed to update card",
        success: false,
      };
    }

    revalidatePath(`/board/${boardId}`);
    return {
      success: true,
      data: card,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[UPDATE_CARD_ACTION]", errorMessage);
    return {
      error: "Internal server error",
      success: false,
    };
  }
}

export async function deleteCardAction(
  cardId: number,
  boardId: number,
): Promise<{ success: boolean; error?: string }> {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const card = await api.card.deleteCard({ id: cardId, boardId });

    if (!card) {
      throw new Error("Failed to delete card");
    }

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete card";
    console.error("[DELETE_CARD_ACTION]", errorMessage);
    throw new Error("Failed to delete card");
  }
}

export async function copyCardAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { orgId } = await auth();

  if (!orgId) {
    return {
      error: "Unauthorized",
      success: false,
    };
  }

  try {
    const validatedFields = copyCardSchema.safeParse({
      cardId: Number(formData.get("cardId")),
      boardId: Number(formData.get("boardId")),
    });

    if (!validatedFields.success) {
      return {
        error: "Invalid input",
        success: false,
      };
    }

    const { cardId, boardId } = validatedFields.data;

    const card = await api.card.copyCard({ id: cardId, boardId });

    if (!card) {
      return {
        error: "Failed to copy card",
        success: false,
      };
    }

    revalidatePath(`/board/${boardId}`);
    return {
      success: true,
      data: card,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[COPY_CARD_ACTION]", errorMessage);
    return {
      error: "Internal server error",
      success: false,
    };
  }
}
