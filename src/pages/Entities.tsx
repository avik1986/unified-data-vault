
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import { mockDataService } from '../services/mockDataService';
import { Entity, Attribute, Category, Geography } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Entities = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [geographies, setGeographies] = useState<Geography[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const { toast } = useToast();
  const { currentUser, hasPermission } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = entities.filter(entity =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.entityType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEntities(filtered);
  }, [entities, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [entitiesData, attributesData, categoriesData, geographiesData] = await Promise.all([
        mockDataService.getEntities(),
        mockDataService.getAttributes(),
        mockDataService.getCategories(),
        mockDataService.getGeographies(),
      ]);
      setEntities(entitiesData);
      setAttributes(attributesData);
      setCategories(categoriesData);
      setGeographies(geographiesData);
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
    setEditingEntity(null);
    setShowDialog(true);
  };

  const handleEdit = (entity: Entity) => {
    setEditingEntity(entity);
    setShowDialog(true);
  };

  const handleDelete = async (entity: Entity) => {
    if (!window.confirm('Are you sure you want to delete this entity?')) {
      return;
    }

    try {
      await mockDataService.deleteEntity(entity.id, currentUser?.id || 'unknown');
      toast({
        title: "Success",
        description: "Entity deleted successfully",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete entity",
        variant: "destructive",
      });
    }
  };

  const handleSubmitForApproval = async (entity: Entity) => {
    try {
      await mockDataService.submitForApproval(
        'Entity',
        entity.id,
        currentUser?.id || 'unknown',
        entity
      );
      toast({
        title: "Success",
        description: "Entity submitted for approval",
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

  const handleApprove = async (entity: Entity) => {
    try {
      await mockDataService.updateEntity(entity.id, {
        approvalStatus: 'Approved',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Entity approved successfully",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve entity",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (entity: Entity) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await mockDataService.updateEntity(entity.id, {
        approvalStatus: 'Rejected',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Entity rejected",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject entity",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setFormLoading(true);
      
      const entityData = {
        name: formData.name,
        entityType: formData.entityType,
        attributeIds: Array.isArray(formData.attributeIds) ? formData.attributeIds : [formData.attributeIds].filter(Boolean),
        categoryIds: Array.isArray(formData.categoryIds) ? formData.categoryIds : [formData.categoryIds].filter(Boolean),
        geographyIds: Array.isArray(formData.geographyIds) ? formData.geographyIds : [formData.geographyIds].filter(Boolean),
      };
      
      if (editingEntity) {
        await mockDataService.updateEntity(editingEntity.id, {
          ...entityData,
          modifiedBy: currentUser?.id || 'unknown',
          modifiedDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Entity updated successfully",
        });
      } else {
        await mockDataService.createEntity({
          ...entityData,
          status: 'Active',
          approvalStatus: 'Pending',
          createdBy: currentUser?.id || 'unknown',
          createdDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Entity created successfully",
        });
      }
      
      setShowDialog(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingEntity ? 'update' : 'create'} entity`,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'entityType', label: 'Entity Type' },
    { 
      key: 'attributeIds', 
      label: 'Attributes',
      render: (attributeIds: string[]) => {
        if (!attributeIds || attributeIds.length === 0) return 'None';
        const attributeNames = attributeIds.map(id => {
          const attr = attributes.find(a => a.id === id);
          return attr?.fieldName || 'Unknown';
        });
        return attributeNames.join(', ');
      }
    },
    { 
      key: 'categoryIds', 
      label: 'Categories',
      render: (categoryIds: string[]) => {
        if (!categoryIds || categoryIds.length === 0) return 'None';
        const categoryNames = categoryIds.map(id => {
          const cat = categories.find(c => c.id === id);
          return cat?.name || 'Unknown';
        });
        return categoryNames.join(', ');
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

  const entityTypes = [
    'Product', 'Vendor', 'Customer', 'Contract', 'Asset', 'Service', 'Project'
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Entity Name',
      type: 'text' as const,
      required: true,
      value: editingEntity?.name || '',
    },
    {
      name: 'entityType',
      label: 'Entity Type',
      type: 'select' as const,
      required: true,
      options: entityTypes.map(type => ({ value: type, label: type })),
      value: editingEntity?.entityType || '',
    },
    {
      name: 'attributeIds',
      label: 'Attributes',
      type: 'select' as const,
      options: attributes.map(attr => ({ value: attr.id, label: attr.fieldName })),
      value: editingEntity?.attributeIds?.[0] || '',
    },
    {
      name: 'categoryIds',
      label: 'Categories',
      type: 'select' as const,
      options: categories.map(cat => ({ value: cat.id, label: cat.name })),
      value: editingEntity?.categoryIds?.[0] || '',
    },
    {
      name: 'geographyIds',
      label: 'Geographies',
      type: 'select' as const,
      options: geographies.map(geo => ({ value: geo.id, label: `${geo.name} (${geo.type})` })),
      value: editingEntity?.geographyIds?.[0] || '',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Entities</h1>
          <p className="text-gray-600 mt-2">Manage business entities with dynamic attributes</p>
        </div>
        {hasPermission('create') && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Entity
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        data={filteredEntities}
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
        title={editingEntity ? 'Edit Entity' : 'Create Entity'}
        fields={formFields}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default Entities;
