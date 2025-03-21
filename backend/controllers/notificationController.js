import Notification from "../models/Notification.js"
import { asyncHandler } from "../middleware/asyncHandler.js"

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
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
  query = Notification.find({
    ...JSON.parse(queryStr),
    recipient: req.user.id,
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
  const total = await Notification.countDocuments(query)

  query = query.skip(startIndex).limit(limit)

  // Execute query
  const notifications = await query

  // Pagination result
  const pagination = {}
  
  if (endIndex &
  total
  )
  pagination.next = {
    page: page + 1,
    limit,
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  // Get unread count
  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    read: false,
  })

  res.status(200).json({
    success: true,
    count: notifications.length,
    unreadCount,
    pagination,
    data: notifications,
  })
})

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id)

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    })
  }

  // Check if user is the recipient
  if (notification.recipient.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this notification",
    })
  }

  notification.read = true
  notification.readAt = Date.now()
  await notification.save()

  res.status(200).json({
    success: true,
    data: notification,
  })
})

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      recipient: req.user.id,
      read: false,
    },
    {
      read: true,
      readAt: Date.now(),
    },
  )

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  })
})

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id)

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    })
  }

  // Check if user is the recipient
  if (notification.recipient.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this notification",
    })
  }

  await notification.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

