import User from "../models/User.js"
import Complaint from "../models/Complaint.js"
import Department from "../models/Department.js"
import { asyncHandler } from "../middleware/asyncHandler.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin, Supervisor)
export const getUsers = asyncHandler(async (req, res) => {
  let query

  // Copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"]

  // Remove fields from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // Finding resource
  query = User.find(JSON.parse(queryStr))

  // Role-based filtering
  if (req.user.role === "supervisor") {
    // Supervisors can only see users in their department
    query = query.find({
      $or: [{ department: req.user.department }, { role: "citizen" }],
    })
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ")
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    query = query.sort(sortBy)
  } else {
    query = query.sort("-createdAt")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await User.countDocuments(query)

  query = query.skip(startIndex).limit(limit)

  // Populate department
  query = query.populate("department", "name code")

  // Execute query
  const users = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    count: users.length,
    pagination,
    data: users,
  })
})

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin, Supervisor)
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("department", "name code")

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }

  // Check if supervisor has access to this user
  if (req.user.role === "supervisor" && user.role !== "citizen") {
    if (!user.department || user.department.toString() !== req.user.department.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this user",
      })
    }
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }

  // Handle file upload
  if (req.file) {
    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, "..", user.avatar)
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath)
      }
    }

    // Set new avatar path
    req.body.avatar = req.file.path.replace(/\\/g, "/").replace("backend/", "")
  }

  // Update user
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("department", "name code")

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }

  // Delete avatar if exists
  if (user.avatar) {
    const avatarPath = path.join(__dirname, "..", user.avatar)
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath)
    }
  }

  await user.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Change user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin)
export const changeRole = asyncHandler(async (req, res) => {
  const { role, department } = req.body

  if (!role) {
    return res.status(400).json({
      success: false,
      message: "Please provide a role",
    })
  }

  // Validate role
  const validRoles = ["citizen", "officer", "supervisor", "admin"]
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role",
    })
  }

  // Check if department is required
  if ((role === "officer" || role === "supervisor") && !department) {
    return res.status(400).json({
      success: false,
      message: "Department is required for officers and supervisors",
    })
  }

  // Verify department exists if provided
  if (department) {
    const departmentExists = await Department.findById(department)
    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      })
    }
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      role,
      department: department || undefined,
    },
    {
      new: true,
      runValidators: true,
    },
  ).populate("department", "name code")

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Change user status
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
export const changeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Please provide a status",
    })
  }

  // Validate status
  const validStatuses = ["active", "inactive", "suspended"]
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    })
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true,
    },
  )

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Get user complaints
// @route   GET /api/users/me/complaints
// @access  Private
export const getUserComplaints = asyncHandler(async (req, res) => {
  let query

  // Copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"]

  // Remove fields from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // Finding resource
  query = Complaint.find({
    ...JSON.parse(queryStr),
    citizen: req.user.id,
  })

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ")
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    query = query.sort(sortBy)
  } else {
    query = query.sort("-createdAt")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Complaint.countDocuments(query)

  query = query.skip(startIndex).limit(limit)

  // Populate references
  query = query.populate([
    { path: "assignedTo.department", select: "name code" },
    { path: "assignedTo.officer", select: "name email" },
  ])

  // Execute query
  const complaints = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    count: complaints.length,
    pagination,
    data: complaints,
  })
})

