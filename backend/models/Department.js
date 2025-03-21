import mongoose from "mongoose"

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Department code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    categories: [
      {
        type: String,
        enum: ["water", "electricity", "roads", "sanitation", "public_services", "other"],
      },
    ],
  },
  {
    timestamps: true,
  },
)

const Department = mongoose.model("Department", departmentSchema)

export default Department

