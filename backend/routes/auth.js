import express from "express"
import {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  getAllUser
} from "../controllers/authController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/me", authMiddleware, getMe)
router.get("/allUser", getAllUser)
router.put("/updatedetails", authMiddleware, updateDetails)
router.put("/updatepassword", authMiddleware, updatePassword)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword/:resettoken", resetPassword)

export default router

