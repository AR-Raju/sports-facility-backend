import { Router } from "express"
import auth from "../../middlewares/auth"
import { USER_ROLE } from "../user/user.constant"
import { AdminControllers } from "./admin.controller"
import { FacilityControllers } from "../facility/facility.controller"

const router = Router()

// All admin routes require admin authentication
router.use(auth(USER_ROLE.admin))

// Dashboard routes
router.get("/stats", AdminControllers.getAdminStats)
router.get("/dashboard", AdminControllers.getDashboardData)

// User management
router.get("/users", AdminControllers.getAllUsers)

// Facility management (admin-specific)
router.get("/facilities", FacilityControllers.getAdminFacilities)

export const AdminRoutes = router
