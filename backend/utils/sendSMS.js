import twilio from "twilio"
import dotenv from "dotenv"

dotenv.config()

// Initialize Twilio client
const client =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null

/**
 * Send SMS notification
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} message - SMS message content
 * @returns {Promise} - Resolves with message details or error
 */
const sendSMS = async (to, message) => {
  // Check if Twilio is configured
  if (!client) {
    console.log("Twilio not configured. SMS would have been sent to:", to, "Message:", message)
    return { success: false, message: "SMS service not configured" }
  }

  try {
    // Send SMS via Twilio
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    })

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
    }
  } catch (error) {
    console.error("SMS sending error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export default sendSMS

