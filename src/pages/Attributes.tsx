
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import { mockDataService } from '../services/mockDataService';
import { Attribute } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Attributes = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [filteredAttributes, setFilteredAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const { toast } = useToast();
  const { currentUser, hasPermission } = useAuth();

  useEffect(() => {
    loadAttributes();
  }, []);

  useEffect(() => {
    const filtered = attributes.filter(attribute =>
      attribute.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attribute.context.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAttributes(filtered);
  }, [attributes, searchTerm]);

  const loadAttributes = async () => {
    try {
      setLoading(true);
      const data = await mockDataService.getAttributes();
      setAttributes(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attributes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAttribute(null);
    setShowDialog(true);
  };

  const handleEdit = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setShowDialog(true);
  };

  const handleDelete = async (attribute: Attribute) => {
    if (!window.confirm('Are you sure you want to delete this attribute?')) {
      return;
    }

    try {
      await mockDataService.deleteAttribute(attribute.id, currentUser?.id || 'unknown');
      toast({
        title: "Success",
        description: "Attribute deleted successfully",
      });
      loadAttributes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete attribute",
        variant: "destructive",
      });
    }
  };

  const handleSubmitForApproval = async (attribute: Attribute) => {
    try {
      await mockDataService.submitForApproval(
        'Attribute',
        attribute.id,
        currentUser?.id || 'unknown',
        attribute
      );
      toast({
        title: "Success",
        description: "Attribute submitted for approval",
      });
      loadAttributes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit for approval",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (attribute: Attribute) => {
    try {
      await mockDataService.updateAttribute(attribute.id, {
        approvalStatus: 'Approved',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Attribute approved successfully",
      });
      loadAttributes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve attribute",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (attribute: Attribute) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await mockDataService.updateAttribute(attribute.id, {
        approvalStatus: 'Rejected',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Attribute rejected",
      });
      loadAttributes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject attribute",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setFormLoading(true);
      
      const attributeData = {
        fieldName: formData.fieldName,
        dataType: formData.dataType,
        context: formData.context,
        defaultValue: formData.defaultValue,
        predefinedValues: formData.predefinedValues ? formData.predefinedValues.split(',').map((v: string) => v.trim()) : undefined,
      };
      
      if (editingAttribute) {
        await mockDataService.updateAttribute(editingAttribute.id, {
          ...attributeData,
          modifiedBy: currentUser?.id || 'unknown',
          modifiedDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Attribute updated successfully",
        });
      } else {
        await mockDataService.createAttribute({
          ...attributeData,
          status: 'Active',
          approvalStatus: 'Pending',
          createdBy: currentUser?.id || 'unknown',
          createdDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Attribute created successfully",
        });
      }
      
      setShowDialog(false);
      loadAttributes();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingAttribute ? 'update' : 'create'} attribute`,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'fieldName', label: 'Field Name' },
    { key: 'dataType', label: 'Data Type' },
    { key: 'context', label: 'Context' },
    { key: 'defaultValue', label: 'Default Value' },
    { 
      key: 'predefinedValues', 
      label: 'Predefined Values',
      render: (values: string[]) => values ? values.join(', ') : 'N/A'
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
      name: 'fieldName',
      label: 'Field Name',
      type: 'text' as const,
      required: true,
      value: editingAttribute?.fieldName || '',
    },
    {
      name: 'dataType',
      label: 'Data Type',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'string', label: 'String' },
        { value: 'number', label: 'Number' },
        { value: 'dropdown', label: 'Dropdown' },
        { value: 'boolean', label: 'Boolean' },
        { value: 'date', label: 'Date' },
      ],
      value: editingAttribute?.dataType || '',
    },
    {
      name: 'context',
      label: 'Context/Category',
      type: 'text' as const,
      required: true,
      value: editingAttribute?.context || '',
    },
    {
      name: 'defaultValue',
      label: 'Default Value',
      type: 'text' as const,
      value: editingAttribute?.defaultValue || '',
    },
    {
      name: 'predefinedValues',
      label: 'Predefined Values (comma-separated)',
      type: 'text' as const,
      value: editingAttribute?.predefinedValues?.join(', ') || '',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attributes</h1>
          <p className="text-gray-600 mt-2">Manage dynamic data attributes</p>
        </div>
        {hasPermission('create') && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Attribute
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search attributes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        data={filteredAttributes}
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
        title={editingAttribute ? 'Edit Attribute' : 'Create Attribute'}
        fields={formFields}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default Attributes;
