import mongoose from "mongoose"

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["water", "electricity", "roads", "sanitation", "public_services", "other"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["submitted", "under_review", "in_progress", "resolved", "reopened"],
      default: "submitted",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignedTo: {
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
      officer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    timeline: [
      {
        status: {
          type: String,
          enum: ["submitted", "under_review", "in_progress", "resolved", "reopened"],
        },
        description: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        department: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Department",
        },
      },
    ],
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      submittedAt: Date,
    },
    estimatedResolutionDate: Date,
    resolvedAt: Date,
  },
  {
    timestamps: true,
  },
)

// Generate a unique complaint ID before saving
complaintSchema.pre("save", async function (next) {
  if (this.isNew) {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")

    // Get the count of complaints for the current month
    const count = await mongoose.model("Complaint").countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
      },
    })

    // Generate complaint ID: CMP-YY-MM-XXXX (e.g., CMP-23-05-0001)
    this.complaintId = `CMP-${year}-${month}-${(count + 1).toString().padStart(4, "0")}`
  }
  next()
})

const Complaint = mongoose.model("Complaint", complaintSchema)

export default Complaint

