import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
})

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if not already there
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  register: (userData: any) => api.post("/auth/register", userData),
  login: (credentials: any) => api.post("/auth/login", credentials),
  logout: () => api.get("/auth/logout"),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (userData: any) => api.put("/auth/updatedetails", userData),
  updatePassword: (passwordData: any) => api.put("/auth/updatepassword", passwordData),
  forgotPassword: (email: any) => api.post("/auth/forgotpassword", { email }),
  resetPassword: (token: any, password: any) => api.put(`/auth/resetpassword/${token}`, { password }),
  getAllUser: () => api.get("/auth/allUser")
}

// Complaints API
export const complaintsAPI = {
  getComplaints: (params: any) => api.get("/complaints", { params }),
  getComplaint: (id: any) => api.get(`/complaints/${id}`),
  createComplaint: (complaintData: { [x: string]: string | Blob; attachments?: any }) => {
    // Handle form data with files
    const formData = new FormData()

    // Add text fields
    Object.keys(complaintData).forEach((key) => {
      if (key !== "attachments") {
        formData.append(key, complaintData[key])
      }
    })

    // Add attachments
    if (complaintData.attachments && complaintData.attachments.length > 0) {
      complaintData.attachments.forEach((file: string | Blob) => {
        formData.append("attachments", file)
      })
    }

    return api.post("/complaints", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  updateComplaint: (id: any, complaintData: any) => api.put(`/complaints/${id}`, complaintData),
  trackComplaint: (complaintId: any) => api.get(`/complaints/track/${complaintId}`),
  uploadAttachments: (id: any, files: any[]) => {
    const formData = new FormData()
    files.forEach((file: string | Blob) => {
      formData.append("attachments", file)
    })

    return api.put(`/complaints/${id}/attachments`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  deleteAttachment: (complaintId: any, attachmentId: any) => api.delete(`/complaints/${complaintId}/attachments/${attachmentId}`),
}

// Users API
export const usersAPI = {
  getUsers: (params: any) => api.get("/users", { params }),
  getUser: (id: any) => api.get(`/users/${id}`),
  updateUser: (id: any, userData: any) => api.put(`/users/${id}`, userData),
  deleteUser: (id: any) => api.delete(`/users/${id}`),
  changeRole: (id: any, role: any) => api.put(`/users/${id}/role`, { role }),
  changeStatus: (id: any, status: any) => api.put(`/users/${id}/status`, { status }),
}

// Departments API
export const departmentsAPI = {
  getDepartments: () => api.get("/departments"),
  getDepartment: (id: any) => api.get(`/departments/${id}`),
  createDepartment: (departmentData: any) => api.post("/departments", departmentData),
  updateDepartment: (id: any, departmentData: any) => api.put(`/departments/${id}`, departmentData),
  deleteDepartment: (id: any) => api.delete(`/departments/${id}`),
}

// Messages API
export const messagesAPI = {
  getConversations: () => api.get("/messages/conversations"),
  getConversation: (id: any) => api.get(`/messages/conversations/${id}`),
  createConversation: (conversationData: any) => api.post("/messages/conversations", conversationData),
  getMessages: (conversationId: any) => api.get(`/messages/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: any, messageData: any) =>
    api.post(`/messages/conversations/${conversationId}/messages`, messageData),
  markAsRead: (conversationId: any) => api.put(`/messages/conversations/${conversationId}/read`),
}

// Dashboard API
export const dashboardAPI = {
  getCitizenStats: () => api.get("/dashboard/citizen"),
  getAdminStats: () => api.get("/dashboard/admin"),
  getDepartmentStats: () => api.get("/dashboard/department"),
}

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (id: any) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
}

export default api

