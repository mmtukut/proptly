import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  MessageSquare,
  Calendar,
  User,
  Building2,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Phone,
  Clock,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';

const ClientInquiries = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null); // all, pending, responded

  useEffect(() => {
    loadInquiries();
  }, [user]);

  const loadInquiries = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setRefreshing(true);
    }
    if (!user?.uid) {
      setError('User not authenticated');
      toast.error('Please sign in to view inquiries');
      return;
    }
    setError(null);

    try {
      setLoading(true);
      const inquiriesRef = collection(db, 'inquiries');
      const q = query(
        inquiriesRef,
        where('agentId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const inquiriesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.createdAt?.toDate() || new Date(),
          propertyTitle: data.propertyTitle || 'Untitled Property',
          clientName: data.clientName || 'Anonymous',
          clientEmail: data.clientEmail || 'No email provided',
          status: data.status || 'pending'
        };
      });

      setInquiries(inquiriesData);
      if (inquiriesData.length === 0) {
        toast.info('No inquiries found');
      }
    } catch (error) {
      console.error('Error loading inquiries:', error);
      toast.error('Failed to load inquiries: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadInquiries(true);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    setInquiries(prev => [...prev].reverse());
  };

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    try {
      await updateDoc(doc(db, 'inquiries', inquiryId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setInquiries(prev => prev.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, status: newStatus, updatedAt: new Date() }
          : inquiry
      ));
      
      toast.success('Inquiry status updated');
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast.error('Failed to update inquiry status');
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    return inquiry.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#1c5bde]" />
        <p className="mt-4 text-gray-600">Loading your inquiries...</p>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <XCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-medium text-gray-900">{error || 'Please sign in to view inquiries'}</p>
        <p className="mt-2 text-gray-600">You need to be authenticated to access this page</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Inquiries</h1>
          <p className="text-gray-600">Manage and respond to property inquiries</p>
          {inquiries.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredInquiries.length} of {inquiries.length} inquiries
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg hover:bg-gray-100 text-gray-600 ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={refreshing}
            title="Refresh inquiries"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh inquiries</span>
          </button>
          <button
            onClick={toggleSortOrder}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            title={`Sort by ${sortOrder === 'desc' ? 'oldest' : 'newest'} first`}
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-[#1c5bde] text-white' : 'bg-gray-100'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-[#1c5bde] text-white' : 'bg-gray-100'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('responded')}
            className={`px-4 py-2 rounded-lg ${filter === 'responded' ? 'bg-[#1c5bde] text-white' : 'bg-gray-100'}`}
          >
            Responded
          </button>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No inquiries found' 
                : `No ${filter} inquiries found`}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-2 text-[#1c5bde] hover:underline"
              >
                View all inquiries
              </button>
            )}
          </div>
        ) : (
          filteredInquiries.map(inquiry => (
            <div
              key={inquiry.id}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{inquiry.clientName}</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(inquiry.status)}`}>
                      {`${inquiry.status.charAt(0).toUpperCase()}${inquiry.status.slice(1)}`}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${inquiry.clientEmail}`} className="hover:text-[#1c5bde] hover:underline">{inquiry.clientEmail}</a>
                    </div>
                    {inquiry.clientPhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${inquiry.clientPhone}`} className="hover:text-[#1c5bde] hover:underline">{inquiry.clientPhone}</a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>{inquiry.propertyTitle}</span>
                  </div>

                  <p className="text-gray-700 mt-2">{inquiry.message}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      {inquiry.createdAt.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 sm:mt-0">
                  {inquiry.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(inquiry.id, 'responded')}
                      className="p-2 rounded-lg hover:bg-green-50 group"
                      title="Mark as Responded"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                      <span className="sr-only">Mark as Responded</span>
                    </button>
                  )}
                  {inquiry.status === 'responded' && (
                    <button
                      onClick={() => handleUpdateStatus(inquiry.id, 'closed')}
                      className="p-2 rounded-lg hover:bg-gray-50 group"
                      title="Close Inquiry"
                    >
                      <XCircle className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
                      <span className="sr-only">Close Inquiry</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientInquiries;
