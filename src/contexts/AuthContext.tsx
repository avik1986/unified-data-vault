
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUser: User = {
  id: '1',
  fullName: 'John Doe',
  email: 'john.doe@company.com',
  phoneNumber: '+1234567890',
  roleId: '1',
  department: 'Finance',
  geographyIds: ['1'],
  categoryIds: ['1'],
  userRole: 'Admin',
  status: 'Active',
  approvalStatus: 'Approved',
  createdBy: 'system',
  createdDate: '2024-01-01',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(defaultUser);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    if (email && password) {
      setCurrentUser(defaultUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasPermission = (action: string): boolean => {
    if (!currentUser) return false;
    
    const rolePermissions: Record<UserRole, string[]> = {
      Admin: ['create', 'edit', 'delete', 'approve', 'reject', 'view'],
      Checker: ['approve', 'reject', 'view'],
      Maker: ['create', 'edit', 'view'],
      Viewer: ['view']
    };

    return rolePermissions[currentUser.userRole]?.includes(action) || false;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
