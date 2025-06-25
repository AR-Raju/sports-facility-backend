import { Router } from "express";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { checkAvailabilityRoutes } from "../modules/booking/checkAvailability.route";
import { ContactRoutes } from "../modules/contact/contact.route";
import { FacilityRoutes } from "../modules/facility/facility.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

const modulesRoutes = [
  {
    path: "/",
    route: checkAvailabilityRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/facilities",
    route: FacilityRoutes,
  },
  {
    path: "/bookings",
    route: BookingRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/contact",
    route: ContactRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
