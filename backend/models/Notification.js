import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["complaint_status", "new_message", "feedback_request", "assignment", "comment", "system"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedTo: {
      model: {
        type: String,
        enum: ["Complaint", "Message", "User"],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  {
    timestamps: true,
  },
)

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification

