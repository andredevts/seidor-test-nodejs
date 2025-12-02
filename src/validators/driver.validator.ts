import { z } from "zod";

export const driverCreateSchema = z.object({
  name: z.string().min(7)
});

export const driverUpdateSchema = z.object({
  name: z.string().min(7).optional()
});
