import express from "express"
import { getCitizenStats, getAdminStats, getDepartmentStats } from "../controllers/dashboardController.js"
import { authMiddleware, authorize } from "../middleware/authMiddleware.js"

const router = express.Router()

// Citizen dashboard stats
router.get("/citizen", authMiddleware, authorize("citizen"), getCitizenStats)

// Admin dashboard stats
router.get("/admin", authMiddleware, authorize("admin"), getAdminStats)

// Department dashboard stats
router.get("/department", authMiddleware, authorize("supervisor", "officer"), getDepartmentStats)

export default router

