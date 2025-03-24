import React, { createContext, useState, useContext, ReactNode } from 'react';
import { departmentsAPI } from './api';

// Define types
type Department = {
  id: string;
  name: string;
  description: string;
  // Add other department properties
};

type DepartmentsContextType = {
  departments: Department[];
  currentDepartment: Department | null;
  loading: boolean;
  error: string | null;
  getDepartments: () => Promise<void>;
  getDepartment: (id: string) => Promise<void>;
  createDepartment: (departmentData: any) => Promise<void>;
  updateDepartment: (id: string, departmentData: any) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  clearError: () => void;
};

const DepartmentsContext = createContext<DepartmentsContextType | undefined>(undefined);

export const DepartmentsProvider = ({ children }: { children: ReactNode }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await departmentsAPI.getDepartments();
      setDepartments(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const getDepartment = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await departmentsAPI.getDepartment(id);
      setCurrentDepartment(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch department details');
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (departmentData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await departmentsAPI.createDepartment(departmentData);
      setDepartments([...departments, res.data.data]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create department');
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (id: string, departmentData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await departmentsAPI.updateDepartment(id, departmentData);
      setCurrentDepartment(res.data.data);
      // Update the department in the list if it exists
      setDepartments(departments.map(d => d.id === id ? res.data.data : d));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update department');
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await departmentsAPI.deleteDepartment(id);
      // Remove the department from the list
      setDepartments(departments.filter(d => d.id !== id));
      if (currentDepartment?.id === id) {
        setCurrentDepartment(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete department');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <DepartmentsContext.Provider
      value={{
        departments,
        currentDepartment,
        loading,
        error,
        getDepartments,
        getDepartment,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        clearError,
      }}
    >
      {children}
    </DepartmentsContext.Provider>
  );
};

export const useDepartments = () => {
  const context = useContext(DepartmentsContext);
  if (context === undefined) {
    throw new Error('useDepartments must be used within a DepartmentsProvider');
  }
  return context;
};
