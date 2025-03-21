import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/User.js"
import Department from "../models/Department.js"
import Complaint from "../models/Complaint.js"
import Notification from "../models/Notification.js"
import Conversation from "../models/Conversation.js"
import Message from "../models/Message.js"

// Load env vars
dotenv.config()

// Connect to DB
mongoose.connect(process.env.MONGODB_URI)

// Seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany()
    await Department.deleteMany()
    await Complaint.deleteMany()
    await Notification.deleteMany()
    await Conversation.deleteMany()
    await Message.deleteMany()

    console.log("Data cleared...")

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
      status: "active",
    })

    console.log("Admin user created...")

    // Create departments
    const waterDept = await Department.create({
      name: "Water Department",
      code: "WATER",
      description: "Responsible for water supply and related issues",
      contactEmail: "water@example.com",
      contactPhone: "123-456-7890",
      status: "active",
      categories: ["water"],
    })

    const electricityDept = await Department.create({
      name: "Electricity Department",
      code: "ELEC",
      description: "Responsible for electricity supply and related issues",
      contactEmail: "electricity@example.com",
      contactPhone: "123-456-7891",
      status: "active",
      categories: ["electricity"],
    })

    const roadsDept = await Department.create({
      name: "Roads Department",
      code: "ROADS",
      description: "Responsible for road maintenance and related issues",
      contactEmail: "roads@example.com",
      contactPhone: "123-456-7892",
      status: "active",
      categories: ["roads"],
    })

    const sanitationDept = await Department.create({
      name: "Sanitation Department",
      code: "SANIT",
      description: "Responsible for sanitation and waste management",
      contactEmail: "sanitation@example.com",
      contactPhone: "123-456-7893",
      status: "active",
      categories: ["sanitation"],
    })

    console.log("Departments created...")

    // Create department supervisors
    const waterSupervisor = await User.create({
      name: "Water Supervisor",
      email: "water.supervisor@example.com",
      password: "password123",
      role: "supervisor",
      department: waterDept._id,
      status: "active",
    })

    const electricitySupervisor = await User.create({
      name: "Electricity Supervisor",
      email: "electricity.supervisor@example.com",
      password: "password123",
      role: "supervisor",
      department: electricityDept._id,
      status: "active",
    })

    const roadsSupervisor = await User.create({
      name: "Roads Supervisor",
      email: "roads.supervisor@example.com",
      password: "password123",
      role: "supervisor",
      department: roadsDept._id,
      status: "active",
    })

    const sanitationSupervisor = await User.create({
      name: "Sanitation Supervisor",
      email: "sanitation.supervisor@example.com",
      password: "password123",
      role: "supervisor",
      department: sanitationDept._id,
      status: "active",
    })

    console.log("Department supervisors created...")

    // Update departments with supervisors
    await Department.findByIdAndUpdate(waterDept._id, { head: waterSupervisor._id })
    await Department.findByIdAndUpdate(electricityDept._id, { head: electricitySupervisor._id })
    await Department.findByIdAndUpdate(roadsDept._id, { head: roadsSupervisor._id })
    await Department.findByIdAndUpdate(sanitationDept._id, { head: sanitationSupervisor._id })

    // Create department officers
    const waterOfficer1 = await User.create({
      name: "Water Officer 1",
      email: "water.officer1@example.com",
      password: "password123",
      role: "officer",
      department: waterDept._id,
      status: "active",
    })

    const waterOfficer2 = await User.create({
      name: "Water Officer 2",
      email: "water.officer2@example.com",
      password: "password123",
      role: "officer",
      department: waterDept._id,
      status: "active",
    })

    const electricityOfficer = await User.create({
      name: "Electricity Officer",
      email: "electricity.officer@example.com",
      password: "password123",
      role: "officer",
      department: electricityDept._id,
      status: "active",
    })

    const roadsOfficer = await User.create({
      name: "Roads Officer",
      email: "roads.officer@example.com",
      password: "password123",
      role: "officer",
      department: roadsDept._id,
      status: "active",
    })

    const sanitationOfficer = await User.create({
      name: "Sanitation Officer",
      email: "sanitation.officer@example.com",
      password: "password123",
      role: "officer",
      department: sanitationDept._id,
      status: "active",
    })

    console.log("Department officers created...")

    // Create citizens
    const citizen1 = await User.create({
      name: "John Smith",
      email: "john.smith@example.com",
      password: "password123",
      phone: "9876543210",
      address: {
        street: "123 Main Street",
        city: "Metropolis",
        state: "State",
        zipCode: "12345",
      },
      role: "citizen",
      status: "active",
    })

    const citizen2 = await User.create({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password123",
      phone: "9876543211",
      address: {
        street: "456 Park Avenue",
        city: "Metropolis",
        state: "State",
        zipCode: "12345",
      },
      role: "citizen",
      status: "active",
    })

    const citizen3 = await User.create({
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      password: "password123",
      phone: "9876543212",
      address: {
        street: "789 Oak Street",
        city: "Metropolis",
        state: "State",
        zipCode: "12345",
      },
      role: "citizen",
      status: "active",
    })

    console.log("Citizens created...")

    // Create complaints
    const waterComplaint = await Complaint.create({
      complaintId: "CMP-23-01-0001",
      citizen: citizen1._id,
      category: "water",
      description: "Water supply has been disrupted in my area for the past 3 days.",
      location: "123 Main Street, Sector 7",
      status: "in_progress",
      priority: "medium",
      assignedTo: {
        department: waterDept._id,
        officer: waterOfficer1._id,
      },
      timeline: [
        {
          status: "submitted",
          description: "Complaint submitted successfully",
          timestamp: new Date("2023-01-10T10:30:00Z"),
          updatedBy: citizen1._id,
        },
        {
          status: "under_review",
          description: "Complaint assigned to Water Department",
          timestamp: new Date("2023-01-10T14:45:00Z"),
          updatedBy: admin._id,
          department: waterDept._id,
        },
        {
          status: "in_progress",
          description: "Water Department team dispatched to the location",
          timestamp: new Date("2023-01-11T09:15:00Z"),
          updatedBy: waterSupervisor._id,
          department: waterDept._id,
        },
      ],
      estimatedResolutionDate: new Date("2023-01-13T18:00:00Z"),
    })

    const electricityComplaint = await Complaint.create({
      complaintId: "CMP-23-01-0002",
      citizen: citizen2._id,
      category: "electricity",
      description: "Frequent power outages in our neighborhood.",
      location: "456 Park Avenue, Sector 9",
      status: "submitted",
      priority: "high",
      assignedTo: {
        department: electricityDept._id,
      },
      timeline: [
        {
          status: "submitted",
          description: "Complaint submitted successfully",
          timestamp: new Date("2023-01-12T14:20:00Z"),
          updatedBy: citizen2._id,
        },
      ],
      estimatedResolutionDate: new Date("2023-01-15T18:00:00Z"),
    })

    const roadsComplaint = await Complaint.create({
      complaintId: "CMP-23-01-0003",
      citizen: citizen3._id,
      category: "roads",
      description: "Large pothole causing traffic issues and safety concerns.",
      location: "789 Oak Street, Sector 5",
      status: "under_review",
      priority: "medium",
      assignedTo: {
        department: roadsDept._id,
      },
      timeline: [
        {
          status: "submitted",
          description: "Complaint submitted successfully",
          timestamp: new Date("2023-01-11T09:45:00Z"),
          updatedBy: citizen3._id,
        },
        {
          status: "under_review",
          description: "Complaint assigned to Roads Department",
          timestamp: new Date("2023-01-11T11:30:00Z"),
          updatedBy: admin._id,
          department: roadsDept._id,
        },
      ],
      estimatedResolutionDate: new Date("2023-01-14T18:00:00Z"),
    })

    const sanitationComplaint = await Complaint.create({
      complaintId: "CMP-23-01-0004",
      citizen: citizen1._id,
      category: "sanitation",
      description: "Garbage not collected for over a week.",
      location: "123 Main Street, Sector 7",
      status: "resolved",
      priority: "low",
      assignedTo: {
        department: sanitationDept._id,
        officer: sanitationOfficer._id,
      },
      timeline: [
        {
          status: "submitted",
          description: "Complaint submitted successfully",
          timestamp: new Date("2023-01-09T16:15:00Z"),
          updatedBy: citizen1._id,
        },
        {
          status: "under_review",
          description: "Complaint assigned to Sanitation Department",
          timestamp: new Date("2023-01-09T17:30:00Z"),
          updatedBy: admin._id,
          department: sanitationDept._id,
        },
        {
          status: "in_progress",
          description: "Sanitation team scheduled for cleanup",
          timestamp: new Date("2023-01-10T09:00:00Z"),
          updatedBy: sanitationSupervisor._id,
          department: sanitationDept._id,
        },
        {
          status: "resolved",
          description: "Garbage collected and area cleaned",
          timestamp: new Date("2023-01-10T13:45:00Z"),
          updatedBy: sanitationOfficer._id,
          department: sanitationDept._id,
        },
      ],
      resolvedAt: new Date("2023-01-10T13:45:00Z"),
      feedback: {
        rating: 4,
        comment: "Issue was resolved promptly, but would have appreciated more communication.",
        submittedAt: new Date("2023-01-11T10:00:00Z"),
      },
    })

    console.log("Complaints created...")

    // Create conversations and messages
    const waterConversation = await Conversation.create({
      participants: [citizen1._id, waterSupervisor._id, waterOfficer1._id],
      complaint: waterComplaint._id,
      isGroupChat: true,
      name: "Water Supply Issue",
      unreadCount: new Map([
        [citizen1._id.toString(), 0],
        [waterSupervisor._id.toString(), 0],
        [waterOfficer1._id.toString(), 0],
      ]),
    })

    const waterMessage1 = await Message.create({
      conversation: waterConversation._id,
      sender: citizen1._id,
      content: "Hello, I submitted a complaint about water supply disruption in my area. It's been 3 days now.",
      readBy: [{ user: citizen1._id }],
    })

    const waterMessage2 = await Message.create({
      conversation: waterConversation._id,
      sender: waterSupervisor._id,
      content:
        "Hello John, thank you for reaching out. I can see that your complaint has been assigned to our department. Let me check the current status for you.",
      readBy: [{ user: waterSupervisor._id }],
    })

    const waterMessage3 = await Message.create({
      conversation: waterConversation._id,
      sender: waterSupervisor._id,
      content:
        "I've checked with our team, and they've been dispatched to your location today. They should arrive within the next 2-3 hours to assess the situation.",
      readBy: [{ user: waterSupervisor._id }],
    })

    // Update conversation's lastMessage
    waterConversation.lastMessage = waterMessage3._id
    await waterConversation.save()

    console.log("Conversations and messages created...")

    // Create notifications
    await Notification.create({
      recipient: citizen1._id,
      type: "complaint_status",
      title: "Complaint Status Updated",
      message: `Your complaint (${waterComplaint.complaintId}) has been updated to "In Progress".`,
      relatedTo: {
        model: "Complaint",
        id: waterComplaint._id,
      },
    })

    await Notification.create({
      recipient: citizen1._id,
      type: "new_message",
      title: "New Message",
      message: "You have a new message from Water Department.",
      relatedTo: {
        model: "Message",
        id: waterMessage2._id,
      },
    })

    await Notification.create({
      recipient: waterSupervisor._id,
      type: "complaint_status",
      title: "New Complaint Assigned",
      message: `A new complaint (${waterComplaint.complaintId}) has been assigned to your department.`,
      relatedTo: {
        model: "Complaint",
        id: waterComplaint._id,
      },
    })

    console.log("Notifications created...")

    console.log("Database seeded successfully!")
    process.exit()
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()

