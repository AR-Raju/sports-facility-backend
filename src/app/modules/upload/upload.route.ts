import { Router } from "express"
import multer from "multer"
import auth from "../../middlewares/auth"
import { USER_ROLE } from "../user/user.constant"
import { UploadControllers } from "./upload.controller"

const router = Router()

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// Image upload route (admin only)
router.post("/image", auth(USER_ROLE.admin), upload.single("image"), UploadControllers.uploadImage)

export const UploadRoutes = router
