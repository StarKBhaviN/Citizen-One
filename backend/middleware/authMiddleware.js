import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { asyncHandler } from "./asyncHandler.js"

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token

  // Check for token in cookies or authorization header
  if (req.cookies.token) {
    token = req.cookies.token
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from the token
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if user is active
    if (user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Your account is not active. Please contact support.",
      })
    }

    // Update last active timestamp
    user.lastActive = Date.now()
    await user.save({ validateBeforeSave: false })

    // Add user to request object
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    })
  }
})

// Middleware to check user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      })
    }
    next()
  }
}

