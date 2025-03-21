import express from "express"
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeRole,
  changeStatus,
  getUserComplaints,
} from "../controllers/userController.js"
import { authMiddleware, authorize } from "../middleware/authMiddleware.js"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Set up storage for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/avatars")

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images only
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
})

const router = express.Router()

// Routes for all authenticated users
router.get("/me/complaints", authMiddleware, getUserComplaints)

// Routes for admins only
router.route("/").get(authMiddleware, authorize("admin", "supervisor"), getUsers)

router
  .route("/:id")
  .get(authMiddleware, authorize("admin", "supervisor"), getUser)
  .put(authMiddleware, authorize("admin"), upload.single("avatar"), updateUser)
  .delete(authMiddleware, authorize("admin"), deleteUser)

router.put("/:id/role", authMiddleware, authorize("admin"), changeRole)
router.put("/:id/status", authMiddleware, authorize("admin"), changeStatus)

export default router

