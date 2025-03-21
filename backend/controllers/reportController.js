import Complaint from "../models/Complaint.js"
import Department from "../models/Department.js"
import User from "../models/User.js"
import { asyncHandler } from "../middleware/asyncHandler.js"
import { generateComplaintReport, generateDepartmentReport } from "../utils/pdfGenerator.js"
import { exportToCSV, exportToExcel, exportToJSON } from "../utils/dataExport.js"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// @desc    Generate complaint report
// @route   GET /api/reports/complaints/:id
// @access  Private
export const getComplaintReport = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("citizen", "name email phone")
    .populate("assignedTo.department", "name code")
    .populate("assignedTo.officer", "name email")
    .populate("timeline.updatedBy", "name role")
    .populate("timeline.department", "name code")

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

  // Generate PDF report
  const format = req.query.format || "pdf"
  let filePath

  try {
    if (format === "pdf") {
      filePath = await generateComplaintReport(complaint)
    } else if (format === "json") {
      filePath = await exportToJSON(complaint, `complaint-${complaint.complaintId}`)
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported format. Supported formats: pdf, json",
      })
    }

    // Send file
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error("Download error:", err)
      }

      // Delete file after sending
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr)
        }
      })
    })
  } catch (error) {
    console.error("Report generation error:", error)
    return res.status(500).json({
      success: false,
      message: "Error generating report",
      error: error.message,
    })
  }
})

// @desc    Generate department report
// @route   GET /api/reports/departments/:id
// @access  Private (Admin, Supervisor)
export const getDepartmentReport = asyncHandler(async (req, res) => {
  // Check if department exists
  const department = await Department.findById(req.params.id).populate("head", "name email")

  if (!department) {
    return res.status(404).json({
      success: false,
      message: "Department not found",
    })
  }

  // Check if user has permission
  if (req.user.role === "supervisor" && req.user.department.toString() !== department._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this department's report",
    })
  }

  // Get time period from query
  const period = req.query.period || "month"
  const startDate = new Date()

  switch (period) {
    case "week":
      startDate.setDate(startDate.getDate() - 7)
      break
    case "month":
      startDate.setMonth(startDate.getMonth() - 1)
      break
    case "quarter":
      startDate.setMonth(startDate.getMonth() - 3)
      break
    case "year":
      startDate.setFullYear(startDate.getFullYear() - 1)
      break
    default:
      startDate.setMonth(startDate.getMonth() - 1) // Default to month
  }

  // Get complaints for this department in the specified period
  const complaints = await Complaint.find({
    "assignedTo.department": department._id,
    createdAt: { $gte: startDate },
  })
    .populate("citizen", "name")
    .sort("-createdAt")

  // Generate report
  const format = req.query.format || "pdf"
  let filePath

  try {
    if (format === "pdf") {
      filePath = await generateDepartmentReport(department, complaints, period)
    } else if (format === "csv") {
      // Prepare data for CSV export
      const fields = ["complaintId", "category", "status", "priority", "createdAt", "resolvedAt"]
      const data = complaints.map((complaint) => ({
        complaintId: complaint.complaintId,
        category: complaint.category,
        status: complaint.status,
        priority: complaint.priority,
        createdAt: complaint.createdAt,
        resolvedAt: complaint.resolvedAt || "",
      }))

      filePath = await exportToCSV(data, fields, `department-report-${department.code}`)
    } else if (format === "excel") {
      // Prepare data for Excel export
      const data = complaints.map((complaint) => ({
        "Complaint ID": complaint.complaintId,
        Category: complaint.category,
        Status: complaint.status,
        Priority: complaint.priority,
        "Created At": new Date(complaint.createdAt).toLocaleString(),
        "Resolved At": complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : "",
        Citizen: complaint.citizen ? complaint.citizen.name : "",
      }))

      filePath = await exportToExcel(data, `department-report-${department.code}`, "Complaints")
    } else if (format === "json") {
      filePath = await exportToJSON(
        {
          department,
          complaints,
          period,
          generatedAt: new Date(),
        },
        `department-report-${department.code}`,
      )
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported format. Supported formats: pdf, csv, excel, json",
      })
    }

    // Send file
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error("Download error:", err)
      }

      // Delete file after sending
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr)
        }
      })
    })
  } catch (error) {
    console.error("Report generation error:", error)
    return res.status(500).json({
      success: false,
      message: "Error generating report",
      error: error.message,
    })
  }
})

// @desc    Generate system report
// @route   GET /api/reports/system
// @access  Private (Admin)
export const getSystemReport = asyncHandler(async (req, res) => {
  // Only admins can access system reports
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access system reports",
    })
  }

  // Get time period from query
  const period = req.query.period || "month"
  const startDate = new Date()

  switch (period) {
    case "week":
      startDate.setDate(startDate.getDate() - 7)
      break
    case "month":
      startDate.setMonth(startDate.getMonth() - 1)
      break
    case "quarter":
      startDate.setMonth(startDate.getMonth() - 3)
      break
    case "year":
      startDate.setFullYear(startDate.getFullYear() - 1)
      break
    default:
      startDate.setMonth(startDate.getMonth() - 1) // Default to month
  }

  // Get system statistics
  const totalComplaints = await Complaint.countDocuments()
  const newComplaints = await Complaint.countDocuments({ createdAt: { $gte: startDate } })
  const resolvedComplaints = await Complaint.countDocuments({ status: "resolved" })
  const resolvedInPeriod = await Complaint.countDocuments({
    status: "resolved",
    resolvedAt: { $gte: startDate },
  })

  const totalUsers = await User.countDocuments()
  const newUsers = await User.countDocuments({ createdAt: { $gte: startDate } })
  const totalCitizens = await User.countDocuments({ role: "citizen" })
  const totalOfficers = await User.countDocuments({ role: "officer" })
  const totalSupervisors = await User.countDocuments({ role: "supervisor" })
  const totalAdmins = await User.countDocuments({ role: "admin" })

  const totalDepartments = await Department.countDocuments()

  // Get complaints by status
  const submittedComplaints = await Complaint.countDocuments({ status: "submitted" })
  const underReviewComplaints = await Complaint.countDocuments({ status: "under_review" })
  const inProgressComplaints = await Complaint.countDocuments({ status: "in_progress" })
  const reopenedComplaints = await Complaint.countDocuments({ status: "reopened" })

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

  // Prepare report data
  const reportData = {
    period,
    generatedAt: new Date(),
    complaints: {
      total: totalComplaints,
      new: newComplaints,
      resolved: resolvedComplaints,
      resolvedInPeriod,
      byStatus: {
        submitted: submittedComplaints,
        underReview: underReviewComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
        reopened: reopenedComplaints,
      },
      byCategory: complaintsByCategory,
      byDepartment: complaintsByDepartment,
    },
    users: {
      total: totalUsers,
      new: newUsers,
      byRole: {
        citizens: totalCitizens,
        officers: totalOfficers,
        supervisors: totalSupervisors,
        admins: totalAdmins,
      },
    },
    departments: {
      total: totalDepartments,
    },
  }

  // Generate report
  const format = req.query.format || "json"
  let filePath

  try {
    if (format === "csv") {
      // Flatten data for CSV
      const flatData = [
        { category: "Total Complaints", value: totalComplaints },
        { category: "New Complaints", value: newComplaints },
        { category: "Resolved Complaints", value: resolvedComplaints },
        { category: "Resolved In Period", value: resolvedInPeriod },
        { category: "Submitted Complaints", value: submittedComplaints },
        { category: "Under Review Complaints", value: underReviewComplaints },
        { category: "In Progress Complaints", value: inProgressComplaints },
        { category: "Reopened Complaints", value: reopenedComplaints },
        { category: "Total Users", value: totalUsers },
        { category: "New Users", value: newUsers },
        { category: "Total Citizens", value: totalCitizens },
        { category: "Total Officers", value: totalOfficers },
        { category: "Total Supervisors", value: totalSupervisors },
        { category: "Total Admins", value: totalAdmins },
        { category: "Total Departments", value: totalDepartments },
      ]

      filePath = await exportToCSV(flatData, ["category", "value"], `system-report-${Date.now()}`)
    } else if (format === "excel") {
      // Create workbook with multiple sheets
      const complaintsData = [
        { Category: "Total", Count: totalComplaints },
        { Category: "New", Count: newComplaints },
        { Category: "Resolved", Count: resolvedComplaints },
        { Category: "Resolved In Period", Count: resolvedInPeriod },
        { Category: "Submitted", Count: submittedComplaints },
        { Category: "Under Review", Count: underReviewComplaints },
        { Category: "In Progress", Count: inProgressComplaints },
        { Category: "Reopened", Count: reopenedComplaints },
      ]

      const usersData = [
        { Category: "Total", Count: totalUsers },
        { Category: "New", Count: newUsers },
        { Category: "Citizens", Count: totalCitizens },
        { Category: "Officers", Count: totalOfficers },
        { Category: "Supervisors", Count: totalSupervisors },
        { Category: "Admins", Count: totalAdmins },
      ]

      const categoryData = complaintsByCategory.map((item) => ({
        Category: item._id,
        Count: item.count,
      }))

      const departmentData = complaintsByDepartment.map((item) => ({
        Department: item.name || "Unknown",
        Count: item.count,
      }))

      // Export to Excel with multiple sheets
      filePath = await exportToExcel(
        {
          Complaints: complaintsData,
          Users: usersData,
          Categories: categoryData,
          Departments: departmentData,
        },
        `system-report-${Date.now()}`,
      )
    } else if (format === "json") {
      filePath = await exportToJSON(reportData, `system-report-${Date.now()}`)
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported format. Supported formats: csv, excel, json",
      })
    }

    // Send file
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error("Download error:", err)
      }

      // Delete file after sending
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr)
        }
      })
    })
  } catch (error) {
    console.error("Report generation error:", error)
    return res.status(500).json({
      success: false,
      message: "Error generating report",
      error: error.message,
    })
  }
})

