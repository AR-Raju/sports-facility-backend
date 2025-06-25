import { z } from "zod";

const createFacilityValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }).min(1, "Name cannot be empty"),
    description: z.string({
      required_error: "Description is required",
    }).min(1, "Description cannot be empty"),
    pricePerHour: z.number({
      required_error: "Price per hour is required",
    }).min(0, "Price cannot be negative"),
    location: z.string({
      required_error: "Location is required",
    }).min(1, "Location cannot be empty"),
    image: z.string().optional(),
  }),
});

const updateFacilityValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    description: z.string().min(1, "Description cannot be empty").optional(),
    pricePerHour: z.number().min(0, "Price cannot be negative").optional(),
    location: z.string().min(1, "Location cannot be empty").optional(),
    image: z.string().optional(),
  }),
});

export const FacilityValidations = {
  createFacilityValidationSchema,
  updateFacilityValidationSchema,
};
