import React, { createContext, useState, useContext, ReactNode } from 'react';
import { usersAPI } from './api';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  // Add other user properties
};

type UsersContextType = {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  getUsers: (params?: any) => Promise<void>;
  getUser: (id: string) => Promise<void>;
  updateUser: (id: string, userData: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  changeRole: (id: string, role: string) => Promise<void>;
  changeStatus: (id: string, status: string) => Promise<void>;
  clearError: () => void;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.getUsers(params);
      setUsers(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.getUser(id);
      setCurrentUser(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.updateUser(id, userData);
      setCurrentUser(res.data.data);
      // Update the user in the list if they exist
      setUsers(users.map(u => u.id === id ? res.data.data : u));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await usersAPI.deleteUser(id);
      // Remove the user from the list
      setUsers(users.filter(u => u.id !== id));
      if (currentUser?.id === id) {
        setCurrentUser(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.changeRole(id, role);
      // Update the user in the list if they exist
      setUsers(users.map(u => u.id === id ? res.data.data : u));
      if (currentUser?.id === id) {
        setCurrentUser(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change user role');
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.changeStatus(id, status);
      // Update the user in the list if they exist
      setUsers(users.map(u => u.id === id ? res.data.data : u));
      if (currentUser?.id === id) {
        setCurrentUser(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change user status');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        currentUser,
        loading,
        error,
        getUsers,
        getUser,
        updateUser,
        deleteUser,
        changeRole,
        changeStatus,
        clearError,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
