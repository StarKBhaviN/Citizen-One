import Department from "../models/Department.js"
import User from "../models/User.js"
import Complaint from "../models/Complaint.js"
import { asyncHandler } from "../middleware/asyncHandler.js"

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
export const getDepartments = asyncHandler(async (req, res) => {
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
  query = Department.find(JSON.parse(queryStr))

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
    query = query.sort("name")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Department.countDocuments(query)

  query = query.skip(startIndex).limit(limit)

  // Populate head
  query = query.populate("head", "name email")

  // Execute query
  const departments = await query

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
    count: departments.length,
    pagination,
    data: departments,
  })
})

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Private
export const getDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id).populate("head", "name email")

  if (!department) {
    return res.status(404).json({
      success: false,
      message: "Department not found",
    })
  }

  res.status(200).json({
    success: true,
    data: department,
  })
})

// @desc    Create department
// @route   POST /api/departments
// @access  Private (Admin)
export const createDepartment = asyncHandler(async (req, res) => {
  // Check if department with same code already exists
  const existingDepartment = await Department.findOne({ code: req.body.code })
  if (existingDepartment) {
    return res.status(400).json({
      success: false,
      message: "Department with this code already exists",
    })
  }

  // Check if head exists if provided
  if (req.body.head) {
    const head = await User.findById(req.body.head)
    if (!head) {
      return res.status(404).json({
        success: false,
        message: "Head user not found",
      })
    }

    // Update user role to supervisor if not already
    // if (head.role !== "supervisor") {
    //   await User.findByIdAndUpdate(head._id, {
    //     role: "supervisor",
    //     department: req.body._id, // This will be set after department creation
    //   })
    // }
  }

  const department = await Department.create(req.body)

  // Update the head's department if provided
  if (req.body.head) {
    await User.findByIdAndUpdate(req.body.head, {
      department: department._id,
    })
  }

  res.status(201).json({
    success: true,
    data: department,
  })
})

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
export const updateDepartment = asyncHandler(async (req, res) => {
  let department = await Department.findById(req.params.id)

  if (!department) {
    return res.status(404).json({
      success: false,
      message: "Department not found",
    })
  }

  // Check if department code is being changed and if it already exists
  if (req.body.code && req.body.code !== department.code) {
    const existingDepartment = await Department.findOne({ code: req.body.code })
    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department with this code already exists",
      })
    }
  }

  // Check if head is being changed
  if (req.body.head && req.body.head !== department.head?.toString()) {
    // Check if new head exists
    const newHead = await User.findById(req.body.head)
    if (!newHead) {
      return res.status(404).json({
        success: false,
        message: "Head user not found",
      })
    }

    // Update new head's role and department
    await User.findByIdAndUpdate(req.body.head, {
      role: "supervisor",
      department: department._id,
    })

    // Update old head's role if exists
    if (department.head) {
      // Check if old head is assigned to any other department as head
      const otherDepartments = await Department.find({
        head: department.head,
        _id: { $ne: department._id },
      })

      if (otherDepartments.length === 0) {
        // If not assigned to any other department, change role to officer
        await User.findByIdAndUpdate(department.head, {
          role: "officer",
        })
      }
    }
  }

  department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("head", "name email")

  res.status(200).json({
    success: true,
    data: department,
  })
})

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
export const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id)

  if (!department) {
    return res.status(404).json({
      success: false,
      message: "Department not found",
    })
  }

  // Check if department has any users
  const users = await User.find({ department: department._id })
  if (users.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Department has users assigned. Please reassign them before deleting.",
    })
  }

  // Check if department has any complaints
  const complaints = await Complaint.find({ "assignedTo.department": department._id })
  if (complaints.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Department has complaints assigned. Please reassign them before deleting.",
    })
  }

  await department.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Get department complaints
// @route   GET /api/departments/:id/complaints
// @access  Private (Admin, Supervisor, Officer)
export const getDepartmentComplaints = asyncHandler(async (req, res) => {
  // Check if department exists
  const department = await Department.findById(req.params.id)
  if (!department) {
    return res.status(404).json({
      success: false,
      message: "Department not found",
    })
  }

  // Check if user has access to this department
  if (req.user.role !== "admin" && req.user.department.toString() !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this department's complaints",
    })
  }

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
    "assignedTo.department": req.params.id,
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
    { path: "citizen", select: "name email phone" },
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

// @desc    Get department users
// @route   GET /api/departments/:id/users
// @access  Private (Admin, Supervisor)
export const getDepartmentUsers = asyncHandler(async (req, res) => {
  // Check if department exists
  const department = await Department.findById(req.params.id)
  if (!department) {
    return res.status(404).json({
      success: false,
      message: "Department not found",
    })
  }

  // Check if user has access to this department
  if (req.user.role === "supervisor" && req.user.department.toString() !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this department's users",
    })
  }

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
  query = User.find({
    ...JSON.parse(queryStr),
    department: req.params.id,
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
    query = query.sort("name")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await User.countDocuments(query)

  query = query.skip(startIndex).limit(limit)

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

// ```tsx file="backend/controllers/messageController.js"
// import Conversation from "../models/Conversation.js"
// import Message from "../models/Message.js"
// import User from "../models/User.js"
// import Complaint from "../models/Complaint.js"
// import Notification from "../models/Notification.js"
// import { asyncHandler } from "../middleware/asyncHandler.js"

// // @desc    Get all conversations for a user
// // @route   GET /api/messages/conversations
// // @access  Private
// export const getConversations = asyncHandler(async (req, res) => {
//   // Find all conversations where the user is a participant
//   const conversations = await Conversation.find({
//     participants: req.user.id,
//   })
//     .populate("participants", "name email avatar")
//     .populate("lastMessage")
//     .populate("complaint", "complaintId category status")
//     .sort("-updatedAt")

//   res.status(200).json({
//     success: true,
//     count: conversations.length,
//     data: conversations,
//   })
// })

// // @desc    Get single conversation
// // @route   GET /api/messages/conversations/:id
// // @access  Private
// export const getConversation = asyncHandler(async (req, res) => {
//   const conversation = await Conversation.findById(req.params.id)
//     .populate("participants", "name email avatar")
//     .populate("lastMessage")
//     .populate("complaint", "complaintId category status")

//   if (!conversation) {
//     return res.status(404).json({
//       success: false,
//       message: "Conversation not found",
//     })
//   }

//   // Check if user is a participant
//   if (!conversation.participants.some((p) => p._id.toString() === req.user.id)) {
//     return res.status(403).json({
//       success: false,
//       message: "Not authorized to access this conversation",
//     })
//   }

//   res.status(200).json({
//     success: true,
//     data: conversation,
//   })
// })

// // @desc    Create new conversation
// // @route   POST /api/messages/conversations
// // @access  Private
// export const createConversation = asyncHandler(async (req, res) => {
//   const { participants, complaintId, isGroupChat, name } = req.body

//   // Validate participants
//   if (!participants || !Array.isArray(participants) || participants.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide at least one participant",
//     })
//   }

//   // Add current user to participants if not already included
//   if (!participants.includes(req.user.id)) {
//     participants.push(req.user.id)
//   }

//   // Check if all participants exist
//   const users = await User.find({ _id: { $in: participants } })
//   if (users.length !== participants.length) {
//     return res.status(400).json({
//       success: false,
//       message: "One or more participants do not exist",
//     })
//   }

//   // Check if complaint exists if provided
//   let complaint
//   if (complaintId) {
//     complaint = await Complaint.findOne({ complaintId })
//     if (!complaint) {
//       return res.status(404).json({
//         success: false,
//         message: "Complaint not found",
//       })
//     }
//   }

//   // Check if conversation already exists (for non-group chats)
//   if (!isGroupChat && participants.length === 2) {
//     const existingConversation = await Conversation.findOne({
//       isGroupChat: false,
//       participants: { $all: participants, $size: 2 },
//       ...(complaint ? { complaint: complaint._id } : {}),
//     })

//     if (existingConversation) {
//       return res.status(200).json({
//         success: true,
//         data: existingConversation,
//       })
//     }
//   }

//   // Create conversation
//   const conversation = await Conversation.create({
//     participants,
//     complaint: complaint ? complaint._id : undefined,
//     isGroupChat: isGroupChat || false,
//     name: name || undefined,
//     unreadCount: participants.reduce((acc, participant) => {
//       acc.set(participant.toString(), 0)
//       return acc
//     }, new Map()),
//   })

//   // Populate the conversation
//   const populatedConversation = await Conversation.findById(conversation._id)
//     .populate("participants", "name email avatar")
//     .populate("complaint", "complaintId category status")

//   res.status(201).json({
//     success: true,
//     data: populatedConversation,
//   })
// })

// // @desc    Get messages for a conversation
// // @route   GET /api/messages/conversations/:id/messages
// // @access  Private
// export const getMessages = asyncHandler(async (req, res) => {
//   const conversation = await Conversation.findById(req.params.id)

//   if (!conversation) {
//     return res.status(404).json({
//       success: false,
//       message: "Conversation not found",
//     })
//   }

//   // Check if user is a participant
//   if (!conversation.participants.includes(req.user.id)) {
//     return res.status(403).json({
//       success: false,
//       message: "Not authorized to access this conversation",
//     })
//   }

//   // Get messages
//   const messages = await Message.find({ conversation: req.params.id })
//     .populate("sender", "name email avatar role")
//     .sort("createdAt")

//   res.status(200).json({
//     success: true,
//     count: messages.length,
//     data: messages,
//   })
// })

// // @desc    Send message in a conversation
// // @route   POST /api/messages/conversations/:id/messages
// // @access  Private
// export const sendMessage = asyncHandler(async (req, res) => {
//   const { content } = req.body

//   if (!content) {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide message content",
//     })
//   }

//   const conversation = await Conversation.findById(req.params.id)

//   if (!conversation) {
//     return res.status(404).json({
//       success: false,
//       message: "Conversation not found",
//     })
//   }

//   // Check if user is a participant
//   if (!conversation.participants.includes(req.user.id)) {
//     return res.status(403).json({
//       success: false,
//       message: "Not authorized to send messages in this conversation",
//     })
//   }

//   // Handle file uploads
//   const attachments = []
//   if (req.files && req.files.length > 0) {
//     req.files.forEach((file) => {
//       attachments.push({
//         filename: file.filename,
//         path: file.path,
//         mimetype: file.mimetype,
//         size: file.size,
//       })
//     })
//   }

//   // Create message
//   const message = await Message.create({
//     conversation: req.params.id,
//     sender: req.user.id,
//     content,
//     attachments,
//     readBy: [{ user: req.user.id }],
//   })

//   // Update conversation's lastMessage and updatedAt
//   conversation.lastMessage = message._id
  
//   // Update unread count for all participants except sender
//   conversation.participants.forEach((participant) => {
//     if (participant.toString() !== req.user.id) {
//       const currentCount = conversation.unreadCount.get(participant.toString()) || 0
//       conversation.unreadCount.set(participant.toString(), currentCount + 1)
//     }
//   })
  
//   await conversation.save()

//   // Populate the message
//   const populatedMessage = await Message.findById(message._id).populate("sender", "name email avatar role")

//   // Create notifications for other participants
//   const otherParticipants = conversation.participants.filter(
//     (participant) => participant.toString() !== req.user.id
//   )

//   for (const participant of otherParticipants) {
//     await Notification.create({
//       recipient: participant,
//       type: "new_message",
//       title: "New Message",
//       message: \`You have a new message from ${req.user.name}`,
//       relatedTo: {
//         model: "Message",
//         id: message._id,
//       },
// })
//   }

//   res.status(201).json(
// {
//   success: true, data
//   : populatedMessage,
// }
// )
// })

// @desc    Mark conversation as read
// @route   PUT /api/messages/conversations/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    })
  }

  // Check if user is a participant
  if (!conversation.participants.includes(req.user.id)) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this conversation",
    })
  }

  // Mark all messages as read by this user
  await Message.updateMany(
    {
      conversation: req.params.id,
      "readBy.user": { $ne: req.user.id },
    },
    {
      $addToSet: {
        readBy: { user: req.user.id, readAt: Date.now() },
      },
    },
  )

  // Reset unread count for this user
  conversation.unreadCount.set(req.user.id, 0)
  await conversation.save()

  res.status(200).json({
    success: true,
    message: "Conversation marked as read",
  })
})

