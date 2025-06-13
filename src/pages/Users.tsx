
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import { mockDataService } from '../services/mockDataService';
import { User, Role, Geography, Category } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [geographies, setGeographies] = useState<Geography[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const { toast } = useToast();
  const { currentUser, hasPermission } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData, geographiesData, categoriesData] = await Promise.all([
        mockDataService.getUsers(),
        mockDataService.getRoles(),
        mockDataService.getGeographies(),
        mockDataService.getCategories(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setGeographies(geographiesData);
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowDialog(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowDialog(true);
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await mockDataService.deleteUser(user.id, currentUser?.id || 'unknown');
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleSubmitForApproval = async (user: User) => {
    try {
      await mockDataService.submitForApproval(
        'User',
        user.id,
        currentUser?.id || 'unknown',
        user
      );
      toast({
        title: "Success",
        description: "User submitted for approval",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit for approval",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (user: User) => {
    try {
      await mockDataService.updateUser(user.id, {
        approvalStatus: 'Approved',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "User approved successfully",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (user: User) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await mockDataService.updateUser(user.id, {
        approvalStatus: 'Rejected',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "User rejected",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setFormLoading(true);
      
      const selectedRole = roles.find(r => r.id === formData.roleId);
      
      if (editingUser) {
        await mockDataService.updateUser(editingUser.id, {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          roleId: formData.roleId,
          department: selectedRole?.department || '',
          geographyIds: formData.geographyIds === 'empty' ? [] : [formData.geographyIds],
          categoryIds: formData.categoryIds === 'empty' ? [] : [formData.categoryIds],
          userRole: formData.userRole,
          modifiedBy: currentUser?.id || 'unknown',
          modifiedDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        await mockDataService.createUser({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          roleId: formData.roleId,
          department: selectedRole?.department || '',
          geographyIds: formData.geographyIds === 'empty' ? [] : [formData.geographyIds],
          categoryIds: formData.categoryIds === 'empty' ? [] : [formData.categoryIds],
          userRole: formData.userRole,
          status: 'Active',
          approvalStatus: 'Pending',
          createdBy: currentUser?.id || 'unknown',
          createdDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }
      
      setShowDialog(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingUser ? 'update' : 'create'} user`,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { 
      key: 'roleId', 
      label: 'Role',
      render: (roleId: string) => {
        const role = roles.find(r => r.id === roleId);
        return role?.name || 'Unknown';
      }
    },
    { key: 'department', label: 'Department' },
    { key: 'userRole', label: 'User Role' },
    { key: 'status', label: 'Status' },
    { key: 'approvalStatus', label: 'Approval Status' },
    { 
      key: 'createdDate', 
      label: 'Created Date',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
  ];

  const formFields = [
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text' as const,
      required: true,
      value: editingUser?.fullName || '',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      value: editingUser?.email || '',
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'tel' as const,
      required: true,
      value: editingUser?.phoneNumber || '',
    },
    {
      name: 'roleId',
      label: 'Role',
      type: 'select' as const,
      required: true,
      options: roles.map(role => ({ value: role.id, label: `${role.name} (${role.department})` })),
      value: editingUser?.roleId || (roles.length > 0 ? roles[0].id : ''),
    },
    {
      name: 'userRole',
      label: 'User Role',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Maker', label: 'Maker' },
        { value: 'Checker', label: 'Checker' },
        { value: 'Admin', label: 'Admin' },
        { value: 'Viewer', label: 'Viewer' },
      ],
      value: editingUser?.userRole || 'Maker',
    },
    {
      name: 'geographyIds',
      label: 'Geography',
      type: 'select' as const,
      options: [
        { value: 'empty', label: 'No Geography' },
        ...geographies.map(geo => ({ value: geo.id, label: `${geo.name} (${geo.type})` }))
      ],
      value: editingUser?.geographyIds?.[0] || 'empty',
    },
    {
      name: 'categoryIds',
      label: 'Category',
      type: 'select' as const,
      options: [
        { value: 'empty', label: 'No Category' },
        ...categories.map(cat => ({ value: cat.id, label: cat.name }))
      ],
      value: editingUser?.categoryIds?.[0] || 'empty',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
        </div>
        {hasPermission('create') && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        data={filteredUsers}
        columns={columns}
        onEdit={hasPermission('edit') ? handleEdit : undefined}
        onDelete={hasPermission('delete') ? handleDelete : undefined}
        onSubmitForApproval={hasPermission('create') ? handleSubmitForApproval : undefined}
        onApprove={hasPermission('approve') ? handleApprove : undefined}
        onReject={hasPermission('reject') ? handleReject : undefined}
        loading={loading}
      />

      <FormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title={editingUser ? 'Edit User' : 'Create User'}
        fields={formFields}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default Users;
