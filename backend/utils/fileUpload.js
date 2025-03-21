import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configure storage for different file types
export const configureStorage = (uploadDir) => {
  // Create full path
  const fullPath = path.join(__dirname, "..", "uploads", uploadDir)

  // Create directory if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath)
    },
    filename: (req, file, cb) => {
      // Create unique filename with original extension
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const ext = path.extname(file.originalname)
      cb(null, `${uniqueSuffix}${ext}`)
    },
  })
}

// File filter for images
export const imageFilter = (req, file, cb) => {
  // Allow only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed"), false)
  }
}

// File filter for documents
export const documentFilter = (req, file, cb) => {
  // Allow images and documents
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only images and documents (PDF, DOC, DOCX) are allowed"), false)
  }
}

// Create upload middleware for avatars
export const uploadAvatar = multer({
  storage: configureStorage("avatars"),
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
})

// Create upload middleware for complaint attachments
export const uploadComplaintAttachments = multer({
  storage: configureStorage("complaints"),
  fileFilter: documentFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

// Create upload middleware for message attachments
export const uploadMessageAttachments = multer({
  storage: configureStorage("messages"),
  fileFilter: documentFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

