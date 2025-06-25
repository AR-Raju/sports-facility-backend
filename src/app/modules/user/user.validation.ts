import { z } from "zod";
import { userRoleEnum } from "./user.constant";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }).min(1, "Name cannot be empty"),
    email: z.string({
      required_error: "Email is required",
    }).email("Please enter a valid email"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password cannot be more than 20 characters"),
    phone: z.string({
      required_error: "Phone number is required",
    }).min(10, "Phone number must be at least 10 digits"),
    address: z.string({
      required_error: "Address is required",
    }).min(1, "Address cannot be empty"),
  }),
});

const createAdminValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }).min(1, "Name cannot be empty"),
    email: z.string({
      required_error: "Email is required",
    }).email("Please enter a valid email"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password cannot be more than 20 characters"),
    phone: z.string({
      required_error: "Phone number is required",
    }).min(10, "Phone number must be at least 10 digits"),
    address: z.string({
      required_error: "Address is required",
    }).min(1, "Address cannot be empty"),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
  createAdminValidationSchema,
};
