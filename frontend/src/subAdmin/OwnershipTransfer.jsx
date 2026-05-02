import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios';
import { useToast } from '../components/ToastProvider';
import OwnershipTransferForm from './components/OwnershipTransferForm';
import { canEditModule, readStoredSubAdminProfile } from './utils/subAdminAccess';

function OwnershipTransfer() {
  const { showToast } = useToast();
  const { permissions } = readStoredSubAdminProfile();
  const canEditOwnershipTransfer = canEditModule(permissions, 'ownershipTransfer');
  const [transfers, setTransfers] = useState([]);
  const [_totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusCounts, setStatusCounts] = useState({ all: 0 });
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [noteToView, setNoteToView] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState({
    all: 1,
    ekyc: 1,
    token: 1,
    challan: 1,
    'finance approval': 1,
    'rto approval': 1,
    completed: 1
  });
  const itemsPerPage = 10;
  const activePage = currentPage[filterStatus] || 1;

  const fetchTransfers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/subadmin/management/ownership-transfer/all', {
        params: {
          page: activePage,
          limit: itemsPerPage,
          status: filterStatus,
          search: searchQuery.trim() || undefined
        }
      });

      const nextTransfers = response.data?.data || [];
      const nextTotalPages = response.data?.totalPages || 1;

      setTransfers(nextTransfers);
      setTotalCount(response.data?.count || 0);
      setTotalPages(nextTotalPages);
      setStatusCounts(response.data?.statusCounts || { all: 0 });

      if (activePage > nextTotalPages && nextTotalPages > 0) {
        setCurrentPage(prev => ({ ...prev, [filterStatus]: nextTotalPages }));
      }
    } catch (error) {
      console.error('Error fetching transfers:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch ownership transfers'
      });
    } finally {
      setLoading(false);
    }
  }, [showToast, activePage, itemsPerPage, filterStatus, searchQuery]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const handleEditChange = (field, value) => {
    if (!canEditOwnershipTransfer) {
      showToast({ type: 'error', title: 'Access denied', message: 'You can view this section only.' });
      return;
    }

    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const startEdit = (transfer) => {
    if (!canEditOwnershipTransfer) {
      showToast({ type: 'error', title: 'Access denied', message: 'You can view this section only.' });
      return;
    }

    setShowAddForm(false);
    setEditingId(transfer._id);
    setEditedData(transfer);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchTransfers();
  };

  const saveEdit = async () => {
    if (!canEditOwnershipTransfer) {
      showToast({ type: 'error', title: 'Access denied', message: 'You can view this section only.' });
      return;
    }

    if (!editedData.name || !editedData.vehicleName || !editedData.phoneNo || !editedData.vehicleNumber || !editedData.chassisNumber || !editedData.paidAmount) {
      return;
    }

    try {
      await apiClient.put(`/api/subadmin/management/ownership-transfer/update/${editingId}`, editedData);
      showToast({
        type: 'success',
        title: 'Updated',
        message: 'Ownership transfer updated successfully'
      });
      setEditingId(null);
      setEditedData({});
      fetchTransfers();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to update ownership transfer'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!canEditOwnershipTransfer) {
      showToast({ type: 'error', title: 'Access denied', message: 'You can view this section only.' });
      return;
    }

    try {
      await apiClient.delete(`/api/subadmin/management/ownership-transfer/delete/${id}`);
      showToast({
        type: 'success',
        title: 'Deleted',
        message: 'Ownership transfer deleted successfully'
      });
      fetchTransfers();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to delete ownership transfer'
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(prev => ({ ...prev, [filterStatus]: newPage }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
        ekyc: 'bg-purple-100 text-purple-800',
        token: 'bg-blue-100 text-blue-800',
        challan: 'bg-orange-100 text-orange-800',
        'finance approval': 'bg-cyan-100 text-cyan-800',
        'rto approval': 'bg-indigo-100 text-indigo-800',
        completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatusLabel = (status = '') => {
    return status
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(prev => ({ ...prev, [filterStatus]: 1 }));
  };

  return (
    <div className="flex-1 px-3 py-4 sm:px-4 sm:py-5 md:p-6 bg-white max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ownership Transfer</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage vehicle ownership transfer entries</p>
            </div>
            <button
              onClick={() => {
                if (!canEditOwnershipTransfer) {
                  showToast({ type: 'error', title: 'Access denied', message: 'You can view this section only.' });
                  return;
                }
                setShowAddForm(prev => !prev);
                setEditingId(null);
              }}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#B0FF1C] to-[#40FF00] hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow"
            >
              {showAddForm ? 'Close Add Form' : 'Add Data'}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-sm p-3 sm:p-6">
            <div className="flex items-center gap-3 pb-4 border-b mb-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#40FF00" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2"/></svg>
              </span>
              <div>
                <p className="text-base sm:text-lg font-semibold text-gray-900">Add New Entry</p>
                <p className="text-xs sm:text-sm text-gray-500">Enter the ownership transfer details</p>
              </div>
            </div>
            <OwnershipTransferForm onSubmitSuccess={handleAddSuccess} />
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, phone, vehicle number, or chassis number..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 rounded-xl border border-gray-300 shadow-inner bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
            />
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314"/></svg>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => { setFilterStatus('all'); setCurrentPage(prev => ({ ...prev, all: 1 })); }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-[#40FF00] text-gray-900'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            All ({statusCounts.all || 0})
          </button>
          <button
            onClick={() => { setFilterStatus('ekyc'); setCurrentPage(prev => ({ ...prev, ekyc: 1 })); }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              filterStatus === 'ekyc'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            E-KYC ({statusCounts.ekyc || 0})
          </button>
          <button
            onClick={() => { setFilterStatus('token'); setCurrentPage(prev => ({ ...prev, token: 1 })); }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              filterStatus === 'token'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Token ({statusCounts.token || 0})
          </button>
          <button
            onClick={() => { setFilterStatus('challan'); setCurrentPage(prev => ({ ...prev, challan: 1 })); }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              filterStatus === 'challan'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Challan ({statusCounts.challan || 0})
          </button>
          <button
            onClick={() => { setFilterStatus('finance approval'); setCurrentPage(prev => ({ ...prev, 'finance approval': 1 })); }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              filterStatus === 'finance approval'
                ? 'bg-cyan-100 text-cyan-800'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Finance Approval ({statusCounts['finance approval'] || 0})
          </button>
          <button
            onClick={() => { setFilterStatus('rto approval'); setCurrentPage(prev => ({ ...prev, 'rto approval': 1 })); }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              filterStatus === 'rto approval'
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            RTO Approval ({statusCounts['rto approval'] || 0})
          </button>
          <button
            onClick={() => { setFilterStatus('completed'); setCurrentPage(prev => ({ ...prev, completed: 1 })); }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              filterStatus === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Completed ({statusCounts.completed || 0})
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-[#40FF00] animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading transfers...</p>
              </div>
            </div>
          ) : transfers.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" className="mx-auto mb-4 text-gray-400">
                  <path fill="currentColor" d="M8.542 6.012Q8.3 5.769 8.3 5.446t.242-.565l1.402-1.402q.217-.217.522-.348T11.094 3h6.29q.691 0 1.154.463T19 4.616v9.87q0 .541-.497.743t-.876-.177zM6.616 21q-.691 0-1.153-.462T5 19.385V9.095q0-.324.13-.629q.132-.304.349-.522l.39-.39L2.4 4.084q-.146-.145-.153-.343q-.006-.199.159-.364q.165-.16.354-.162t.354.162l17.663 17.664q.14.14.15.34q.01.202-.15.367q-.165.165-.357.165t-.357-.165l-3.478-3.479l.713-.707L19 19.263v.121q0 .691-.462 1.153T17.384 21z"/>
                </svg>
                <p className="text-gray-600">No ownership transfers found</p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <table className="w-full table-fixed">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18"/></svg>
                        <span>Name</span>
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M7 3.5a.5.5 0 0 1 .5-.5h1.112a1.5 1.5 0 0 1 1.36.868l.335.722c.274-.359.707-.59 1.193-.59h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1q-.038 0-.075-.002l.497 1.07Q12.2 8 12.5 8a2.5 2.5 0 1 1-1.485.489l-.346-.745A2.5 2.5 0 0 1 8.5 9h-3c.219.29.375.63.45 1h2.814a2.5 2.5 0 0 1-2 1H5.95A2.5 2.5 0 1 1 3.5 8h2.191L6 7.382A2.5 2.5 0 0 1 8.236 6H9.86l-.794-1.71A.5.5 0 0 0 8.612 4H7.5a.5.5 0 0 1-.5-.5m5.047 7.21l-.596-1.282a1.5 1.5 0 1 0 .907-.421l.595 1.282a.5.5 0 0 1-.906.422M3.5 9a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M11 5.5a.5.5 0 0 0 .5.5h.5V5h-.5a.5.5 0 0 0-.5.5"/></svg>
                        <span>Vehicle Name</span>
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z" clipRule="evenodd"/><path fill="currentColor" d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862" opacity=".6"/></svg>
                        Phone
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 24"><path fill="currentColor" d="M8.632 15.526a2.11 2.11 0 0 0-2.106 2.105v4.305a2.106 2.106 0 0 0 4.212 0v-.043v.002v-4.263a2.11 2.11 0 0 0-2.104-2.106z"/><path fill="currentColor" d="M16.263 2.631H12.21C11.719 1.094 10.303 0 8.631 0S5.544 1.094 5.06 2.604l-.007.027h-4a1.053 1.053 0 0 0 0 2.106h4.053c.268.899.85 1.635 1.615 2.096l.016.009c-2.871.867-4.929 3.48-4.947 6.577v5.528a1.753 1.753 0 0 0 1.736 1.737h1.422v-3a3.737 3.737 0 1 1 7.474 0v3h1.421a1.75 1.75 0 0 0 1.738-1.737v-5.474a6.855 6.855 0 0 0-4.899-6.567l-.048-.012a3.65 3.65 0 0 0 1.625-2.08l.007-.026h4.053a1.056 1.056 0 0 0 1.053-1.053a1.15 1.15 0 0 0-1.104-1.105h-.002zM8.631 5.84a2.106 2.106 0 1 1 2.106-2.106l.001.06c0 1.13-.916 2.046-2.046 2.046l-.063-.001h.003z"/></svg>
                        Vehicle No
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M14.975 3.5a1.25 1.25 0 0 0-2.45-.5L11.2 9.5H5.25a1.25 1.25 0 1 0 0 2.5h5.439L9.26 19H4.25a1.25 1.25 0 0 0 0 2.5h4.5l-1.225 6a1.25 1.25 0 1 0 2.45.5l1.327-6.5h6.948l-1.224 6a1.25 1.25 0 1 0 2.449.5l1.326-6.5h5.949a1.25 1.25 0 1 0 0-2.5h-5.438l1.428-7h5.01a1.25 1.25 0 1 0 0-2.5h-4.5l1.225-6a1.25 1.25 0 0 0-2.45-.5L20.7 9.5h-6.95zM18.76 19h-6.948l1.428-7h6.949z"/></svg>
                        Chassis No
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M4 6.8V8H2.8A1.8 1.8 0 0 0 1 9.8v8.4A1.8 1.8 0 0 0 2.8 20h16.4a1.8 1.8 0 0 0 1.8-1.8V17h1.2c.992 0 1.8-.808 1.8-1.8V6.8c0-.992-.808-1.8-1.8-1.8H5.8C4.808 5 4 5.808 4 6.8M6 7v1h13.2A1.8 1.8 0 0 1 21 9.8V15h1V7zm3 7a2 2 0 1 1 4 0a2 2 0 0 1-4 0" clipRule="evenodd"/></svg>
                        Amount
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 56 56"><path fill="currentColor" d="m50.923 21.002l.046.131l.171.566l.143.508l.061.232l.1.42a23.93 23.93 0 0 1-2.653 17.167a23.93 23.93 0 0 1-13.57 10.89l-.404.12l-.496.128l-.717.17a1.89 1.89 0 0 1-2.288-1.558a2.127 2.127 0 0 1 1.606-2.389l.577-.145q.54-.142.929-.273a19.93 19.93 0 0 0 10.899-8.943a19.93 19.93 0 0 0 2.292-13.923l-.069-.313l-.092-.365l-.115-.418l-.138-.47a2.135 2.135 0 0 1 1.26-2.602a1.894 1.894 0 0 1 2.458 1.067M7.385 19.92q.065.02.128.044A2.127 2.127 0 0 1 8.78 22.55q-.27.909-.39 1.513a19.93 19.93 0 0 0 2.295 13.91a19.93 19.93 0 0 0 10.911 8.947l.306.097l.174.05l.39.106l.694.171a2.135 2.135 0 0 1 1.623 2.393a1.894 1.894 0 0 1-2.152 1.594l-.138-.025l-.576-.135l-.51-.13l-.446-.125l-.2-.06A23.93 23.93 0 0 1 7.22 39.972a23.93 23.93 0 0 1-2.647-17.197l.077-.32l.1-.375l.194-.665l.076-.25a1.89 1.89 0 0 1 2.365-1.246M28.051 12c8.837 0 16 7.163 16 16s-7.163 16-16 16s-16-7.163-16-16s7.164-16 16-16m0 4c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.628 0 12-5.373 12-12s-5.372-12-12-12m0-12a23.93 23.93 0 0 1 16.217 6.306l.239.227l.275.274l.31.322l.346.369a1.89 1.89 0 0 1-.205 2.76a2.127 2.127 0 0 1-2.873-.196q-.326-.345-.605-.617l-.35-.334l-.16-.143A19.93 19.93 0 0 0 28.051 8a19.93 19.93 0 0 0-13.204 4.976l-.114.102l-.253.24l-.287.285l-.495.515c-.76.809-2.014.9-2.883.21a1.894 1.894 0 0 1-.305-2.662l.09-.106l.405-.431l.368-.378q.262-.263.484-.465A23.93 23.93 0 0 1 28.05 4"/></svg>
                        Status
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Notes</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transfers.map(transfer => (
                    <tr key={transfer._id} className={`hover:bg-gray-50 transition-colors ${editingId === transfer._id ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 text-sm">
                        {editingId === transfer._id ? (
                          <input
                            type="text"
                            value={editedData.name || ''}
                            onChange={(e) => handleEditChange('name', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                          />
                        ) : (
                          <span className="font-medium text-gray-900">{transfer.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {editingId === transfer._id ? (
                          <input
                            type="text"
                            value={editedData.vehicleName || ''}
                            onChange={(e) => handleEditChange('vehicleName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                            placeholder="Vehicle name"
                          />
                        ) : (
                          <span className="font-medium text-gray-900">{transfer.vehicleName || '-'}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {editingId === transfer._id ? (
                          <input
                            type="text"
                            value={editedData.phoneNo || ''}
                            onChange={(e) => handleEditChange('phoneNo', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                          />
                        ) : (
                          <span className="text-gray-700">{transfer.phoneNo}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {editingId === transfer._id ? (
                          <input
                            type="text"
                            value={editedData.vehicleNumber || ''}
                            onChange={(e) => handleEditChange('vehicleNumber', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff86a] font-mono"
                          />
                        ) : (
                          <span className="block text-gray-700 font-mono break-all">{transfer.vehicleNumber}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {editingId === transfer._id ? (
                          <input
                            type="text"
                            value={editedData.chassisNumber || ''}
                            onChange={(e) => handleEditChange('chassisNumber', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff86a] font-mono"
                          />
                        ) : (
                          <span className="block text-gray-700 font-mono break-all">{transfer.chassisNumber}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {editingId === transfer._id ? (
                          <input
                            type="text"
                            value={editedData.paidAmount || ''}
                            onChange={(e) => handleEditChange('paidAmount', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                          />
                        ) : (
                          <span className="font-semibold text-gray-900 whitespace-nowrap">₹{parseInt(transfer.paidAmount).toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {editingId === transfer._id ? (
                          <select
                            value={editedData.status || 'ekyc'}
                            onChange={(e) => handleEditChange('status', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                          >
                            <option value="ekyc">E-KYC</option>
                            <option value="token">Token</option>
                            <option value="challan">Challan</option>
                            <option value="finance approval">Finance Approval</option>
                            <option value="rto approval">RTO Approval</option>
                            <option value="completed">Completed</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide whitespace-nowrap ${getStatusColor(transfer.status)}`}>
                            {formatStatusLabel(transfer.status)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm align-top">
                        {editingId === transfer._id ? (
                          <div className="w-full max-w-md pt-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Edit Note</p>
                            <textarea
                              value={editedData.notes || ''}
                              onChange={(e) => handleEditChange('notes', e.target.value)}
                              placeholder="Enter note"
                              className="block w-52  min-h-48 rounded-xl border border-gray-300 px-4 py-3 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-[#bff86a] resize-y bg-white font-medium"
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setNoteToView(transfer.notes || 'No notes added')}
                            className="px-3 py-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold transition-colors"
                          >
                            Note
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm align-top">
                        {editingId === transfer._id ? (
                          <div className="flex gap-1.5 items-center justify-center">
                            <button
                              onClick={saveEdit}
                              className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Save changes"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-md bg-slate-300 hover:bg-slate-400 text-slate-700 font-semibold text-xs transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Cancel editing"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1.5 items-center justify-center">
                            <button
                              onClick={() => startEdit(transfer)}
                              className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Edit entry"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19H4v-3L16.5 3.5z"></path></svg>
                            </button>
                            <button
                              onClick={() => handleDelete(transfer._id)}
                              className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold text-xs transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Delete entry"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:hidden">
                {transfers.map(transfer => (
                  <div
                    key={transfer._id}
                    className={`rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm ${editingId === transfer._id ? 'ring-2 ring-[#bff86a]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base sm:text-lg font-semibold text-gray-900">{transfer.name}</p>
                        <p className="mt-1 text-xs sm:text-sm text-gray-500">{transfer.phoneNo}</p>
                        <p className="mt-1 text-xs sm:text-sm font-medium text-gray-700">{transfer.vehicleName || '-'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Status</p>
                        <span className={`mt-1 inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide whitespace-nowrap ${getStatusColor(transfer.status)}`}>
                          {formatStatusLabel(transfer.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Vehicle Name</p>
                        <p className="mt-1 text-gray-900 break-words">{transfer.vehicleName || '-'}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Vehicle No</p>
                        <p className="mt-1 font-mono text-gray-900 break-all">{transfer.vehicleNumber}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Chassis No</p>
                        <p className="mt-1 font-mono text-gray-900 break-all">{transfer.chassisNumber}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Amount</p>
                        <p className="mt-1 font-semibold text-gray-900">₹{parseInt(transfer.paidAmount).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Notes</p>
                        <button
                          type="button"
                          onClick={() => setNoteToView(transfer.notes || 'No notes added')}
                          className="mt-2 inline-flex rounded-lg px-3 py-1 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                        >
                          View Note
                        </button>
                      </div>
                    </div>

                    {editingId === transfer._id ? (
                      <div className="mt-4 space-y-2.5 sm:space-y-3">
                        <input
                          type="text"
                          value={editedData.name || ''}
                          onChange={(e) => handleEditChange('name', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={editedData.vehicleName || ''}
                          onChange={(e) => handleEditChange('vehicleName', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                          placeholder="Vehicle Name"
                        />
                        <input
                          type="text"
                          value={editedData.phoneNo || ''}
                          onChange={(e) => handleEditChange('phoneNo', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                          placeholder="Phone"
                        />
                        <input
                          type="text"
                          value={editedData.vehicleNumber || ''}
                          onChange={(e) => handleEditChange('vehicleNumber', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                          placeholder="Vehicle No"
                        />
                        <input
                          type="text"
                          value={editedData.chassisNumber || ''}
                          onChange={(e) => handleEditChange('chassisNumber', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                          placeholder="Chassis No"
                        />
                        <input
                          type="text"
                          value={editedData.paidAmount || ''}
                          onChange={(e) => handleEditChange('paidAmount', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                          placeholder="Amount"
                        />
                        <select
                          value={editedData.status || 'ekyc'}
                          onChange={(e) => handleEditChange('status', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                        >
                          <option value="ekyc">E-KYC</option>
                          <option value="token">Token</option>
                          <option value="challan">Challan</option>
                          <option value="finance approval">Finance Approval</option>
                          <option value="rto approval">RTO Approval</option>
                          <option value="completed">Completed</option>
                        </select>
                        <textarea
                          value={editedData.notes || ''}
                          onChange={(e) => handleEditChange('notes', e.target.value)}
                          placeholder="Enter note"
                          className="w-full min-h-40 sm:min-h-48 rounded-xl border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-[#bff86a] resize-y"
                        />
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                          <button
                            onClick={saveEdit}
                            className="px-3 sm:px-4 py-2 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 font-semibold transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 sm:px-4 py-2 rounded-lg text-sm text-gray-600 bg-gray-200 hover:bg-gray-300 font-semibold transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => startEdit(transfer)}
                          className="px-3 sm:px-4 py-2 rounded-lg text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(transfer._id)}
                          className="px-3 sm:px-4 py-2 rounded-lg text-sm text-red-600 bg-red-50 hover:bg-red-100 font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination - Bottom Right */}
        {transfers.length > 0 && (
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center sm:justify-end gap-2">
            <button
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 1}
              className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              ← Prev
            </button>

            <span className="text-xs font-semibold text-gray-700 px-1 sm:px-2">
              Page <span className="text-[#40FF00]">{activePage}</span> of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {noteToView !== null && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-3 py-3 sm:px-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white p-4 sm:p-8 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b pb-4 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Note</h2>
              <button
                type="button"
                onClick={() => setNoteToView(null)}
                className="rounded-lg px-3 py-1 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <p className="whitespace-pre-wrap break-words break-all text-sm sm:text-base leading-6 sm:leading-7 text-gray-700">
              {noteToView}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnershipTransfer;
