import express from "express"
import { getComplaintReport, getDepartmentReport, getSystemReport } from "../controllers/reportController.js"
import { authMiddleware, authorize } from "../middleware/authMiddleware.js"

const router = express.Router()

// Complaint reports
router.get("/complaints/:id", authMiddleware, getComplaintReport)

// Department reports
router.get("/departments/:id", authMiddleware, authorize("admin", "supervisor"), getDepartmentReport)

// System reports
router.get("/system", authMiddleware, authorize("admin"), getSystemReport)

export default router

