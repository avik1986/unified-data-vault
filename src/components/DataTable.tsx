
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Check, X, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ApprovalStatus, Status } from '../types';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onSubmitForApproval?: (item: any) => void;
  onApprove?: (item: any) => void;
  onReject?: (item: any) => void;
  loading?: boolean;
}

const getStatusBadgeVariant = (status: Status | ApprovalStatus) => {
  switch (status) {
    case 'Active':
    case 'Approved':
      return 'default';
    case 'Inactive':
    case 'Rejected':
      return 'destructive';
    case 'Pending':
      return 'secondary';
    default:
      return 'outline';
  }
};

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  onEdit,
  onDelete,
  onSubmitForApproval,
  onApprove,
  onReject,
  loading = false,
}) => {
  const { hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id || index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? (
                    column.render(item[column.key], item)
                  ) : column.key === 'status' || column.key === 'approvalStatus' ? (
                    <Badge variant={getStatusBadgeVariant(item[column.key])}>
                      {item[column.key]}
                    </Badge>
                  ) : (
                    item[column.key]
                  )}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex items-center space-x-2">
                  {hasPermission('edit') && onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Edit size={16} />
                    </Button>
                  )}
                  
                  {hasPermission('delete') && onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                  
                  {hasPermission('create') && onSubmitForApproval && item.approvalStatus === 'Draft' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSubmitForApproval(item)}
                    >
                      <Send size={16} />
                    </Button>
                  )}
                  
                  {hasPermission('approve') && onApprove && item.approvalStatus === 'Pending' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onApprove(item)}
                    >
                      <Check size={16} />
                    </Button>
                  )}
                  
                  {hasPermission('reject') && onReject && item.approvalStatus === 'Pending' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onReject(item)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
