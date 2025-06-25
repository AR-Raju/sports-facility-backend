import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { UserController } from "./user.controller";

const router = express.Router();

// User dashboard routes
router.get(
  "/bookings",
  auth(USER_ROLE.user),
  UserController.getUserBookings
);

router.delete(
  "/bookings/:id",
  auth(USER_ROLE.user),
  UserController.cancelUserBooking
);

export const UserRoutes = router;
