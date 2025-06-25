import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { ContactControllers } from "./contact.controller";
import { ContactValidations } from "./contact.validation";

const router = Router();

// Public route
router.post(
  "/",
  validateRequest(ContactValidations.createContactValidationSchema),
  ContactControllers.createContact,
);

// Admin routes
router.get("/", auth(USER_ROLE.admin), ContactControllers.getAllContacts);

router.patch(
  "/:id/read",
  auth(USER_ROLE.admin),
  ContactControllers.markContactAsRead,
);

router.delete("/:id", auth(USER_ROLE.admin), ContactControllers.deleteContact);

export const ContactRoutes = router;
