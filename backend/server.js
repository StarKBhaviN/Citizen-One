import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"

// Routes
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import complaintRoutes from "./routes/complaints.js"
import departmentRoutes from "./routes/departments.js"
import messageRoutes from "./routes/messages.js"
import dashboardRoutes from "./routes/dashboard.js"
import notificationRoutes from "./routes/notifications.js"
import reportRoutes from "./routes/reports.js"

// Middleware
import { errorHandler } from "./middleware/errorHandler.js"
import { authMiddleware } from "./middleware/authMiddleware.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const __dirname = path.dirname(fileURLToPath(import.meta.url))


// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:3000",
    credentials: true,
  }),
)

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authMiddleware, userRoutes)
app.use("/api/complaints", complaintRoutes) // Some routes will need auth, handled in the route file
app.use("/api/departments", authMiddleware, departmentRoutes)
app.use("/api/messages", authMiddleware, messageRoutes)
app.use("/api/dashboard", authMiddleware, dashboardRoutes)
app.use("/api/notifications", authMiddleware, notificationRoutes)
app.use("/api/reports", authMiddleware, reportRoutes)

// Error handling middleware
app.use(errorHandler)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

