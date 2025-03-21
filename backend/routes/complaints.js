import express from "express"
import {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  uploadAttachments,
  deleteAttachment,
  trackComplaint,
} from "../controllers/complaintController.js"
import { authMiddleware, authorize } from "../middleware/authMiddleware.js"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/complaints")

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
  // Allow images and PDFs
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true)
  } else {
    cb(new Error("Unsupported file type"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

const router = express.Router()

// Public route for tracking complaints
router.get("/track/:complaintId", trackComplaint)

// Protected routes
router
  .route("/")
  .get(authMiddleware, getComplaints)
  .post(authMiddleware, authorize("citizen", "admin"), upload.array("attachments", 5), createComplaint)

router.route("/:id").get(authMiddleware, getComplaint).put(authMiddleware, updateComplaint)

router.route("/:id/attachments").put(authMiddleware, upload.array("attachments", 5), uploadAttachments)

router.route("/:id/attachments/:attachmentId").delete(authMiddleware, deleteAttachment)

export default router

