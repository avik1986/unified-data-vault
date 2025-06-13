
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import { mockDataService } from '../services/mockDataService';
import { Role } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const { toast } = useToast();
  const { currentUser, hasPermission } = useAuth();

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    const filtered = roles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoles(filtered);
  }, [roles, searchTerm]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await mockDataService.getRoles();
      setRoles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRole(null);
    setShowDialog(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setShowDialog(true);
  };

  const handleDelete = async (role: Role) => {
    if (!window.confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      await mockDataService.deleteRole(role.id, currentUser?.id || 'unknown');
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
      loadRoles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    }
  };

  const handleSubmitForApproval = async (role: Role) => {
    try {
      await mockDataService.submitForApproval(
        'Role',
        role.id,
        currentUser?.id || 'unknown',
        role
      );
      toast({
        title: "Success",
        description: "Role submitted for approval",
      });
      loadRoles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit for approval",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (role: Role) => {
    try {
      await mockDataService.updateRole(role.id, {
        approvalStatus: 'Approved',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Role approved successfully",
      });
      loadRoles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve role",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (role: Role) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await mockDataService.updateRole(role.id, {
        approvalStatus: 'Rejected',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Role rejected",
      });
      loadRoles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject role",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setFormLoading(true);
      
      if (editingRole) {
        await mockDataService.updateRole(editingRole.id, {
          name: formData.name,
          department: formData.department,
          parentId: formData.parentId || undefined,
          modifiedBy: currentUser?.id || 'unknown',
          modifiedDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      } else {
        await mockDataService.createRole({
          name: formData.name,
          department: formData.department,
          parentId: formData.parentId || undefined,
          status: 'Active',
          approvalStatus: 'Pending',
          createdBy: currentUser?.id || 'unknown',
          createdDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Role created successfully",
        });
      }
      
      setShowDialog(false);
      loadRoles();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingRole ? 'update' : 'create'} role`,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'department', label: 'Department' },
    { 
      key: 'parentId', 
      label: 'Parent Role',
      render: (parentId: string) => {
        if (!parentId) return 'Root Role';
        const parent = roles.find(r => r.id === parentId);
        return parent?.name || 'Unknown';
      }
    },
    { key: 'status', label: 'Status' },
    { key: 'approvalStatus', label: 'Approval Status' },
    { key: 'createdBy', label: 'Created By' },
    { 
      key: 'createdDate', 
      label: 'Created Date',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
  ];

  const departments = [
    'Finance', 'Human Resources', 'Information Technology', 'Marketing', 
    'Sales', 'Operations', 'Legal', 'Product Management', 'Customer Service'
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Role Name',
      type: 'text' as const,
      required: true,
      value: editingRole?.name || '',
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select' as const,
      required: true,
      options: departments.map(dept => ({ value: dept, label: dept })),
      value: editingRole?.department || '',
    },
    {
      name: 'parentId',
      label: 'Parent Role',
      type: 'select' as const,
      options: [
        { value: '', label: 'Root Role' },
        ...roles
          .filter(r => r.id !== editingRole?.id)
          .map(r => ({ value: r.id, label: `${r.name} (${r.department})` }))
      ],
      value: editingRole?.parentId || '',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
          <p className="text-gray-600 mt-2">Manage role hierarchy and departments</p>
        </div>
        {hasPermission('create') && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        data={filteredRoles}
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
        title={editingRole ? 'Edit Role' : 'Create Role'}
        fields={formFields}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default Roles;
