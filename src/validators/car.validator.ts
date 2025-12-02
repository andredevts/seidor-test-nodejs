import { z } from "zod";

export const carCreateSchema = z.object({
  plate: z.string().min(7),
  color: z.string().min(3),
  brand: z.string().min(3)
});

export const carUpdateSchema = z.object({
  plate: z.string().min(7).optional(),
  color: z.string().min(3).optional(),
  brand: z.string().min(3).optional()
});
