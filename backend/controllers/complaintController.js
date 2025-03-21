import Complaint from "../models/Complaint.js"
import User from "../models/User.js"
import Department from "../models/Department.js"
import Notification from "../models/Notification.js"
import { asyncHandler } from "../middleware/asyncHandler.js"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
export const createComplaint = asyncHandler(async (req, res) => {
  req.body.citizen = req.user.id

  // Handle file uploads
  const attachments = []
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      attachments.push({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      })
    })
  }

  // Add attachments to request body
  req.body.attachments = attachments

  // Set initial timeline entry
  req.body.timeline = [
    {
      status: "submitted",
      description: "Complaint submitted successfully",
      updatedBy: req.user.id,
    },
  ]

  // Determine department based on category
  if (req.body.category) {
    const department = await Department.findOne({
      categories: req.body.category,
      status: "active",
    })

    if (department) {
      req.body.assignedTo = {
        department: department._id,
      }

      // Add department to timeline
      req.body.timeline[0].department = department._id
    }
  }

  // Set estimated resolution date (3 days from now by default)
  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + 3)
  req.body.estimatedResolutionDate = estimatedDate

  const complaint = await Complaint.create(req.body)

  // Create notification for admin/department
  if (complaint.assignedTo && complaint.assignedTo.department) {
    // Find department head or supervisors
    const departmentUsers = await User.find({
      department: complaint.assignedTo.department,
      role: { $in: ["supervisor", "admin"] },
      status: "active",
    })

    // Create notifications for each user
    for (const user of departmentUsers) {
      await Notification.create({
        recipient: user._id,
        type: "complaint_status",
        title: "New Complaint Assigned",
        message: `A new complaint (${complaint.complaintId}) has been assigned to your department.`,
        relatedTo: {
          model: "Complaint",
          id: complaint._id,
        },
      })
    }
  }

  res.status(201).json({
    success: true,
    data: complaint,
  })
})

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
export const getComplaints = asyncHandler(async (req, res) => {
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
  query = Complaint.find(JSON.parse(queryStr))

  // Role-based filtering
  if (req.user.role === "citizen") {
    // Citizens can only see their own complaints
    query = query.find({ citizen: req.user.id })
  } else if (req.user.role === "officer" || req.user.role === "supervisor") {
    // Officers and supervisors can see complaints assigned to their department
    query = query.find({
      "assignedTo.department": req.user.department,
    })
  }
  // Admins can see all complaints

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
    { path: "citizen", select: "name email phone" },
    { path: "assignedTo.department", select: "name code" },
    { path: "assignedTo.officer", select: "name email" },
    {
      path: "timeline.updatedBy",
      select: "name role",
    },
    {
      path: "timeline.department",
      select: "name code",
    },
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

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate([
    { path: "citizen", select: "name email phone" },
    { path: "assignedTo.department", select: "name code" },
    { path: "assignedTo.officer", select: "name email" },
    { path: "timeline.updatedBy", select: "name role" },
    { path: "timeline.department", select: "name code" },
    { path: "comments.user", select: "name role" },
  ])

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    })
  }

  // Check if user has permission to view this complaint
  if (req.user.role === "citizen" && complaint.citizen._id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this complaint",
    })
  }

  if (
    (req.user.role === "officer" || req.user.role === "supervisor") &&
    (!complaint.assignedTo.department ||
      complaint.assignedTo.department._id.toString() !== req.user.department.toString())
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this complaint",
    })
  }

  res.status(200).json({
    success: true,
    data: complaint,
  })
})

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
export const updateComplaint = asyncHandler(async (req, res) => {
  let complaint = await Complaint.findById(req.params.id)

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    })
  }

  // Check if user has permission to update this complaint
  if (req.user.role === "citizen" && complaint.citizen.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this complaint",
    })
  }

  if (
    (req.user.role === "officer" || req.user.role === "supervisor") &&
    (!complaint.assignedTo.department || complaint.assignedTo.department.toString() !== req.user.department.toString())
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this complaint",
    })
  }

  // Handle status updates
  if (req.body.status && req.body.status !== complaint.status) {
    // Add to timeline
    complaint.timeline.push({
      status: req.body.status,
      description: req.body.statusDescription || `Status updated to ${req.body.status}`,
      updatedBy: req.user.id,
      department: req.user.department,
    })

    // If status is resolved, set resolvedAt date
    if (req.body.status === "resolved") {
      complaint.resolvedAt = Date.now()

      // Create notification for citizen
      await Notification.create({
        recipient: complaint.citizen,
        type: "complaint_status",
        title: "Complaint Resolved",
        message: `Your complaint (${complaint.complaintId}) has been resolved. Please provide feedback on your experience.`,
        relatedTo: {
          model: "Complaint",
          id: complaint._id,
        },
      })
    }
  }

  // Handle assignment updates
  if (req.body.assignedTo) {
    // Only admins and supervisors can assign complaints
    if (req.user.role !== "admin" && req.user.role !== "supervisor") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to assign complaints",
      })
    }

    complaint.assignedTo = req.body.assignedTo

    // Add to timeline if department changed
    if (
      req.body.assignedTo.department &&
      (!complaint.assignedTo.department ||
        req.body.assignedTo.department.toString() !== complaint.assignedTo.department.toString())
    ) {
      const department = await Department.findById(req.body.assignedTo.department)

      complaint.timeline.push({
        status: complaint.status,
        description: `Complaint assigned to ${department.name}`,
        updatedBy: req.user.id,
        department: department._id,
      })

      // Create notification for department
      const departmentUsers = await User.find({
        department: department._id,
        role: { $in: ["supervisor", "officer"] },
        status: "active",
      })

      for (const user of departmentUsers) {
        await Notification.create({
          recipient: user._id,
          type: "assignment",
          title: "New Complaint Assigned",
          message: `Complaint ${complaint.complaintId} has been assigned to your department.`,
          relatedTo: {
            model: "Complaint",
            id: complaint._id,
          },
        })
      }
    }

    // Add to timeline if officer changed
    if (
      req.body.assignedTo.officer &&
      (!complaint.assignedTo.officer ||
        req.body.assignedTo.officer.toString() !== complaint.assignedTo.officer.toString())
    ) {
      const officer = await User.findById(req.body.assignedTo.officer)

      complaint.timeline.push({
        status: complaint.status,
        description: `Complaint assigned to officer ${officer.name}`,
        updatedBy: req.user.id,
        department: req.user.department,
      })

      // Create notification for officer
      await Notification.create({
        recipient: officer._id,
        type: "assignment",
        title: "Complaint Assigned to You",
        message: `Complaint ${complaint.complaintId} has been assigned to you.`,
        relatedTo: {
          model: "Complaint",
          id: complaint._id,
        },
      })
    }
  }

  // Handle priority updates
  if (req.body.priority && req.body.priority !== complaint.priority) {
    complaint.priority = req.body.priority

    // Add to timeline
    complaint.timeline.push({
      status: complaint.status,
      description: `Priority updated to ${req.body.priority}`,
      updatedBy: req.user.id,
      department: req.user.department,
    })
  }

  // Handle estimated resolution date updates
  if (req.body.estimatedResolutionDate && req.body.estimatedResolutionDate !== complaint.estimatedResolutionDate) {
    complaint.estimatedResolutionDate = req.body.estimatedResolutionDate

    // Add to timeline
    complaint.timeline.push({
      status: complaint.status,
      description: `Estimated resolution date updated to ${new Date(req.body.estimatedResolutionDate).toLocaleDateString()}`,
      updatedBy: req.user.id,
      department: req.user.department,
    })

    // Create notification for citizen
    await Notification.create({
      recipient: complaint.citizen,
      type: "complaint_status",
      title: "Resolution Date Updated",
      message: `The estimated resolution date for your complaint (${complaint.complaintId}) has been updated.`,
      relatedTo: {
        model: "Complaint",
        id: complaint._id,
      },
    })
  }

  // Handle comments
  if (req.body.comment) {
    complaint.comments.push({
      user: req.user.id,
      text: req.body.comment,
    })

    // Create notification for citizen if comment is from department
    if (req.user.role !== "citizen") {
      await Notification.create({
        recipient: complaint.citizen,
        type: "comment",
        title: "New Comment on Your Complaint",
        message: `A new comment has been added to your complaint (${complaint.complaintId}).`,
        relatedTo: {
          model: "Complaint",
          id: complaint._id,
        },
      })
    }
    // Create notification for department if comment is from citizen
    else {
      // Find department users
      const departmentUsers = await User.find({
        department: complaint.assignedTo.department,
        role: { $in: ["supervisor", "officer"] },
        status: "active",
      })

      for (const user of departmentUsers) {
        await Notification.create({
          recipient: user._id,
          type: "comment",
          title: "New Comment from Citizen",
          message: `The citizen has added a new comment to complaint ${complaint.complaintId}.`,
          relatedTo: {
            model: "Complaint",
            id: complaint._id,
          },
        })
      }
    }
  }

  // Handle feedback
  if (req.body.feedback && req.user.role === "citizen") {
    complaint.feedback = {
      rating: req.body.feedback.rating,
      comment: req.body.feedback.comment,
      submittedAt: Date.now(),
    }

    // Add to timeline
    complaint.timeline.push({
      status: complaint.status,
      description: `Feedback submitted by citizen`,
      updatedBy: req.user.id,
    })

    // Create notification for department
    const departmentUsers = await User.find({
      department: complaint.assignedTo.department,
      role: { $in: ["supervisor", "admin"] },
      status: "active",
    })

    for (const user of departmentUsers) {
      await Notification.create({
        recipient: user._id,
        type: "feedback_request",
        title: "Feedback Received",
        message: `The citizen has provided feedback for complaint ${complaint.complaintId}.`,
        relatedTo: {
          model: "Complaint",
          id: complaint._id,
        },
      })
    }
  }

  // Save the updated complaint
  await complaint.save()

  // Get the updated complaint with populated fields
  complaint = await Complaint.findById(req.params.id).populate([
    { path: "citizen", select: "name email phone" },
    { path: "assignedTo.department", select: "name code" },
    { path: "assignedTo.officer", select: "name email" },
    { path: "timeline.updatedBy", select: "name role" },
    { path: "timeline.department", select: "name code" },
    { path: "comments.user", select: "name role" },
  ])

  res.status(200).json({
    success: true,
    data: complaint,
  })
})

// @desc    Upload attachments to complaint
// @route   PUT /api/complaints/:id/attachments
// @access  Private
export const uploadAttachments = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    })
  }

  // Check if user has permission
  if (req.user.role === "citizen" && complaint.citizen.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this complaint",
    })
  }

  if (
    (req.user.role === "officer" || req.user.role === "supervisor") &&
    (!complaint.assignedTo.department || complaint.assignedTo.department.toString() !== req.user.department.toString())
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this complaint",
    })
  }

  // Handle file uploads
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please upload at least one file",
    })
  }

  const attachments = []
  req.files.forEach((file) => {
    attachments.push({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    })
  })

  // Add new attachments to complaint
  complaint.attachments = [...complaint.attachments, ...attachments]

  // Add to timeline
  complaint.timeline.push({
    status: complaint.status,
    description: `${attachments.length} new attachment(s) added`,
    updatedBy: req.user.id,
    department: req.user.department,
  })

  await complaint.save()

  res.status(200).json({
    success: true,
    data: complaint,
  })
})

// @desc    Delete attachment from complaint
// @route   DELETE /api/complaints/:id/attachments/:attachmentId
// @access  Private
export const deleteAttachment = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    })
  }

  // Check if user has permission
  if (req.user.role === "citizen" && complaint.citizen.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this complaint",
    })
  }

  if (
    (req.user.role === "officer" || req.user.role === "supervisor") &&
    (!complaint.assignedTo.department || complaint.assignedTo.department.toString() !== req.user.department.toString())
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this complaint",
    })
  }

  // Find attachment
  const attachment = complaint.attachments.id(req.params.attachmentId)

  if (!attachment) {
    return res.status(404).json({
      success: false,
      message: "Attachment not found",
    })
  }

  // Delete file from filesystem
  const filePath = path.join(__dirname, "..", attachment.path)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  // Remove attachment from complaint
  attachment.remove()

  // Add to timeline
  complaint.timeline.push({
    status: complaint.status,
    description: `Attachment ${attachment.filename} removed`,
    updatedBy: req.user.id,
    department: req.user.department,
  })

  await complaint.save()

  res.status(200).json({
    success: true,
    data: complaint,
  })
})

// @desc    Get complaint by ID
// @route   GET /api/complaints/track/:complaintId
// @access  Public
export const trackComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({ complaintId: req.params.complaintId }).populate([
    { path: "assignedTo.department", select: "name code" },
    { path: "timeline.department", select: "name code" },
  ])

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    })
  }

  // Return limited information for public tracking
  const trackingInfo = {
    complaintId: complaint.complaintId,
    category: complaint.category,
    status: complaint.status,
    priority: complaint.priority,
    createdAt: complaint.createdAt,
    estimatedResolutionDate: complaint.estimatedResolutionDate,
    resolvedAt: complaint.resolvedAt,
    timeline: complaint.timeline.map((item) => ({
      status: item.status,
      description: item.description,
      timestamp: item.timestamp,
      department: item.department ? item.department.name : null,
    })),
    assignedTo: complaint.assignedTo.department
      ? {
          department: complaint.assignedTo.department.name,
        }
      : null,
  }

  res.status(200).json({
    success: true,
    data: trackingInfo,
  })
})

