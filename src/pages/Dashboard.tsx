
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FolderTree, 
  MapPin, 
  Users, 
  Database, 
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockDataService } from '../services/mockDataService';
import { ApprovalRequest } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    categories: 0,
    geographies: 0,
    users: 0,
    entities: 0,
    pendingApprovals: 0,
    approvedToday: 0,
    rejectedToday: 0,
  });
  
  const [recentApprovals, setRecentApprovals] = useState<ApprovalRequest[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [categories, geographies, users, entities, approvals] = await Promise.all([
          mockDataService.getCategories(),
          mockDataService.getGeographies(),
          mockDataService.getUsers(),
          mockDataService.getEntities(),
          mockDataService.getApprovalRequests(),
        ]);

        const today = new Date().toDateString();
        const approvedToday = approvals.filter(
          a => a.status === 'Approved' && new Date(a.createdDate).toDateString() === today
        ).length;
        const rejectedToday = approvals.filter(
          a => a.status === 'Rejected' && new Date(a.createdDate).toDateString() === today
        ).length;

        setStats({
          categories: categories.length,
          geographies: geographies.length,
          users: users.length,
          entities: entities.length,
          pendingApprovals: approvals.filter(a => a.status === 'Pending').length,
          approvedToday,
          rejectedToday,
        });

        setRecentApprovals(approvals.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const handleApprovalClick = (entityType: string) => {
    // Navigate to specific entity page or approvals page
    const routeMap: Record<string, string> = {
      'Category': '/categories',
      'Geography': '/geographies',
      'User': '/users',
      'Entity': '/entities',
      'Product': '/entities',
      'Role': '/roles',
      'Attribute': '/attributes',
    };
    
    const route = routeMap[entityType] || '/approvals';
    navigate(route);
  };

  const statCards = [
    {
      title: 'Categories',
      value: stats.categories,
      icon: FolderTree,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/categories',
      description: 'Manage category hierarchy'
    },
    {
      title: 'Geographies',
      value: stats.geographies,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/geographies',
      description: 'Manage geographical locations'
    },
    {
      title: 'Users',
      value: stats.users,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/users',
      description: 'User management & roles'
    },
    {
      title: 'Entities',
      value: stats.entities,
      icon: ClipboardList,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/entities',
      description: 'Business entity management'
    },
  ];

  const approvalCards = [
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      route: '/approvals',
      description: 'Items awaiting approval'
    },
    {
      title: 'Approved Today',
      value: stats.approvedToday,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/approvals',
      description: 'Successfully approved items'
    },
    {
      title: 'Rejected Today',
      value: stats.rejectedToday,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      route: '/approvals',
      description: 'Items rejected today'
    },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'Pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Master Data Management System Overview - Click any widget for details</p>
      </div>

      {/* Stats Cards - All Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.title} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-gray-50"
              onClick={() => handleCardClick(card.route)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-md ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                <div className="flex items-center mt-2 text-xs text-blue-600">
                  <span>View details</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Approval Overview - All Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {approvalCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.title}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-gray-50"
              onClick={() => handleCardClick(card.route)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-md ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                <div className="flex items-center mt-2 text-xs text-blue-600">
                  <span>Drill down</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Approvals - Enhanced with Drill-down */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Approval Requests</CardTitle>
            <CardDescription>Latest approval activities in the system - Click for details</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/approvals')}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {recentApprovals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No recent approval requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApprovals.map((approval) => (
                <div 
                  key={approval.id} 
                  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleApprovalClick(approval.entityType)}
                >
                  <div className="flex items-center space-x-4">
                    <Database className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{approval.entityType}</p>
                      <p className="text-sm text-gray-500">
                        Requested by {approval.requestedBy}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(approval.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusBadgeVariant(approval.status)}>
                      {approval.status}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
