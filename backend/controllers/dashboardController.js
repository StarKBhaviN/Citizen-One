import Complaint from "../models/Complaint.js"
import User from "../models/User.js"
import Department from "../models/Department.js"
import { asyncHandler } from "../middleware/asyncHandler.js"

// @desc    Get citizen dashboard stats
// @route   GET /api/dashboard/citizen
// @access  Private (Citizen)
export const getCitizenStats = asyncHandler(async (req, res) => {
  // Get total complaints
  const totalComplaints = await Complaint.countDocuments({ citizen: req.user.id })

  // Get complaints by status
  const submittedComplaints = await Complaint.countDocuments({
    citizen: req.user.id,
    status: "submitted",
  })

  const underReviewComplaints = await Complaint.countDocuments({
    citizen: req.user.id,
    status: "under_review",
  })

  const inProgressComplaints = await Complaint.countDocuments({
    citizen: req.user.id,
    status: "in_progress",
  })

  const resolvedComplaints = await Complaint.countDocuments({
    citizen: req.user.id,
    status: "resolved",
  })

  // Get complaints by category
  const complaintsByCategory = await Complaint.aggregate([
    { $match: { citizen: req.user._id } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])

  // Get recent complaints
  const recentComplaints = await Complaint.find({ citizen: req.user.id })
    .select("complaintId category status createdAt")
    .sort("-createdAt")
    .limit(5)
    .populate("assignedTo.department", "name")

  // Get pending feedback
  const pendingFeedback = await Complaint.find({
    citizen: req.user.id,
    status: "resolved",
    feedback: { $exists: false },
  })
    .select("complaintId category resolvedAt")
    .sort("-resolvedAt")
    .limit(5)

  res.status(200).json({
    success: true,
    data: {
      totalComplaints,
      statusCounts: {
        submitted: submittedComplaints,
        underReview: underReviewComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
      },
      complaintsByCategory,
      recentComplaints,
      pendingFeedback,
    },
  })
})

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
export const getAdminStats = asyncHandler(async (req, res) => {
  // Get total counts
  const totalComplaints = await Complaint.countDocuments()
  const totalUsers = await User.countDocuments()
  const totalCitizens = await User.countDocuments({ role: "citizen" })
  const totalOfficers = await User.countDocuments({ role: "officer" })
  const totalDepartments = await Department.countDocuments()

  // Get complaints by status
  const submittedComplaints = await Complaint.countDocuments({ status: "submitted" })
  const underReviewComplaints = await Complaint.countDocuments({ status: "under_review" })
  const inProgressComplaints = await Complaint.countDocuments({ status: "in_progress" })
  const resolvedComplaints = await Complaint.countDocuments({ status: "resolved" })

  // Get complaints by category
  const complaintsByCategory = await Complaint.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])

  // Get complaints by department
  const complaintsByDepartment = await Complaint.aggregate([
    { $match: { "assignedTo.department": { $exists: true } } },
    { $group: { _id: "$assignedTo.department", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])

  // Populate department names
  for (const item of complaintsByDepartment) {
    const department = await Department.findById(item._id).select("name")
    if (department) {
      item.name = department.name
    }
  }

  // Get recent complaints
  const recentComplaints = await Complaint.find()
    .select("complaintId category status createdAt")
    .sort("-createdAt")
    .limit(10)
    .populate("citizen", "name")
    .populate("assignedTo.department", "name")

  // Get resolution time stats
  const resolutionTimeStats = await Complaint.aggregate([
    {
      $match: {
        status: "resolved",
        resolvedAt: { $exists: true },
      },
    },
    {
      $project: {
        category: 1,
        resolutionTime: {
          $divide: [{ $subtract: ["$resolvedAt", "$createdAt"] }, 1000 * 60 * 60 * 24], // in days
        },
      },
    },
    {
      $group: {
        _id: "$category",
        averageResolutionTime: { $avg: "$resolutionTime" },
        minResolutionTime: { $min: "$resolutionTime" },
        maxResolutionTime: { $max: "$resolutionTime" },
      },
    },
  ])

  // Get user registration stats (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const userRegistrationStats = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ])

  res.status(200).json({
    success: true,
    data: {
      counts: {
        totalComplaints,
        totalUsers,
        totalCitizens,
        totalOfficers,
        totalDepartments,
      },
      statusCounts: {
        submitted: submittedComplaints,
        underReview: underReviewComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
      },
      complaintsByCategory,
      complaintsByDepartment,
      recentComplaints,
      resolutionTimeStats,
      userRegistrationStats,
    },
  })
})

// @desc    Get department dashboard stats
// @route   GET /api/dashboard/department
// @access  Private (Supervisor, Officer)
export const getDepartmentStats = asyncHandler(async (req, res) => {
  const departmentId = req.user.department

  // Get total complaints assigned to department
  const totalComplaints = await Complaint.countDocuments({
    "assignedTo.department": departmentId,
  })

  // Get complaints by status
  const submittedComplaints = await Complaint.countDocuments({
    "assignedTo.department": departmentId,
    status: "submitted",
  })

  const underReviewComplaints = await Complaint.countDocuments({
    "assignedTo.department": departmentId,
    status: "under_review",
  })

  const inProgressComplaints = await Complaint.countDocuments({
    "assignedTo.department": departmentId,
    status: "in_progress",
  })

  const resolvedComplaints = await Complaint.countDocuments({
    "assignedTo.department": departmentId,
    status: "resolved",
  })

  // Get complaints by category
  const complaintsByCategory = await Complaint.aggregate([
    { $match: { "assignedTo.department": departmentId } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])

  // Get complaints by officer
  const complaintsByOfficer = await Complaint.aggregate([
    {
      $match: {
        "assignedTo.department": departmentId,
        "assignedTo.officer": { $exists: true },
      },
    },
    { $group: { _id: "$assignedTo.officer", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])

  // Populate officer names
  for (const item of complaintsByOfficer) {
    const officer = await User.findById(item._id).select("name")
    if (officer) {
      item.name = officer.name
    }
  }

  // Get recent complaints
  const recentComplaints = await Complaint.find({ "assignedTo.department": departmentId })
    .select("complaintId category status createdAt")
    .sort("-createdAt")
    .limit(10)
    .populate("citizen", "name")
    .populate("assignedTo.officer", "name")

  // Get high priority complaints
  const highPriorityComplaints = await Complaint.find({
    "assignedTo.department": departmentId,
    priority: "high",
    status: { $ne: "resolved" },
  })
    .select("complaintId category status createdAt")
    .sort("-createdAt")
    .populate("citizen", "name")

  // Get resolution time stats
  const resolutionTimeStats = await Complaint.aggregate([
    {
      $match: {
        "assignedTo.department": departmentId,
        status: "resolved",
        resolvedAt: { $exists: true },
      },
    },
    {
      $project: {
        resolutionTime: {
          $divide: [{ $subtract: ["$resolvedAt", "$createdAt"] }, 1000 * 60 * 60 * 24], // in days
        },
      },
    },
    {
      $group: {
        _id: null,
        averageResolutionTime: { $avg: "$resolutionTime" },
        minResolutionTime: { $min: "$resolutionTime" },
        maxResolutionTime: { $max: "$resolutionTime" },
      },
    },
  ])

  // Get feedback stats
  const feedbackStats = await Complaint.aggregate([
    {
      $match: {
        "assignedTo.department": departmentId,
        "feedback.rating": { $exists: true },
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$feedback.rating" },
        count: { $sum: 1 },
      },
    },
  ])

  res.status(200).json({
    success: true,
    data: {
      totalComplaints,
      statusCounts: {
        submitted: submittedComplaints,
        underReview: underReviewComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
      },
      complaintsByCategory,
      complaintsByOfficer,
      recentComplaints,
      highPriorityComplaints,
      resolutionTimeStats: resolutionTimeStats[0] || {
        averageResolutionTime: 0,
        minResolutionTime: 0,
        maxResolutionTime: 0,
      },
      feedbackStats: feedbackStats[0] || { averageRating: 0, count: 0 },
    },
  })
})

