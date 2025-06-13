
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check, X, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDataService } from '../services/mockDataService';
import { ApprovalRequest } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Approvals = () => {
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const { toast } = useToast();
  const { currentUser, hasPermission } = useAuth();

  useEffect(() => {
    loadApprovalRequests();
  }, []);

  useEffect(() => {
    let filtered = approvalRequests;
    
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }
    
    setFilteredRequests(filtered);
  }, [approvalRequests, searchTerm, selectedStatus]);

  const loadApprovalRequests = async () => {
    try {
      setLoading(true);
      const data = await mockDataService.getApprovalRequests();
      setApprovalRequests(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load approval requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: ApprovalRequest) => {
    const comments = window.prompt('Please provide approval comments (optional):');
    
    try {
      await mockDataService.approveRequest(request.id, currentUser?.id || 'unknown', comments || undefined);
      toast({
        title: "Success",
        description: "Request approved successfully",
      });
      loadApprovalRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (request: ApprovalRequest) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    try {
      await mockDataService.rejectRequest(request.id, currentUser?.id || 'unknown', reason);
      toast({
        title: "Success",
        description: "Request rejected",
      });
      loadApprovalRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'Pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const StatusFilter = () => (
    <select
      value={selectedStatus}
      onChange={(e) => setSelectedStatus(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md bg-white"
    >
      <option value="all">All Status</option>
      <option value="Pending">Pending</option>
      <option value="Approved">Approved</option>
      <option value="Rejected">Rejected</option>
    </select>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
          <p className="text-gray-600 mt-2">Review and manage approval requests</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <StatusFilter />
      </div>

      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No approval requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'No requests match your current filters.'
                  : 'There are no approval requests at the moment.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{request.entityType} Request</CardTitle>
                    <CardDescription>
                      Requested by {request.requestedBy} on {new Date(request.createdDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {request.comments && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">
                        <strong>Comments:</strong> {request.comments}
                      </p>
                    </div>
                  )}
                  
                  {request.data && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">
                        <strong>Request Data:</strong>
                      </p>
                      <pre className="text-xs mt-1 text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(request.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {request.status === 'Pending' && hasPermission('approve') && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleApprove(request)}
                        className="flex items-center space-x-2"
                      >
                        <Check size={16} />
                        <span>Approve</span>
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(request)}
                        className="flex items-center space-x-2"
                      >
                        <X size={16} />
                        <span>Reject</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Approvals;
