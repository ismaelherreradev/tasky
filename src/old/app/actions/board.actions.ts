"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { api } from "~/trpc/server";

const createBoardSchema = z.object({
  title: z.string().min(1, "Board title is required").max(30, "Title too long"),
  orgId: z.string().min(1, "Organization is required"),
});

const updateBoardSchema = z.object({
  boardId: z.number(),
  title: z.string().min(1, "Board title is required").max(30, "Title too long"),
});

type ActionState = {
  error?: string;
  success: boolean;
  data?: unknown;
};

export async function createBoardAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { orgId: authOrgId } = await auth();

  if (!authOrgId) {
    return {
      error: "Unauthorized - Please sign in to create boards",
      success: false,
    };
  }

  try {
    const validatedFields = createBoardSchema.safeParse({
      title: formData.get("title"),
      orgId: formData.get("orgId"),
    });

    if (!validatedFields.success) {
      return {
        error: "Invalid input",
        success: false,
      };
    }

    const { title, orgId } = validatedFields.data;

    if (orgId !== authOrgId) {
      return {
        error: "Unauthorized - Invalid organization access",
        success: false,
      };
    }

    let board: Awaited<ReturnType<typeof api.board.create>> | undefined;
    try {
      board = await api.board.create({ title, orgId });
    } catch {
      return {
        error: "Failed to create board",
        success: false,
      };
    }

    if (!board || typeof board !== "object" || !("id" in board)) {
      return {
        error: "Failed to create board",
        success: false,
      };
    }

    revalidatePath(`/organization/${orgId}`);
    redirect(`/board/${String(board.id)}`);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[CREATE_BOARD_ACTION]", errorMessage);
    return {
      error: "Internal server error",
      success: false,
    };
  }
}

export async function updateBoardAction(
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
    const validatedFields = updateBoardSchema.safeParse({
      boardId: Number(formData.get("boardId")),
      title: formData.get("title"),
    });

    if (!validatedFields.success) {
      return {
        error: "Invalid input",
        success: false,
      };
    }

    const { boardId, title } = validatedFields.data;

    let board: Awaited<ReturnType<typeof api.board.updateBoard>> | undefined;
    try {
      board = await api.board.updateBoard({ boardId, title });
    } catch {
      return {
        error: "Failed to update board",
        success: false,
      };
    }

    if (!board) {
      return {
        error: "Failed to update board",
        success: false,
      };
    }

    revalidatePath(`/board/${boardId}`);
    return {
      success: true,
      data: board,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[UPDATE_BOARD_ACTION]", errorMessage);
    return {
      error: "Internal server error",
      success: false,
    };
  }
}

export async function deleteBoardAction(boardId: number): Promise<void> {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  try {
    let board: Awaited<ReturnType<typeof api.board.deleteBoard>> | undefined;
    try {
      board = await api.board.deleteBoard({ boardId });
    } catch {
      throw new Error("Failed to delete board");
    }

    if (!board) {
      throw new Error("Failed to delete board");
    }

    revalidatePath(`/organization/${orgId}`);
    redirect(`/organization/${orgId}`);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete board";
    console.error("[DELETE_BOARD_ACTION]", errorMessage);
    throw new Error("Failed to delete board");
  }
}
