"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { complaintsAPI } from '../lib/api';

// Define types
type Complaint = {
  id: string;
  title: string;
  description: string;
  status: string;
  trackingId: string;
  // Add other complaint properties
};

type ComplaintsContextType = {
  complaints: Complaint[];
  currentComplaint: Complaint | null;
  loading: boolean;
  error: string | null;
  getComplaints: (params?: any) => Promise<void>;
  getComplaint: (id: string) => Promise<void>;
  createComplaint: (complaintData: any) => Promise<any>;
  updateComplaint: (id: string, complaintData: any) => Promise<void>;
  trackComplaint: (trackingId: string) => Promise<any>;
  uploadAttachments: (id: string, files: File[]) => Promise<void>;
  deleteAttachment: (complaintId: string, attachmentId: string) => Promise<void>;
  clearError: () => void;
};

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

export const ComplaintsProvider = ({ children }: { children: ReactNode }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [currentComplaint, setCurrentComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintsAPI.getComplaints();
      setComplaints(res.data.data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch complaints');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getComplaint = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintsAPI.getComplaint(id);
      setCurrentComplaint(res.data.data);
      return res.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch complaint details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createComplaint = async (complaintData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintsAPI.createComplaint(complaintData);
      // Don't update the complaints list here as it might not be complete
      return res.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create complaint');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateComplaint = async (id: string, complaintData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintsAPI.updateComplaint(id, complaintData);
      setCurrentComplaint(res.data.data);
      // Update the complaint in the list if it exists
      setComplaints(complaints.map(c => c.id === id ? res.data.data : c));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update complaint');
    } finally {
      setLoading(false);
    }
  };

  const trackComplaint = async (trackingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintsAPI.trackComplaint(trackingId);
      return res.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to track complaint');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadAttachments = async (id: string, files: File[]) => {
    setLoading(true);
    setError(null);
    try {
      await complaintsAPI.uploadAttachments(id, files);
      // Refresh the complaint to get updated attachments
      await getComplaint(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload attachments');
    } finally {
      setLoading(false);
    }
  };

  const deleteAttachment = async (complaintId: string, attachmentId: string) => {
    setLoading(true);
    setError(null);
    try {
      await complaintsAPI.deleteAttachment(complaintId, attachmentId);
      // Refresh the complaint to get updated attachments
      await getComplaint(complaintId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete attachment');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ComplaintsContext.Provider
      value={{
        complaints,
        currentComplaint,
        loading,
        error,
        getComplaints,
        getComplaint,
        createComplaint,
        updateComplaint,
        trackComplaint,
        uploadAttachments,
        deleteAttachment,
        clearError,
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintsContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintsProvider');
  }
  return context;
};
