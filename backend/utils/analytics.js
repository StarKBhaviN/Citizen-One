export const calculateResolutionRate = (resolved, total) => {
  if (total === 0) return 0
  return (resolved / total) * 100
}

/**
 * Calculate average resolution time in days
 * @param {Array} complaints - Array of resolved complaints with createdAt and resolvedAt
 * @returns {number} - Average resolution time in days
 */
export const calculateAverageResolutionTime = (complaints) => {
  if (!complaints || complaints.length === 0) return 0

  const totalTime = complaints.reduce((sum, complaint) => {
    if (!complaint.createdAt || !complaint.resolvedAt) return sum

    const createdDate = new Date(complaint.createdAt)
    const resolvedDate = new Date(complaint.resolvedAt)
    const timeDiff = resolvedDate - createdDate

    // Convert milliseconds to days
    const days = timeDiff / (1000 * 60 * 60 * 24)
    return sum + days
  }, 0)

  return totalTime / complaints.length
}

/**
 * Calculate complaint distribution by category
 * @param {Array} complaints - Array of complaints
 * @returns {Object} - Distribution by category
 */
export const calculateCategoryDistribution = (complaints) => {
  if (!complaints || complaints.length === 0) return {}

  return complaints.reduce((distribution, complaint) => {
    const category = complaint.category
    distribution[category] = (distribution[category] || 0) + 1
    return distribution
  }, {})
}

/**
 * Calculate complaint distribution by status
 * @param {Array} complaints - Array of complaints
 * @returns {Object} - Distribution by status
 */
export const calculateStatusDistribution = (complaints) => {
  if (!complaints || complaints.length === 0) return {}

  return complaints.reduce((distribution, complaint) => {
    const status = complaint.status
    distribution[status] = (distribution[status] || 0) + 1
    return distribution
  }, {})
}

/**
 * Calculate complaint distribution by department
 * @param {Array} complaints - Array of complaints with populated department
 * @returns {Object} - Distribution by department
 */
export const calculateDepartmentDistribution = (complaints) => {
  if (!complaints || complaints.length === 0) return {}

  return complaints.reduce((distribution, complaint) => {
    if (!complaint.assignedTo || !complaint.assignedTo.department) return distribution

    const departmentId =
      typeof complaint.assignedTo.department === "object"
        ? complaint.assignedTo.department._id.toString()
        : complaint.assignedTo.department.toString()

    const departmentName =
      typeof complaint.assignedTo.department === "object" ? complaint.assignedTo.department.name : "Unknown Department"

    if (!distribution[departmentId]) {
      distribution[departmentId] = {
        name: departmentName,
        count: 0,
      }
    }

    distribution[departmentId].count++
    return distribution
  }, {})
}

/**
 * Calculate feedback statistics
 * @param {Array} complaints - Array of complaints with feedback
 * @returns {Object} - Feedback statistics
 */
export const calculateFeedbackStats = (complaints) => {
  if (!complaints || complaints.length === 0)
    return {
      averageRating: 0,
      totalFeedback: 0,
      ratingDistribution: {},
    }

  const complaintsWithFeedback = complaints.filter((complaint) => complaint.feedback && complaint.feedback.rating)

  if (complaintsWithFeedback.length === 0)
    return {
      averageRating: 0,
      totalFeedback: 0,
      ratingDistribution: {},
    }

  const totalRating = complaintsWithFeedback.reduce((sum, complaint) => sum + complaint.feedback.rating, 0)

  const ratingDistribution = complaintsWithFeedback.reduce((distribution, complaint) => {
    const rating = complaint.feedback.rating
    distribution[rating] = (distribution[rating] || 0) + 1
    return distribution
  }, {})

  return {
    averageRating: totalRating / complaintsWithFeedback.length,
    totalFeedback: complaintsWithFeedback.length,
    ratingDistribution,
  }
}

