import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { PaymentControllers } from "./payment.controller";

const router = Router();

// Initiate payment (user only)
router.post(
  "/initiate",
  auth(USER_ROLE.user),
  PaymentControllers.initiatePayment,
);

// Verify payment
router.get("/verify/:transactionId", PaymentControllers.verifyPayment);

// IPN handler (webhook from SSLCommerz)
router.post("/ipn", PaymentControllers.handlePaymentIPN);

export const PaymentRoutes = router;
