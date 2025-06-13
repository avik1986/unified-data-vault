
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  FolderTree, 
  MapPin, 
  UserCheck, 
  Settings, 
  Database,
  ClipboardList,
  BarChart3,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/categories', label: 'Categories', icon: FolderTree },
    { path: '/geographies', label: 'Geographies', icon: MapPin },
    { path: '/roles', label: 'Roles', icon: UserCheck },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/attributes', label: 'Attributes', icon: Database },
    { path: '/entities', label: 'Entities', icon: ClipboardList },
    { path: '/approval-rules', label: 'Approval Rules', icon: Settings },
    { path: '/approvals', label: 'Approvals', icon: BarChart3 },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">MDM System</h1>
        <p className="text-sm text-slate-300 mt-1">{currentUser?.fullName}</p>
        <p className="text-xs text-slate-400">{currentUser?.userRole}</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={logout}
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
