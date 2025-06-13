
import { 
  Category, Geography, Role, User, Attribute, Entity, ApprovalRule, 
  AuditLog, ApprovalRequest, Status, ApprovalStatus 
} from '../types';

// Mock data storage
class MockDataService {
  private categories: Category[] = [
    {
      id: '1',
      name: 'Electronics',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '2',
      name: 'Mobile Phones',
      parentId: '1',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '3',
      name: 'Laptops',
      parentId: '1',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    }
  ];

  private geographies: Geography[] = [
    {
      id: '1',
      name: 'India',
      type: 'Country',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '2',
      name: 'Karnataka',
      type: 'State',
      parentId: '1',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '3',
      name: 'Bangalore',
      type: 'City',
      parentId: '2',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    }
  ];

  private roles: Role[] = [
    {
      id: '1',
      name: 'Finance Director',
      department: 'Finance',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '2',
      name: 'Finance Manager',
      department: 'Finance',
      parentId: '1',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    }
  ];

  private users: User[] = [
    {
      id: '1',
      fullName: 'John Doe',
      email: 'john.doe@company.com',
      phoneNumber: '+1234567890',
      roleId: '1',
      department: 'Finance',
      geographyIds: ['1'],
      categoryIds: ['1'],
      userRole: 'Admin',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'system',
      createdDate: '2024-01-01',
    },
    {
      id: '2',
      fullName: 'Jane Smith',
      email: 'jane.smith@company.com',
      phoneNumber: '+1234567891',
      roleId: '2',
      department: 'Finance',
      geographyIds: ['2'],
      categoryIds: ['2'],
      userRole: 'Maker',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    }
  ];

  private attributes: Attribute[] = [
    {
      id: '1',
      fieldName: 'Battery Life',
      dataType: 'number',
      context: 'Electronics',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
      validationRules: [
        { type: 'range', value: 0, message: 'Battery life must be greater than 0' }
      ]
    },
    {
      id: '2',
      fieldName: 'Screen Size',
      dataType: 'string',
      context: 'Electronics',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    }
  ];

  private entities: Entity[] = [
    {
      id: '1',
      name: 'iPhone 15',
      entityType: 'Product',
      attributeIds: ['1', '2'],
      categoryIds: ['2'],
      geographyIds: ['1'],
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'jane.smith',
      createdDate: '2024-01-01',
      attributeValues: {
        'Battery Life': '20',
        'Screen Size': '6.1 inches'
      }
    }
  ];

  private approvalRules: ApprovalRule[] = [
    {
      id: '1',
      ruleName: 'High Value Products',
      entityType: 'Product',
      conditions: [
        {
          id: '1',
          attributeId: '1',
          operator: 'greater_than',
          value: '15'
        }
      ],
      assignedRoles: ['1'],
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    }
  ];

  private auditLogs: AuditLog[] = [];
  private approvalRequests: ApprovalRequest[] = [];

  // Helper method to generate IDs
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Promise.resolve([...this.categories]);
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const newCategory = { ...category, id: this.generateId() };
    this.categories.push(newCategory);
    this.logAction('CREATE', 'Category', newCategory.id, category.createdBy);
    return Promise.resolve(newCategory);
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    this.categories[index] = { ...this.categories[index], ...updates };
    this.logAction('UPDATE', 'Category', id, updates.modifiedBy || 'unknown');
    return Promise.resolve(this.categories[index]);
  }

  async deleteCategory(id: string, deletedBy: string): Promise<void> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    this.categories.splice(index, 1);
    this.logAction('DELETE', 'Category', id, deletedBy);
    return Promise.resolve();
  }

  // Geographies
  async getGeographies(): Promise<Geography[]> {
    return Promise.resolve([...this.geographies]);
  }

  async createGeography(geography: Omit<Geography, 'id'>): Promise<Geography> {
    const newGeography = { ...geography, id: this.generateId() };
    this.geographies.push(newGeography);
    this.logAction('CREATE', 'Geography', newGeography.id, geography.createdBy);
    return Promise.resolve(newGeography);
  }

  async updateGeography(id: string, updates: Partial<Geography>): Promise<Geography> {
    const index = this.geographies.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Geography not found');
    
    this.geographies[index] = { ...this.geographies[index], ...updates };
    this.logAction('UPDATE', 'Geography', id, updates.modifiedBy || 'unknown');
    return Promise.resolve(this.geographies[index]);
  }

  async deleteGeography(id: string, deletedBy: string): Promise<void> {
    const index = this.geographies.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Geography not found');
    
    this.geographies.splice(index, 1);
    this.logAction('DELETE', 'Geography', id, deletedBy);
    return Promise.resolve();
  }

  // Roles
  async getRoles(): Promise<Role[]> {
    return Promise.resolve([...this.roles]);
  }

  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    const newRole = { ...role, id: this.generateId() };
    this.roles.push(newRole);
    this.logAction('CREATE', 'Role', newRole.id, role.createdBy);
    return Promise.resolve(newRole);
  }

  async updateRole(id: string, updates: Partial<Role>): Promise<Role> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    
    this.roles[index] = { ...this.roles[index], ...updates };
    this.logAction('UPDATE', 'Role', id, updates.modifiedBy || 'unknown');
    return Promise.resolve(this.roles[index]);
  }

  async deleteRole(id: string, deletedBy: string): Promise<void> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    
    this.roles.splice(index, 1);
    this.logAction('DELETE', 'Role', id, deletedBy);
    return Promise.resolve();
  }

  // Users
  async getUsers(): Promise<User[]> {
    return Promise.resolve([...this.users]);
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const newUser = { ...user, id: this.generateId() };
    this.users.push(newUser);
    this.logAction('CREATE', 'User', newUser.id, user.createdBy);
    return Promise.resolve(newUser);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    this.users[index] = { ...this.users[index], ...updates };
    this.logAction('UPDATE', 'User', id, updates.modifiedBy || 'unknown');
    return Promise.resolve(this.users[index]);
  }

  async deleteUser(id: string, deletedBy: string): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    this.users.splice(index, 1);
    this.logAction('DELETE', 'User', id, deletedBy);
    return Promise.resolve();
  }

  // Attributes
  async getAttributes(): Promise<Attribute[]> {
    return Promise.resolve([...this.attributes]);
  }

  async createAttribute(attribute: Omit<Attribute, 'id'>): Promise<Attribute> {
    const newAttribute = { ...attribute, id: this.generateId() };
    this.attributes.push(newAttribute);
    this.logAction('CREATE', 'Attribute', newAttribute.id, attribute.createdBy);
    return Promise.resolve(newAttribute);
  }

  async updateAttribute(id: string, updates: Partial<Attribute>): Promise<Attribute> {
    const index = this.attributes.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Attribute not found');
    
    this.attributes[index] = { ...this.attributes[index], ...updates };
    this.logAction('UPDATE', 'Attribute', id, updates.modifiedBy || 'unknown');
    return Promise.resolve(this.attributes[index]);
  }

  async deleteAttribute(id: string, deletedBy: string): Promise<void> {
    const index = this.attributes.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Attribute not found');
    
    this.attributes.splice(index, 1);
    this.logAction('DELETE', 'Attribute', id, deletedBy);
    return Promise.resolve();
  }

  // Entities
  async getEntities(): Promise<Entity[]> {
    return Promise.resolve([...this.entities]);
  }

  async createEntity(entity: Omit<Entity, 'id'>): Promise<Entity> {
    const newEntity = { ...entity, id: this.generateId() };
    this.entities.push(newEntity);
    this.logAction('CREATE', 'Entity', newEntity.id, entity.createdBy);
    return Promise.resolve(newEntity);
  }

  async updateEntity(id: string, updates: Partial<Entity>): Promise<Entity> {
    const index = this.entities.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Entity not found');
    
    this.entities[index] = { ...this.entities[index], ...updates };
    this.logAction('UPDATE', 'Entity', id, updates.modifiedBy || 'unknown');
    return Promise.resolve(this.entities[index]);
  }

  async deleteEntity(id: string, deletedBy: string): Promise<void> {
    const index = this.entities.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Entity not found');
    
    this.entities.splice(index, 1);
    this.logAction('DELETE', 'Entity', id, deletedBy);
    return Promise.resolve();
  }

  // Approval Rules
  async getApprovalRules(): Promise<ApprovalRule[]> {
    return Promise.resolve([...this.approvalRules]);
  }

  async createApprovalRule(rule: Omit<ApprovalRule, 'id'>): Promise<ApprovalRule> {
    const newRule = { ...rule, id: this.generateId() };
    this.approvalRules.push(newRule);
    this.logAction('CREATE', 'ApprovalRule', newRule.id, rule.createdBy);
    return Promise.resolve(newRule);
  }

  async updateApprovalRule(id: string, updates: Partial<ApprovalRule>): Promise<ApprovalRule> {
    const index = this.approvalRules.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Approval rule not found');
    
    this.approvalRules[index] = { ...this.approvalRules[index], ...updates };
    this.logAction('UPDATE', 'ApprovalRule', id, updates.modifiedBy || 'unknown');
    return Promise.resolve(this.approvalRules[index]);
  }

  async deleteApprovalRule(id: string, deletedBy: string): Promise<void> {
    const index = this.approvalRules.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Approval rule not found');
    
    this.approvalRules.splice(index, 1);
    this.logAction('DELETE', 'ApprovalRule', id, deletedBy);
    return Promise.resolve();
  }

  // Approval workflow
  async submitForApproval(entityType: string, entityId: string, requestedBy: string, data: any): Promise<ApprovalRequest> {
    const request: ApprovalRequest = {
      id: this.generateId(),
      entityType,
      entityId,
      requestedBy,
      assignedTo: ['1'], // Default to admin for now
      status: 'Pending',
      createdDate: new Date().toISOString(),
      data
    };
    
    this.approvalRequests.push(request);
    this.logAction('SUBMIT_FOR_APPROVAL', entityType, entityId, requestedBy);
    return Promise.resolve(request);
  }

  async approveRequest(requestId: string, approvedBy: string, comments?: string): Promise<void> {
    const request = this.approvalRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Approval request not found');
    
    request.status = 'Approved';
    request.comments = comments;
    this.logAction('APPROVE', request.entityType, request.entityId, approvedBy);
    return Promise.resolve();
  }

  async rejectRequest(requestId: string, rejectedBy: string, comments: string): Promise<void> {
    const request = this.approvalRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Approval request not found');
    
    request.status = 'Rejected';
    request.comments = comments;
    this.logAction('REJECT', request.entityType, request.entityId, rejectedBy);
    return Promise.resolve();
  }

  async getApprovalRequests(): Promise<ApprovalRequest[]> {
    return Promise.resolve([...this.approvalRequests]);
  }

  // Audit logs
  async getAuditLogs(): Promise<AuditLog[]> {
    return Promise.resolve([...this.auditLogs]);
  }

  private logAction(action: string, entityType: string, entityId: string, userId: string, changes?: Record<string, any>): void {
    const log: AuditLog = {
      id: this.generateId(),
      userId,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      changes
    };
    this.auditLogs.push(log);
  }
}

export const mockDataService = new MockDataService();
