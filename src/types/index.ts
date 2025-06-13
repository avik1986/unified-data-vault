
export type Status = 'Active' | 'Inactive';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Draft';
export type UserRole = 'Maker' | 'Checker' | 'Admin' | 'Viewer';
export type DataType = 'string' | 'number' | 'dropdown' | 'boolean' | 'date';
export type Operator = 'equals' | 'not_equals' | 'in' | 'not_in' | 'regex' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal';
export type LogicOperator = 'AND' | 'OR';

export interface BaseEntity {
  id: string;
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
  status: Status;
  approvalStatus: ApprovalStatus;
}

export interface Category extends BaseEntity {
  name: string;
  parentId?: string;
  children?: Category[];
}

export interface Geography extends BaseEntity {
  name: string;
  type: 'Country' | 'State' | 'City' | 'Zone';
  parentId?: string;
  children?: Geography[];
}

export interface Role extends BaseEntity {
  name: string;
  department: string;
  parentId?: string;
  children?: Role[];
}

export interface User extends BaseEntity {
  fullName: string;
  email: string;
  phoneNumber: string;
  roleId: string;
  department: string;
  geographyIds: string[];
  categoryIds: string[];
  userRole: UserRole;
}

export interface Attribute extends BaseEntity {
  fieldName: string;
  dataType: DataType;
  predefinedValues?: string[];
  defaultValue?: string;
  validationRules?: ValidationRule[];
  context: string;
}

export interface ValidationRule {
  type: 'length' | 'range' | 'regex';
  value: string | number;
  message: string;
}

export interface Entity extends BaseEntity {
  name: string;
  entityType: string;
  attributeIds: string[];
  categoryIds: string[];
  geographyIds: string[];
  attributeValues?: Record<string, any>;
}

export interface RuleCondition {
  id: string;
  attributeId: string;
  operator: Operator;
  value: string | string[];
  logicOperator?: LogicOperator;
}

export interface ApprovalRule extends BaseEntity {
  ruleName: string;
  entityType: string;
  conditions: RuleCondition[];
  assignedRoles: string[];
  assignedUsers?: string[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  changes?: Record<string, any>;
}

export interface ApprovalRequest {
  id: string;
  entityType: string;
  entityId: string;
  requestedBy: string;
  assignedTo: string[];
  status: ApprovalStatus;
  comments?: string;
  createdDate: string;
  data: any;
}
