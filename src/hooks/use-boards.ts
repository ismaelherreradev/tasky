import { useQuery } from "@tanstack/react-query";
import type { BoardSelect } from "~/server/db/schema";

export async function fetchBoards(orgId: string | null | undefined): Promise<BoardSelect[]> {
  const response = await fetch(`/api/boards?orgId=${orgId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<BoardSelect[]>;
}

export function useBoards(orgId: string | null | undefined) {
  return useQuery<BoardSelect[]>({
    queryKey: ["boardss", orgId],
    queryFn: () => fetchBoards(orgId),
    enabled: !!orgId,
  });
}
