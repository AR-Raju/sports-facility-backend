import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { UserController } from "../user/user.controller";
import { UserValidations } from "../user/user.validation";
import { AuthControllers } from "./auth.controller";
import { AuthValidations } from "./auth.validation";

const router = Router();

// Public routes
router.post(
  "/register",
  validateRequest(UserValidations.createUserValidationSchema),
  UserController.createUser,
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUsers,
);

router.post("/logout", AuthControllers.logoutUser);

// Protected routes
router.get("/me", auth(USER_ROLE.admin, USER_ROLE.user), AuthControllers.getMe);

// Admin registration (protected route)
router.post(
  "/admin/register",
  auth(USER_ROLE.admin),
  validateRequest(UserValidations.createAdminValidationSchema),
  UserController.createAdmin,
);

export const AuthRoutes = router;
