import { z } from "zod";

export const tripCreateSchema = z.object({
  carId: z.string().min(24),
  driverId: z.string().min(24),
  startAt: z
    .string()
    .refine((s) => !Number.isNaN(Date.parse(s)), {
      message: "startAt must be an ISO date string",
    }),
  reason: z.string().min(10),
});

export const tripFinishSchema = z.object({
  endAt: z
    .string()
    .refine((s) => !Number.isNaN(Date.parse(s)), {
      message: "endAt must be an ISO date string",
    }),
});
