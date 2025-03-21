export const errorHandler = (err, req, res, next) => {
  console.error(err)

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message || "Server Error"

  // Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404
    message = "Resource not found"
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400
    message = "Duplicate field value entered"

    // Extract the duplicate field
    const field = Object.keys(err.keyValue)[0]
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400
    const errors = Object.values(err.errors).map((val) => val.message)
    message = errors.join(", ")
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401
    message = "Invalid token"
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401
    message = "Token expired"
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  })
}

