import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Button from '../../../components/ui/Button';
import { dbHelpers } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const RequestHandling = () => {
  const { userProfile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await dbHelpers.getHospitalRequests(userProfile?.id, filter);
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      addNotification('Error loading requests', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleStatusUpdate = async (requestId, newStatus, notes = '') => {
    try {
      const updateData = {
        status: newStatus,
        reviewed_by: userProfile?.id,
        reviewed_at: new Date().toISOString(),
        review_notes: notes
      };

      const { error } = await dbHelpers.updateRequestStatus(requestId, updateData);
      if (error) throw error;

      addNotification(`Request ${newStatus} successfully`, 'success');
      loadRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      addNotification('Error updating request status', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'fulfilled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'urgent': return 'text-orange-600 bg-orange-50';
      case 'normal': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityScore = (request) => {
    let score = 0;
    if (request.requester_type === 'hospital') score += 30;
    else if (request.requester_type === 'doctor') score += 20;
    else score += 10;

    if (request.urgency_level === 'critical') score += 25;
    else if (request.urgency_level === 'urgent') score += 15;
    else score += 5;

    if (request.quantity > 5) score += Math.min(request.quantity * 2, 20);

    return score;
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="text-center">Loading requests...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Request Handling - Hospital Dashboard</title>
      </Helmet>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Blood Request Handling</h3>
            <p className="text-sm text-muted-foreground">
              Review and manage blood requests from your hospital and external sources
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`mb-4 p-3 rounded-lg text-sm ${
              notification.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {notification.message}
          </div>
        ))}

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No requests found for the selected filter.
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h4 className="text-lg font-semibold">
                        Request #{request.id.slice(-8)}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency_level)}`}>
                        {request.urgency_level}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Priority: {getPriorityScore(request)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Blood Group</span>
                        <p className="font-semibold">{request.blood_group}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                        <p className="font-semibold">{request.quantity} units</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Requester</span>
                        <p className="font-semibold">{request.requester_name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Type</span>
                        <p className="font-semibold capitalize">{request.requester_type}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm font-medium text-muted-foreground">Patient Info</span>
                      <p className="text-sm">{request.patient_name} - {request.patient_age} years old</p>
                    </div>

                    {request.notes && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-muted-foreground">Notes</span>
                        <p className="text-sm">{request.notes}</p>
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                      Requested: {new Date(request.created_at).toLocaleString()}
                      {request.reviewed_at && (
                        <> • Reviewed: {new Date(request.reviewed_at).toLocaleString()}</>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    {request.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate(request.id, 'approved')}
                          variant="default"
                          size="sm"
                          className="w-full"
                        >
                          Approve Request
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(request.id, 'rejected', 'Insufficient stock')}
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Reject Request
                        </Button>
                      </>
                    )}

                    {request.status === 'approved' && (
                      <Button
                        onClick={() => handleStatusUpdate(request.id, 'fulfilled')}
                        variant="default"
                        size="sm"
                        className="w-full"
                      >
                        Mark as Fulfilled
                      </Button>
                    )}

                    <div className="text-xs text-muted-foreground text-center">
                      {request.status === 'fulfilled' && 'Request has been fulfilled'}
                      {request.status === 'rejected' && 'Request was rejected'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {requests.length}
            </div>
            <div className="text-sm text-blue-600">Total Requests</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-600">Pending Review</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'approved').length}
            </div>
            <div className="text-sm text-green-600">Approved</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {requests.filter(r => r.status === 'rejected').length}
            </div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestHandling;
