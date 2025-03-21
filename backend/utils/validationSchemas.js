import Joi from "joi"

// User validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
  phone: Joi.string().pattern(/^\d{10}$/),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
  }),
})

export const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
})

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\d{10}$/),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
  }),
  notificationPreferences: Joi.object({
    email: Joi.boolean(),
    sms: Joi.boolean(),
    statusUpdates: Joi.boolean(),
    feedbackReminders: Joi.boolean(),
  }),
  status: Joi.string().valid("active", "inactive", "suspended"),
  role: Joi.string().valid("citizen", "officer", "supervisor", "admin"),
  department: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
})

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(8),
})

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().required().email(),
})

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required().min(8),
})

// Complaint validation schemas
export const createComplaintSchema = Joi.object({
  category: Joi.string().required().valid("water", "electricity", "roads", "sanitation", "public_services", "other"),
  description: Joi.string().required().min(10),
  location: Joi.string().required(),
  priority: Joi.string().valid("low", "medium", "high"),
})

export const updateComplaintSchema = Joi.object({
  status: Joi.string().valid("submitted", "under_review", "in_progress", "resolved", "reopened"),
  statusDescription: Joi.string(),
  priority: Joi.string().valid("low", "medium", "high"),
  assignedTo: Joi.object({
    department: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    officer: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
  estimatedResolutionDate: Joi.date().iso(),
  comment: Joi.string(),
  feedback: Joi.object({
    rating: Joi.number().min(1).max(5),
    comment: Joi.string(),
  }),
})

// Department validation schemas
export const createDepartmentSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  code: Joi.string().required().min(2).max(10).uppercase(),
  description: Joi.string(),
  head: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  contactEmail: Joi.string().email(),
  contactPhone: Joi.string(),
  categories: Joi.array().items(
    Joi.string().valid("water", "electricity", "roads", "sanitation", "public_services", "other"),
  ),
})

export const updateDepartmentSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  code: Joi.string().min(2).max(10).uppercase(),
  description: Joi.string(),
  head: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  contactEmail: Joi.string().email(),
  contactPhone: Joi.string(),
  status: Joi.string().valid("active", "inactive"),
  categories: Joi.array().items(
    Joi.string().valid("water", "electricity", "roads", "sanitation", "public_services", "other"),
  ),
})

// Message validation schemas
export const createConversationSchema = Joi.object({
  participants: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .required(),
  complaintId: Joi.string(),
  isGroupChat: Joi.boolean(),
  name: Joi.string(),
})

export const sendMessageSchema = Joi.object({
  content: Joi.string().required(),
})

// Notification validation schemas
export const createNotificationSchema = Joi.object({
  recipient: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  type: Joi.string()
    .required()
    .valid("complaint_status", "new_message", "feedback_request", "assignment", "comment", "system"),
  title: Joi.string().required(),
  message: Joi.string().required(),
  relatedTo: Joi.object({
    model: Joi.string().valid("Complaint", "Message", "User"),
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
})

