import { z } from "zod";

// export const ZUpdateList = z.object({
//   items: z.array(
//     z.object({
//       id: z.number(),
//       order: z.number(),
//     }),
//   ),
//   orgId: z.string(),
// });

// export type TUpdateList = z.infer<typeof ZUpdateList>;

export const ZCreateList = z.object({
  title: z
    .string({ required_error: "Title is required", invalid_type_error: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters long." }),
  boardId: z.number(),
});

export type TCreateList = z.infer<typeof ZCreateList>;

export const ZGetlistsWithCards = z.object({
  boardId: z.number(),
});

export type TZGetlistsWithCards = z.infer<typeof ZGetlistsWithCards>;
