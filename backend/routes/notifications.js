import express from "express"
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(authMiddleware, getNotifications)

router.put("/read-all", authMiddleware, markAllAsRead)

router.route("/:id/read").put(authMiddleware, markAsRead)

router.route("/:id").delete(authMiddleware, deleteNotification)

export default router

