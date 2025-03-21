import express from "express"
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentComplaints,
  getDepartmentUsers,
} from "../controllers/departmentController.js"
import { authMiddleware, authorize } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(authMiddleware, getDepartments).post(authMiddleware, authorize("admin"), createDepartment)

router
  .route("/:id")
  .get(authMiddleware, getDepartment)
  .put(authMiddleware, authorize("admin"), updateDepartment)
  .delete(authMiddleware, authorize("admin"), deleteDepartment)

router.get("/:id/complaints", authMiddleware, authorize("admin", "supervisor", "officer"), getDepartmentComplaints)
router.get("/:id/users", authMiddleware, authorize("admin", "supervisor"), getDepartmentUsers)

export default router

