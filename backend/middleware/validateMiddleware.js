import { asyncHandler } from "./asyncHandler.js"

// Validation middleware factory
export const validate = (schema) =>
  asyncHandler(async (req, res, next) => {
    try {
      // Validate request body against schema
      await schema.validateAsync(req.body, { abortEarly: false })
      next()
    } catch (error) {
      // Format validation errors
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message.replace(/['"]/g, "")
        return acc
      }, {})

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      })
    }
  })

// Validate query parameters
export const validateQuery = (schema) =>
  asyncHandler(async (req, res, next) => {
    try {
      // Validate request query against schema
      await schema.validateAsync(req.query, { abortEarly: false })
      next()
    } catch (error) {
      // Format validation errors
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message.replace(/['"]/g, "")
        return acc
      }, {})

      return res.status(400).json({
        success: false,
        message: "Query validation failed",
        errors,
      })
    }
  })

// Validate URL parameters
export const validateParams = (schema) =>
  asyncHandler(async (req, res, next) => {
    try {
      // Validate request params against schema
      await schema.validateAsync(req.params, { abortEarly: false })
      next()
    } catch (error) {
      // Format validation errors
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message.replace(/['"]/g, "")
        return acc
      }, {})

      return res.status(400).json({
        success: false,
        message: "Parameter validation failed",
        errors,
      })
    }
  })

