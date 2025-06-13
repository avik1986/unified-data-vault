import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TreeView from '../components/TreeView';
import FormDialog from '../components/FormDialog';
import { mockDataService } from '../services/mockDataService';
import { Geography } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Geographies = () => {
  const [geographies, setGeographies] = useState<Geography[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingGeography, setEditingGeography] = useState<Geography | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedGeography, setSelectedGeography] = useState<Geography | null>(null);
  
  const { toast } = useToast();
  const { currentUser, hasPermission } = useAuth();

  useEffect(() => {
    loadGeographies();
  }, []);

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
          parentId: formData.parentId === 'empty' ? undefined : formData.parentId,
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
          parentId: formData.parentId === 'empty' ? undefined : formData.parentId,
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

  const filteredGeographies = geographies.filter(geography =>
    geography.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTreeSelect = (item: TreeItem) => {
    const geography = geographies.find(g => g.id === item.id);
    if (geography) {
      setSelectedGeography(geography);
    }
  };

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
      value: editingGeography?.type || 'Country',
    },
    {
      name: 'parentId',
      label: 'Parent Geography',
      type: 'select' as const,
      options: [
        { value: 'empty', label: 'Root Geography' },
        ...geographies
          .filter(g => g.id !== editingGeography?.id)
          .map(g => ({ value: g.id, label: `${g.name} (${g.type})` }))
      ],
      value: editingGeography?.parentId || 'empty',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Geographies</h1>
          <p className="text-gray-600 mt-2">Manage geography hierarchy with L0, L1, L2 levels</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Geography Tree Structure</h3>
            <div className="mb-4 text-sm text-gray-600">
              <span className="bg-gray-200 px-2 py-1 rounded mr-2 font-mono">L0</span> Country
              <span className="bg-gray-200 px-2 py-1 rounded mx-2 font-mono">L1</span> State
              <span className="bg-gray-200 px-2 py-1 rounded mx-2 font-mono">L2</span> City/Zone
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading geographies...</div>
            ) : (
              <TreeView
                data={filteredGeographies}
                onSelect={handleTreeSelect}
                selectedId={selectedGeography?.id}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedGeography && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Geography Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm">{selectedGeography.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-sm">{selectedGeography.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Parent Geography</label>
                  <p className="text-sm">
                    {selectedGeography.parentId ? 
                      geographies.find(g => g.id === selectedGeography.parentId)?.name || 'Unknown' : 
                      'Root Geography'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-sm">{selectedGeography.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Approval Status</label>
                  <p className="text-sm">{selectedGeography.approvalStatus}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created By</label>
                  <p className="text-sm">{selectedGeography.createdBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created Date</label>
                  <p className="text-sm">{new Date(selectedGeography.createdDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {hasPermission('edit') && (
                  <Button 
                    onClick={() => handleEdit(selectedGeography)} 
                    className="w-full"
                    variant="outline"
                  >
                    Edit Geography
                  </Button>
                )}
                {hasPermission('create') && selectedGeography.approvalStatus === 'Draft' && (
                  <Button 
                    onClick={() => handleSubmitForApproval(selectedGeography)} 
                    className="w-full"
                    variant="outline"
                  >
                    Submit for Approval
                  </Button>
                )}
                {hasPermission('approve') && selectedGeography.approvalStatus === 'Pending' && (
                  <>
                    <Button 
                      onClick={() => handleApprove(selectedGeography)} 
                      className="w-full"
                    >
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleReject(selectedGeography)} 
                      className="w-full"
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </>
                )}
                {hasPermission('delete') && (
                  <Button 
                    onClick={() => handleDelete(selectedGeography)} 
                    className="w-full"
                    variant="destructive"
                  >
                    Delete Geography
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

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
