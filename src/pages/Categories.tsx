
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import { mockDataService } from '../services/mockDataService';
import { Category } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const { toast } = useToast();
  const { currentUser, hasPermission } = useAuth();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await mockDataService.getCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowDialog(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowDialog(true);
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await mockDataService.deleteCategory(category.id, currentUser?.id || 'unknown');
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      loadCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleSubmitForApproval = async (category: Category) => {
    try {
      await mockDataService.submitForApproval(
        'Category',
        category.id,
        currentUser?.id || 'unknown',
        category
      );
      toast({
        title: "Success",
        description: "Category submitted for approval",
      });
      loadCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit for approval",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (category: Category) => {
    try {
      await mockDataService.updateCategory(category.id, {
        approvalStatus: 'Approved',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Category approved successfully",
      });
      loadCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve category",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (category: Category) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await mockDataService.updateCategory(category.id, {
        approvalStatus: 'Rejected',
        modifiedBy: currentUser?.id || 'unknown',
        modifiedDate: new Date().toISOString(),
      });
      toast({
        title: "Success",
        description: "Category rejected",
      });
      loadCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject category",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setFormLoading(true);
      
      if (editingCategory) {
        await mockDataService.updateCategory(editingCategory.id, {
          name: formData.name,
          parentId: formData.parentId === 'empty' ? undefined : formData.parentId,
          modifiedBy: currentUser?.id || 'unknown',
          modifiedDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await mockDataService.createCategory({
          name: formData.name,
          parentId: formData.parentId === 'empty' ? undefined : formData.parentId,
          status: 'Active',
          approvalStatus: 'Pending',
          createdBy: currentUser?.id || 'unknown',
          createdDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }
      
      setShowDialog(false);
      loadCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingCategory ? 'update' : 'create'} category`,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { 
      key: 'parentId', 
      label: 'Parent Category',
      render: (parentId: string) => {
        if (!parentId) return 'Root Category';
        const parent = categories.find(c => c.id === parentId);
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
      label: 'Category Name',
      type: 'text' as const,
      required: true,
      value: editingCategory?.name || '',
    },
    {
      name: 'parentId',
      label: 'Parent Category',
      type: 'select' as const,
      options: [
        { value: 'empty', label: 'Root Category' },
        ...categories
          .filter(c => c.id !== editingCategory?.id)
          .map(c => ({ value: c.id, label: c.name }))
      ],
      value: editingCategory?.parentId || 'empty',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Manage category hierarchy</p>
        </div>
        {hasPermission('create') && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        data={filteredCategories}
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
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        fields={formFields}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default Categories;
