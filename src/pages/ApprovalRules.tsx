
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import { mockDataService } from '../services/mockDataService';
import { ApprovalRule, Attribute, Role, User } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ApprovalRules = () => {
  const [approvalRules, setApprovalRules] = useState<ApprovalRule[]>([]);
  const [filteredRules, setFilteredRules] = useState<ApprovalRule[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const { toast } = useToast();
  const { currentUser, hasPermission } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = approvalRules.filter(rule =>
      rule.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.entityType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRules(filtered);
  }, [approvalRules, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rulesData, attributesData, rolesData, usersData] = await Promise.all([
        mockDataService.getApprovalRules(),
        mockDataService.getAttributes(),
        mockDataService.getRoles(),
        mockDataService.getUsers(),
      ]);
      setApprovalRules(rulesData);
      setAttributes(attributesData);
      setRoles(rolesData);
      setUsers(usersData);
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
    setEditingRule(null);
    setShowDialog(true);
  };

  const handleEdit = (rule: ApprovalRule) => {
    setEditingRule(rule);
    setShowDialog(true);
  };

  const handleDelete = async (rule: ApprovalRule) => {
    if (!window.confirm('Are you sure you want to delete this approval rule?')) {
      return;
    }

    try {
      await mockDataService.deleteApprovalRule(rule.id, currentUser?.id || 'unknown');
      toast({
        title: "Success",
        description: "Approval rule deleted successfully",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete approval rule",
        variant: "destructive",
      });
    }
  };

  const handleSimulate = (rule: ApprovalRule) => {
    toast({
      title: "Rule Simulation",
      description: `Simulating rule "${rule.ruleName}" for entity type "${rule.entityType}"`,
    });
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      setFormLoading(true);
      
      const ruleData = {
        ruleName: formData.ruleName,
        entityType: formData.entityType,
        conditions: [{
          id: '1',
          attributeId: formData.attributeId,
          operator: formData.operator,
          value: formData.value,
        }],
        assignedRoles: Array.isArray(formData.assignedRoles) ? formData.assignedRoles : (formData.assignedRoles ? [formData.assignedRoles] : []),
        assignedUsers: Array.isArray(formData.assignedUsers) ? formData.assignedUsers : (formData.assignedUsers ? [formData.assignedUsers] : []),
      };
      
      if (editingRule) {
        await mockDataService.updateApprovalRule(editingRule.id, {
          ...ruleData,
          modifiedBy: currentUser?.id || 'unknown',
          modifiedDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Approval rule updated successfully",
        });
      } else {
        await mockDataService.createApprovalRule({
          ...ruleData,
          status: 'Active',
          approvalStatus: 'Pending',
          createdBy: currentUser?.id || 'unknown',
          createdDate: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Approval rule created successfully",
        });
      }
      
      setShowDialog(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingRule ? 'update' : 'create'} approval rule`,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'ruleName', label: 'Rule Name' },
    { key: 'entityType', label: 'Entity Type' },
    { 
      key: 'conditions', 
      label: 'Conditions',
      render: (conditions: any[]) => {
        if (!conditions || conditions.length === 0) return 'None';
        const condition = conditions[0];
        const attribute = attributes.find(a => a.id === condition.attributeId);
        return `${attribute?.fieldName || 'Unknown'} ${condition.operator} ${condition.value}`;
      }
    },
    { 
      key: 'assignedRoles', 
      label: 'Assigned Roles',
      render: (roleIds: string[]) => {
        if (!roleIds || roleIds.length === 0) return 'None';
        const roleNames = roleIds.map(id => {
          const role = roles.find(r => r.id === id);
          return role?.name || 'Unknown';
        });
        return roleNames.join(', ');
      }
    },
    { 
      key: 'assignedUsers', 
      label: 'Assigned Users',
      render: (userIds: string[]) => {
        if (!userIds || userIds.length === 0) return 'None';
        const userNames = userIds.map(id => {
          const user = users.find(u => u.id === id);
          return user?.fullName || 'Unknown';
        });
        return userNames.join(', ');
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
    'Product', 'Vendor', 'Customer', 'Contract', 'Asset', 'Service', 'Project', 'Category', 'Geography', 'Role', 'User', 'Attribute'
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'in', label: 'In' },
    { value: 'not_in', label: 'Not In' },
    { value: 'regex', label: 'Regex' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'greater_equal', label: 'Greater Equal' },
    { value: 'less_equal', label: 'Less Equal' },
  ];

  const formFields = [
    {
      name: 'ruleName',
      label: 'Rule Name',
      type: 'text' as const,
      required: true,
      value: editingRule?.ruleName || '',
    },
    {
      name: 'entityType',
      label: 'Entity Type',
      type: 'select' as const,
      required: true,
      options: entityTypes.map(type => ({ value: type, label: type })),
      value: editingRule?.entityType || '',
    },
    {
      name: 'attributeId',
      label: 'Attribute',
      type: 'select' as const,
      required: true,
      options: attributes.map(attr => ({ value: attr.id, label: attr.fieldName })),
      value: editingRule?.conditions?.[0]?.attributeId || '',
    },
    {
      name: 'operator',
      label: 'Operator',
      type: 'select' as const,
      required: true,
      options: operators,
      value: editingRule?.conditions?.[0]?.operator || '',
    },
    {
      name: 'value',
      label: 'Value',
      type: 'text' as const,
      required: true,
      value: editingRule?.conditions?.[0]?.value || '',
    },
    {
      name: 'assignedRoles',
      label: 'Assigned Roles',
      type: 'multiselect' as const,
      options: roles.map(role => ({ value: role.id, label: `${role.name} (${role.department})` })),
      value: editingRule?.assignedRoles || [],
      multiple: true,
    },
    {
      name: 'assignedUsers',
      label: 'Assigned Users (Optional)',
      type: 'multiselect' as const,
      options: users.map(user => ({ value: user.id, label: user.fullName })),
      value: editingRule?.assignedUsers || [],
      multiple: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approval Rules</h1>
          <p className="text-gray-600 mt-2">Configure multiple approval workflows with multi-select assignments</p>
        </div>
        {hasPermission('create') && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Rule
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        data={filteredRules}
        columns={columns}
        onEdit={hasPermission('edit') ? handleEdit : undefined}
        onDelete={hasPermission('delete') ? handleDelete : undefined}
        customActions={[
          {
            label: 'Simulate',
            icon: Settings,
            onClick: handleSimulate,
            condition: () => hasPermission('view'),
          }
        ]}
        loading={loading}
      />

      <FormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title={editingRule ? 'Edit Approval Rule' : 'Create Approval Rule'}
        fields={formFields}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default ApprovalRules;
