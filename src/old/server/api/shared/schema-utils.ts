import { z } from "zod";

export const idSchema = z.number().int().positive({
  message: "ID must be a positive integer.",
});

export const orgIdSchema = z.string().min(1, {
  message: "Organization ID is required.",
});

export const titleSchema = z
  .string()
  .min(3, { message: "Title must be at least 3 characters long." })
  .max(255, { message: "Title must be at most 255 characters long." });

export const orderSchema = z.number().int().nonnegative({
  message: "Order must be a non-negative integer.",
});

export const descriptionSchema = z.string().optional();

export const createEntitySchema = <T extends z.ZodRawShape>(fields: T) =>
  z.object(fields);

export const createPaginationSchema = () =>
  z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
  });

export const createSortSchema = (sortableFields: string[]) =>
  z.object({
    sortBy: z.enum(sortableFields as [string, ...string[]]).optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  });

export const createFilterSchema = <T extends z.ZodRawShape>(filters: T) =>
  z.object(filters).partial();

export const createBatchItemSchema = <T extends z.ZodRawShape>(itemSchema: T) =>
  z.object({
    items: z
      .array(z.object(itemSchema))
      .nonempty({ message: "At least one item is required." }),
  });

export type InferSchema<T> = T extends z.ZodType<infer U> ? U : never;

export const createUpdateSchema = <T extends z.ZodRawShape>(
  fields: T,
  requiredFields: (keyof T)[] = [],
) => {
  const baseSchema = z.object(fields);
  const partialSchema = baseSchema.partial();

  if (requiredFields.length === 0) {
    return partialSchema;
  }

  return partialSchema.extend(
    Object.fromEntries(
      requiredFields.map((field) => [field, baseSchema.shape[field]]),
    ),
  );
};

export const boardIdSchema = idSchema;
export const listIdSchema = idSchema;
export const cardIdSchema = idSchema;
