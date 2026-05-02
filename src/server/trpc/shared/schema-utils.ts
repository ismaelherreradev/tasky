import { z } from "zod"

export const idSchema = z.number().int().positive({
  message: "ID must be a positive integer.",
})

export const orgIdSchema = z
  .union([z.string(), z.number()])
  .transform((val) => String(val))
  .refine((val) => val.length > 0, {
    message: "Organization ID is required.",
  })

export const titleSchema = z
  .string()
  .min(3, { message: "Title must be at least 3 characters long." })
  .max(255, { message: "Title must be at most 255 characters long." })

export const orderSchema = z.number().int().nonnegative({
  message: "Order must be a non-negative integer.",
})

export const descriptionSchema = z.string().optional()
