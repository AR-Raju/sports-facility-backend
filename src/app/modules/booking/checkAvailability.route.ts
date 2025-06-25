import express from "express";
import { BookingControllers } from "../booking/booking.controller";

const router = express.Router();

router.get("/check-availability", BookingControllers.checkAvailableBooking);

export const checkAvailabilityRoutes = router;
