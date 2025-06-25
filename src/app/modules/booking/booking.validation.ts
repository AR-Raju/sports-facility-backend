import { z } from "zod";

const createBookingValidationSchema = z.object({
  body: z.object({
    date: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Date must be in YYYY-MM-DD format",
    }),
    startTime: z.string().refine((val) => /^\d{2}:\d{2}$/.test(val), {
      message: "Start time must be in HH:MM format",
    }),
    endTime: z.string().refine((val) => /^\d{2}:\d{2}$/.test(val), {
      message: "End time must be in HH:MM format",
    }),
    facility: z.string(),
  }),
});

export const BookingValidations = { createBookingValidationSchema };
