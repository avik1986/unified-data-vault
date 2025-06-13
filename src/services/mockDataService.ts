
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
    },
    {
      id: '4',
      name: 'Clothing',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-02',
    },
    {
      id: '5',
      name: "Men's Clothing",
      parentId: '4',
      status: 'Active' as Status,
      approvalStatus: 'Pending' as ApprovalStatus,
      createdBy: 'jane.smith',
      createdDate: '2024-01-03',
    }
  ];

  private geographies: Geography[] = [
    {
      id: '1',
      name: 'United States',
      type: 'Country',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '2',
      name: 'California',
      type: 'State',
      parentId: '1',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '3',
      name: 'Los Angeles',
      type: 'City',
      parentId: '2',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '4',
      name: 'Texas',
      type: 'State',
      parentId: '1',
      status: 'Active' as Status,
      approvalStatus: 'Pending' as ApprovalStatus,
      createdBy: 'jane.smith',
      createdDate: '2024-01-03',
    }
  ];

  private roles: Role[] = [
    {
      id: '1',
      name: 'CEO',
      department: 'Executive',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '2',
      name: 'Finance Director',
      department: 'Finance',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '3',
      name: 'Sales Director',
      department: 'Sales',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '4',
      name: 'Sales Manager',
      department: 'Sales',
      parentId: '3',
      status: 'Active' as Status,
      approvalStatus: 'Pending' as ApprovalStatus,
      createdBy: 'jane.smith',
      createdDate: '2024-01-03',
    }
  ];

  private users: User[] = [
    {
      id: '1',
      fullName: 'John Admin',
      email: 'admin@company.com',
      phoneNumber: '+1234567890',
      roleId: '1',
      department: 'Executive',
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
      fullName: 'Jane Maker',
      email: 'maker@company.com',
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
    },
    {
      id: '3',
      fullName: 'Bob Checker',
      email: 'checker@company.com',
      phoneNumber: '+1234567892',
      roleId: '3',
      department: 'Sales',
      geographyIds: ['3'],
      categoryIds: ['3'],
      userRole: 'Checker',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '4',
      fullName: 'Alice Viewer',
      email: 'viewer@company.com',
      phoneNumber: '+1234567893',
      roleId: '4',
      department: 'Sales',
      geographyIds: ['4'],
      categoryIds: ['4'],
      userRole: 'Viewer',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    }
  ];

  private attributes: Attribute[] = [
    {
      id: '1',
      fieldName: 'Product Name',
      dataType: 'string',
      context: 'Electronics',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
      validationRules: [
        { type: 'required', value: true, message: 'Product name is required' }
      ]
    },
    {
      id: '2',
      fieldName: 'Price',
      dataType: 'number',
      context: 'Electronics',
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
      validationRules: [
        { type: 'range', value: 0, message: 'Price must be greater than 0' }
      ]
    },
    {
      id: '3',
      fieldName: 'Brand',
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
      attributeIds: ['1', '2', '3'],
      categoryIds: ['2'],
      geographyIds: ['1'],
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'jane.smith',
      createdDate: '2024-01-01',
      attributeValues: {
        'Product Name': 'iPhone 15',
        'Price': '999',
        'Brand': 'Apple'
      }
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      entityType: 'Product',
      attributeIds: ['1', '2', '3'],
      categoryIds: ['2'],
      geographyIds: ['2'],
      status: 'Active' as Status,
      approvalStatus: 'Pending' as ApprovalStatus,
      createdBy: 'jane.smith',
      createdDate: '2024-01-03',
      attributeValues: {
        'Product Name': 'Samsung Galaxy S24',
        'Price': '899',
        'Brand': 'Samsung'
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
          attributeId: '2',
          operator: 'greater_than',
          value: '500'
        }
      ],
      assignedRoles: ['1', '2'],
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    },
    {
      id: '2',
      ruleName: 'User Creation Rule',
      entityType: 'User',
      conditions: [
        {
          id: '2',
          attributeId: '1',
          operator: 'equals',
          value: 'any'
        }
      ],
      assignedRoles: ['1'],
      status: 'Active' as Status,
      approvalStatus: 'Approved' as ApprovalStatus,
      createdBy: 'admin',
      createdDate: '2024-01-01',
    }
  ];

  private auditLogs: AuditLog[] = [
    {
      id: '1',
      userId: 'jane.smith',
      action: 'CREATE',
      entityType: 'Category',
      entityId: '5',
      timestamp: '2024-01-03T10:00:00Z',
      changes: { name: "Men's Clothing", parentId: '4' }
    },
    {
      id: '2',
      userId: 'jane.smith',
      action: 'CREATE',
      entityType: 'Product',
      entityId: '2',
      timestamp: '2024-01-03T11:00:00Z',
      changes: { name: 'Samsung Galaxy S24', price: '899' }
    }
  ];

  private approvalRequests: ApprovalRequest[] = [
    {
      id: '1',
      entityType: 'Category',
      entityId: '5',
      requestedBy: 'Jane Maker',
      assignedTo: ['1'],
      status: 'Pending',
      createdDate: '2024-01-03T10:00:00Z',
      data: {
        name: "Men's Clothing",
        parentId: '4'
      },
      comments: 'New category for men\'s clothing line'
    },
    {
      id: '2',
      entityType: 'Product',
      entityId: '2',
      requestedBy: 'Jane Maker',
      assignedTo: ['1', '2'],
      status: 'Pending',
      createdDate: '2024-01-03T11:00:00Z',
      data: {
        name: 'Samsung Galaxy S24',
        price: 899,
        brand: 'Samsung'
      }
    },
    {
      id: '3',
      entityType: 'User',
      entityId: '5',
      requestedBy: 'Jane Maker',
      assignedTo: ['1'],
      status: 'Approved',
      createdDate: '2024-01-02T14:00:00Z',
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'Sales Manager'
      },
      comments: 'Approved by John Admin'
    }
  ];

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
