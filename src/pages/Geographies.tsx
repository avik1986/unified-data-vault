
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import { mockDataService } from '../services/mockDataService';
import { Geography } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Geographies = () => {
  const [geographies, setGeographies] = useState<Geography[]>([]);
  const [filteredGeographies, setFilteredGeographies] = useState<Geography[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingGeography, setEditingGeography] = useState<Geography | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const { toast } = useToast();
  const { currentUser, hasPermission } = useAuth();

  useEffect(() => {
    loadGeographies();
  }, []);

  useEffect(() => {
    const filtered = geographies.filter(geography =>
      geography.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGeographies(filtered);
  }, [geographies, searchTerm]);

  const loadGeographies = async () => {
    try {
      setLoading(true);
      const data = await mockDataService.getGeographies();
      setGeographies(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load geographies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingGeography(null);
    setShowDialog(true);
  };

  const handleEdit = (geography: Geography) => {
    setEditingGeography(geography);
    setShowDialog(true);
  };

  const handleDelete = async (geography: Geography) => {
    if (!window.confirm('Are you sure you want to delete this geography?')) {
      return;
    }

    try {
      await mockDataService.deleteGeography(geography.id, currentUser?.id || 'unknown');
      toast({
        title: "Success",
        description: "Geography deleted successfully",
      });
      loadGeographies();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete geography",
        variant: "destructive",
      });
    }
  };

  const handleSubmitForApproval = async (geography: Geography) => {
    try {
      await mockDataService.submitForApproval(
        'Geography',
        geography.id,
        currentUser?.id || 'unknown',
        geography
      );
      toast({
        title: "Success",
        description: "Geography submitted for approval",
      });
      loadGeographies();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit for approval",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (geography: Geography) => {
    try {
      await mockDataService.updateGeography(geography.id, {
        approvalStatus: 'Approved',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Geography approved successfully",
      });
      loadGeographies();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve geography",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (geography: Geography) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await mockDataService.updateGeography(geography.id, {
        approvalStatus: 'Rejected',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Geography rejected",
      });
      loadGeographies();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject geography",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setFormLoading(true);
      
      if (editingGeography) {
        await mockDataService.updateGeography(editingGeography.id, {
          name: formData.name,
          type: formData.type,
          parentId: formData.parentId || undefined,
          modifiedBy: currentUser?.id || 'unknown',
          modifiedDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Geography updated successfully",
        });
      } else {
        await mockDataService.createGeography({
          name: formData.name,
          type: formData.type,
          parentId: formData.parentId || undefined,
          status: 'Active',
          approvalStatus: 'Pending',
          createdBy: currentUser?.id || 'unknown',
          createdDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Geography created successfully",
        });
      }
      
      setShowDialog(false);
      loadGeographies();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingGeography ? 'update' : 'create'} geography`,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { 
      key: 'parentId', 
      label: 'Parent Geography',
      render: (parentId: string) => {
        if (!parentId) return 'Root Geography';
        const parent = geographies.find(g => g.id === parentId);
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

  const formFields = [
    {
      name: 'name',
      label: 'Geography Name',
      type: 'text' as const,
      required: true,
      value: editingGeography?.name || '',
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Country', label: 'Country' },
        { value: 'State', label: 'State' },
        { value: 'City', label: 'City' },
        { value: 'Zone', label: 'Zone' },
      ],
      value: editingGeography?.type || '',
    },
    {
      name: 'parentId',
      label: 'Parent Geography',
      type: 'select' as const,
      options: [
        { value: '', label: 'Root Geography' },
        ...geographies
          .filter(g => g.id !== editingGeography?.id)
          .map(g => ({ value: g.id, label: `${g.name} (${g.type})` }))
      ],
      value: editingGeography?.parentId || '',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Geographies</h1>
          <p className="text-gray-600 mt-2">Manage geography hierarchy</p>
        </div>
        {hasPermission('create') && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Geography
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search geographies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        data={filteredGeographies}
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
        title={editingGeography ? 'Edit Geography' : 'Create Geography'}
        fields={formFields}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default Geographies;
