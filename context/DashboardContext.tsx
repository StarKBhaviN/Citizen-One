"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { dashboardAPI } from '../lib/api';
import { useAuth } from './AuthContext';

// Define types for different dashboard stats based on the API responses
type StatusCounts = {
  submitted: number;
  underReview: number;
  inProgress: number;
  resolved: number;
};

type CategoryCount = {
  _id: string;
  count: number;
};

type ResolutionTimeStats = {
  averageResolutionTime: number;
  minResolutionTime: number;
  maxResolutionTime: number;
};

type RecentComplaint = {
  _id: string;
  complaintId: string;
  category: string;
  status: string;
  createdAt: string;
  assignedTo?: {
    department?: {
      _id: string;
      name: string;
    };
    officer?: {
      _id: string;
      name: string;
    };
  };
  citizen?: {
    _id: string;
    name: string;
  };
};

type PendingFeedback = {
  _id: string;
  complaintId: string;
  category: string;
  resolvedAt: string;
};

// Citizen Dashboard Stats
type CitizenStats = {
  totalComplaints: number;
  statusCounts: StatusCounts;
  complaintsByCategory: CategoryCount[];
  recentComplaints: RecentComplaint[];
  pendingFeedback: PendingFeedback[];
};

// Admin Dashboard Stats
type AdminStats = {
  counts: {
    totalComplaints: number;
    totalUsers: number;
    totalCitizens: number;
    totalOfficers: number;
    totalDepartments: number;
  };
  statusCounts: StatusCounts;
  complaintsByCategory: CategoryCount[];
  complaintsByDepartment: {
    _id: string;
    count: number;
    name: string;
  }[];
  recentComplaints: RecentComplaint[];
  resolutionTimeStats: ResolutionTimeStats[];
  userRegistrationStats: {
    _id: {
      month: number;
      year: number;
    };
    count: number;
  }[];
};

// Department Dashboard Stats
type DepartmentStats = {
  totalComplaints: number;
  statusCounts: StatusCounts;
  complaintsByCategory: CategoryCount[];
  complaintsByOfficer: {
    _id: string;
    count: number;
    name: string;
  }[];
  recentComplaints: RecentComplaint[];
  highPriorityComplaints: RecentComplaint[];
  resolutionTimeStats: ResolutionTimeStats;
  feedbackStats: {
    averageRating: number;
    count: number;
  };
};

type DashboardContextType = {
  citizenStats: CitizenStats | null;
  adminStats: AdminStats | null;
  departmentStats: DepartmentStats | null;
  loading: boolean;
  error: string | null;
  getCitizenStats: () => Promise<void>;
  getAdminStats: () => Promise<void>;
  getDepartmentStats: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  clearError: () => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [citizenStats, setCitizenStats] = useState<CitizenStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load appropriate stats based on user role
  useEffect(() => {
    if (user) {
      refreshDashboard();
    }
  }, [user]);

  const getCitizenStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardAPI.getCitizenStats();
      setCitizenStats(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch citizen dashboard stats');
      console.error('Error fetching citizen stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAdminStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardAPI.getAdminStats();
      setAdminStats(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch admin dashboard stats');
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardAPI.getDepartmentStats();
      setDepartmentStats(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch department dashboard stats');
      console.error('Error fetching department stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    if (!user) return;
    
    setError(null);
    
    try {
      // Fetch data based on user role
      if (user.role === 'admin') {
        await getAdminStats();
      } else if (user.role === 'supervisor' || user.role === 'officer') {
        await getDepartmentStats();
      } else if (user.role === 'citizen') {
        await getCitizenStats();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to refresh dashboard');
      console.error('Error refreshing dashboard:', err);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    citizenStats,
    adminStats,
    departmentStats,
    loading,
    error,
    getCitizenStats,
    getAdminStats,
    getDepartmentStats,
    refreshDashboard,
    clearError,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};