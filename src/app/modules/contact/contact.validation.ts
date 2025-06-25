import { z } from "zod"

const createContactValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(1, "Name cannot be empty"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Please enter a valid email"),
    phone: z.string().optional(),
    subject: z
      .string({
        required_error: "Subject is required",
      })
      .min(1, "Subject cannot be empty"),
    message: z
      .string({
        required_error: "Message is required",
      })
      .min(10, "Message must be at least 10 characters"),
  }),
})

export const ContactValidations = {
  createContactValidationSchema,
}
