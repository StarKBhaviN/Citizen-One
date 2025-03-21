import express from "express"
import {
  getConversations,
  getConversation,
  createConversation,
  getMessages,
  sendMessage,
  markAsRead,
} from "../controllers/messageController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Set up storage for message attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/messages")

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

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

const router = express.Router()

router.route("/conversations").get(authMiddleware, getConversations).post(authMiddleware, createConversation)

router.route("/conversations/:id").get(authMiddleware, getConversation)

router
  .route("/conversations/:id/messages")
  .get(authMiddleware, getMessages)
  .post(authMiddleware, upload.array("attachments", 5), sendMessage)

router.put("/conversations/:id/read", authMiddleware, markAsRead)

export default router

