import React, { useEffect, useMemo, useState } from 'react'
import apiClient from '../../api/axios'
import { useToast } from '../../components/ToastProvider'

const statusPillClass = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
  resolved: 'bg-blue-100 text-blue-800',
  open: 'bg-violet-100 text-violet-800',
}

const statusOptions = ['pending', 'open', 'approved', 'rejected', 'resolved']

const typePillClass = {
  finance: 'bg-lime-100 text-lime-800',
  contact: 'bg-sky-100 text-sky-800',
  support: 'bg-indigo-100 text-indigo-800',
  application: 'bg-orange-100 text-orange-800',
  ticket: 'bg-fuchsia-100 text-fuchsia-800',
  other: 'bg-gray-200 text-gray-800',
}

const formatDateTime = (value) => {
  if (!value) return '-'
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return '-'

  return parsedDate.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function RequestsManagement() {
  const { showToast } = useToast()
  const [activeType, setActiveType] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState([])
  const [statusDrafts, setStatusDrafts] = useState({})
  const [updatingRequestId, setUpdatingRequestId] = useState(null)
  const [deletingRequestId, setDeletingRequestId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, request: null })
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    typeCounts: {
      all: 0,
      finance: 0,
      contact: 0,
      support: 0,
      application: 0,
      ticket: 0,
      other: 0,
    },
  })
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, hasPrev: false, hasNext: false })

  useEffect(() => {
    setPage(1)
  }, [activeType, statusFilter, query])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/api/subadmin/management/requests', {
          params: {
            type: activeType,
            status: statusFilter,
            search: query,
            page,
            limit: 20,
          },
        })

        setRequests(Array.isArray(response?.data?.data) ? response.data.data : [])
        setStatusDrafts(
          Array.isArray(response?.data?.data)
            ? response.data.data.reduce((accumulator, item) => {
                accumulator[item.id] = item.status || 'pending'
                return accumulator
              }, {})
            : {}
        )
        setSummary(response?.data?.summary || {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          typeCounts: {
            all: 0,
            finance: 0,
            contact: 0,
            support: 0,
            application: 0,
            ticket: 0,
            other: 0,
          },
        })
        setPagination(response?.data?.pagination || { page: 1, totalPages: 1, hasPrev: false, hasNext: false })
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Error',
          message: error?.response?.data?.message || 'Failed to fetch requests',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [activeType, statusFilter, query, page, showToast])
  const typeCounts = useMemo(() => summary?.typeCounts || {}, [summary])

  const handleStatusChange = (requestId, nextStatus) => {
    setStatusDrafts((previous) => ({
      ...previous,
      [requestId]: nextStatus,
    }))
  }

  const handleUpdateStatus = async (request) => {
    const nextStatus = statusDrafts[request.id] || request.status || 'pending'

    if (nextStatus === request.status) {
      showToast({
        type: 'info',
        title: 'No Change',
        message: 'Select a different status before saving.',
      })
      return
    }

    try {
      setUpdatingRequestId(request.id)
      const response = await apiClient.patch(`/api/subadmin/management/requests/${request.id}/status`, {
        status: nextStatus,
      })

      const updatedRequest = response?.data?.data
      setRequests((previous) =>
        previous.map((item) => (item.id === request.id && updatedRequest ? updatedRequest : item))
      )
      setStatusDrafts((previous) => ({
        ...previous,
        [request.id]: updatedRequest?.status || nextStatus,
      }))

      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Request marked as ${updatedRequest?.status || nextStatus}.`,
      })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: error?.response?.data?.message || 'Failed to update request status',
      })
    } finally {
      setUpdatingRequestId(null)
    }
  }

  const openDeleteConfirm = (request) => {
    setDeleteConfirm({ isOpen: true, request })
  }

  const closeDeleteConfirm = () => {
    if (deletingRequestId) return
    setDeleteConfirm({ isOpen: false, request: null })
  }

  const handleDeleteRequest = async () => {
    const request = deleteConfirm?.request
    if (!request?.id) return

    try {
      setDeletingRequestId(request.id)
      await apiClient.delete(`/api/subadmin/management/requests/${request.id}`)

      setRequests((previous) => previous.filter((item) => item.id !== request.id))
      setStatusDrafts((previous) => {
        const next = { ...previous }
        delete next[request.id]
        return next
      })
      setSummary((previous) => {
        const nextTotal = Math.max(0, Number(previous?.total || 0) - 1)
        const nextPending = request.status === 'pending' ? Math.max(0, Number(previous?.pending || 0) - 1) : Number(previous?.pending || 0)
        const nextApproved = request.status === 'approved' ? Math.max(0, Number(previous?.approved || 0) - 1) : Number(previous?.approved || 0)
        const nextRejected = request.status === 'rejected' ? Math.max(0, Number(previous?.rejected || 0) - 1) : Number(previous?.rejected || 0)

        const currentTypeCounts = previous?.typeCounts || {}
        const requestType = request?.type || 'other'
        const nextTypeCounts = {
          ...currentTypeCounts,
          all: Math.max(0, Number(currentTypeCounts?.all || 0) - 1),
        }

        if (Object.prototype.hasOwnProperty.call(nextTypeCounts, requestType)) {
          nextTypeCounts[requestType] = Math.max(0, Number(nextTypeCounts[requestType] || 0) - 1)
        }

        return {
          ...previous,
          total: nextTotal,
          pending: nextPending,
          approved: nextApproved,
          rejected: nextRejected,
          typeCounts: nextTypeCounts,
        }
      })

      showToast({
        type: 'success',
        title: 'Deleted',
        message: 'Request deleted successfully.',
      })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: error?.response?.data?.message || 'Failed to delete request',
      })
    } finally {
      setDeletingRequestId(null)
      setDeleteConfirm({ isOpen: false, request: null })
    }
  }

  const totalCount = Number(summary?.total || 0)
  const pendingCount = Number(summary?.pending || 0)
  const approvedCount = Number(summary?.approved || 0)
  const rejectedCount = Number(summary?.rejected || 0)

  const getDetailItems = (item) => {
    const details = []

    const pushIfPresent = (label, value) => {
      if (value === null || value === undefined) return
      const text = String(value).trim()
      if (!text || text === '-' || text.toLowerCase() === 'null' || text.toLowerCase() === 'undefined') return
      details.push({ label, value: text })
    }

    pushIfPresent('Subject', item?.subject)
    pushIfPresent('Purpose', item?.purpose)
    pushIfPresent('Message', item?.message)
    pushIfPresent('Comments', item?.comments)
    pushIfPresent('Vehicle Number', item?.vehicleNumber)
    pushIfPresent('Chassis Number', item?.chassisNumber)
    pushIfPresent('Vehicle Name', item?.vehicleName)
    pushIfPresent('Manufacture Year', item?.vehicleManufactureYear)

    const extraData = item?.extraData && typeof item.extraData === 'object' ? item.extraData : {}
    Object.entries(extraData).forEach(([key, rawValue]) => {
      if (rawValue === null || rawValue === undefined || rawValue === '') return
      const normalizedLabel = key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/_/g, ' ')
        .replace(/^./, (char) => char.toUpperCase())

      const normalizedValue = typeof rawValue === 'object' ? JSON.stringify(rawValue) : String(rawValue)
      pushIfPresent(normalizedLabel, normalizedValue)
    })

    return details
  }

  return (
    <div className="min-h-full bg-gray-50 px-4 md:px-6 py-5 space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white px-5 py-5 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full bg-[#e8f7d7] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4b6b2a]">
              Requests workspace
            </p>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">Request Center</h1>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Track finance, contact, support and other incoming requests. Update the status from the row and save it instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-white to-[#f2f8ea] border border-[#dfe9d7] shadow-sm">
          <p className="text-xs uppercase font-semibold text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-white border border-amber-100 shadow-sm">
          <p className="text-xs uppercase font-semibold text-amber-700">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm">
          <p className="text-xs uppercase font-semibold text-emerald-700">Approved</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{approvedCount}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-rose-50 to-white border border-rose-100 shadow-sm">
          <p className="text-xs uppercase font-semibold text-rose-700">Rejected</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{rejectedCount}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-4 md:p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'finance', label: 'Finance' },
            { key: 'contact', label: 'Contact' },
            { key: 'support', label: 'Support' },
            { key: 'application', label: 'Application' },
            { key: 'ticket', label: 'Ticket' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveType(tab.key)}
              className={`px-3 py-2 rounded-full text-sm font-semibold transition-all border ${
                activeType === tab.key
                  ? 'bg-[#1f2a16] text-white border-[#1f2a16] shadow'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({typeCounts[tab.key] || 0})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path fill="#9ca3af" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, phone, vehicle, purpose..."
              className="h-11 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b8e986]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-2xl border border-gray-200 bg-white px-3 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b8e986]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="resolved">Resolved</option>
            <option value="open">Open</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-10 text-center bg-gray-50">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gray-100 items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#6b7280" d="M5 3a2 2 0 0 0-2 2v14.5A1.5 1.5 0 0 0 4.5 21H19a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 15.172 3zm9 1.5V8h3.5zM7 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zm0 4a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zm0 4a1 1 0 1 1 0-2h7a1 1 0 1 1 0 2"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No requests found</h3>
            <p className="text-sm text-gray-500 mt-1">Try changing the search or filter.</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:grid grid-cols-12 gap-3 px-5 py-3 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Requester</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">Request Type</div>
              <div className="col-span-2">Purpose</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-1">Status</div>
            </div>

            <div className="divide-y divide-gray-200 bg-white">
              {requests.map((item, index) => {
                const isEvenRow = index % 2 === 0
                const rowClass = isEvenRow ? 'bg-slate-100/90 hover:bg-slate-200/80' : 'bg-[#fbf8f0] hover:bg-[#f1ead9]'
                const detailClass = isEvenRow ? 'border-slate-200 bg-slate-50' : 'border-amber-100 bg-amber-50/60'

                return (
                <div key={item.id} className={`px-4 md:px-5 py-4 transition-colors ${rowClass}`}>
                  <div className="hidden lg:grid grid-cols-12 gap-3 items-start text-sm">
                    <div className="col-span-2 text-gray-700">
                      <p>{formatDateTime(item.createdAt)}</p>
                      <p className="mt-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                        Req {String(index + 1).padStart(2, '0')}
                      </p>
                    </div>
                    <div className="col-span-2 font-semibold text-gray-900">{item.name}</div>
                    <div className="col-span-2 text-gray-700 min-w-0">
                      <div className="break-all">{item.phoneNumber}</div>
                      <div className="text-xs text-gray-500 break-all whitespace-normal">{item.email}</div>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${typePillClass[item.type] || typePillClass.other}`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="col-span-2 text-gray-700 break-words">{item.purpose || '-'}</div>
                    <div className="col-span-1 text-gray-900 font-semibold">{item.requestedAmount > 0 ? `Rs ${item.requestedAmount.toLocaleString('en-IN')}` : '-'}</div>
                    <div className="col-span-1">
                      <div className="space-y-2">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusPillClass[item.status] || 'bg-gray-200 text-gray-800'}`}>
                          {item.status}
                        </span>
                        <select
                          value={statusDrafts[item.id] || item.status || 'pending'}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#b8e986]"
                        >
                          {statusOptions.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(item)}
                          disabled={updatingRequestId === item.id}
                          className="w-full rounded-lg bg-[#1f2a16] px-2 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingRequestId === item.id ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteConfirm(item)}
                          disabled={deletingRequestId === item.id}
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete request"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" d="M9 3h6l1 2h4v2H4V5h4zm1 6h2v9h-2zm4 0h2v9h-2zM7 9h2v9H7zm-1 12a2 2 0 0 1-2-2V8h16v11a2 2 0 0 1-2 2z"/>
                          </svg>
                          <span>{deletingRequestId === item.id ? 'Deleting...' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {getDetailItems(item).length > 0 && (
                    <div className={`hidden lg:block mt-3 rounded-2xl border p-3 ${detailClass}`}>
                      <p className="mb-2 text-xs font-semibold text-gray-700">Request Details</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                        {getDetailItems(item).map((detail, idx) => (
                          <div key={`${item.id}-detail-${idx}`} className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2 text-xs text-gray-700 break-words whitespace-pre-wrap">
                            <span className="font-semibold text-gray-900">{detail.label}:</span>{' '}
                            <span className="break-all">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="lg:hidden space-y-3 text-sm">
                    <div className={`rounded-2xl border p-4 shadow-sm ${isEvenRow ? 'border-slate-200 bg-slate-50' : 'border-amber-100 bg-amber-50/60'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusPillClass[item.status] || 'bg-gray-200 text-gray-800'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${typePillClass[item.type] || typePillClass.other}`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-500">{formatDateTime(item.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 break-all">{item.phoneNumber} | {item.email}</p>
                    <p className="text-gray-700">Purpose: <span className="font-medium">{item.purpose || '-'}</span></p>
                    {item.requestedAmount > 0 && <p className="text-gray-900 font-semibold">Amount: Rs {item.requestedAmount.toLocaleString('en-IN')}</p>}
                    <div className="space-y-2 pt-1 rounded-2xl border border-gray-200 bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">Change Status</p>
                      <select
                        value={statusDrafts[item.id] || item.status || 'pending'}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#b8e986]"
                      >
                        {statusOptions.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item)}
                        disabled={updatingRequestId === item.id}
                        className="w-full rounded-lg bg-[#1f2a16] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingRequestId === item.id ? 'Saving...' : 'Save Status'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteConfirm(item)}
                        disabled={deletingRequestId === item.id}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                          <path fill="currentColor" d="M9 3h6l1 2h4v2H4V5h4zm1 6h2v9h-2zm4 0h2v9h-2zM7 9h2v9H7zm-1 12a2 2 0 0 1-2-2V8h16v11a2 2 0 0 1-2 2z"/>
                        </svg>
                        <span>{deletingRequestId === item.id ? 'Deleting...' : 'Delete Request'}</span>
                      </button>
                    </div>
                    {getDetailItems(item).length > 0 && (
                      <div className={`mt-3 rounded-2xl border p-3 space-y-1 ${detailClass}`}>
                        <p className="text-xs font-semibold text-gray-700">Request Details</p>
                        {getDetailItems(item).map((detail, idx) => (
                          <p key={`${item.id}-mobile-detail-${idx}`} className="text-xs text-gray-700 break-words whitespace-pre-wrap overflow-hidden rounded-lg border border-gray-200 bg-white p-2">
                            <span className="font-semibold text-gray-900">{detail.label}:</span>{' '}
                            <span className="break-all">{detail.value}</span>
                          </p>
                        ))}
                      </div>
                    )}
                    </div>
                  </div>
                </div>
                )
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 md:px-5 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600">
                Page {pagination.page || 1} of {pagination.totalPages || 1}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 rounded-md border border-gray-200 bg-white text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-3 py-1.5 rounded-md border border-gray-200 bg-white text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeDeleteConfirm} />
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#be123c" d="M9 3h6l1 2h4v2H4V5h4zm1 6h2v9h-2zm4 0h2v9h-2zM7 9h2v9H7zm-1 12a2 2 0 0 1-2-2V8h16v11a2 2 0 0 1-2 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Delete request from <span className="font-semibold text-gray-900">{deleteConfirm.request?.name || 'this requester'}</span>?
                </p>
                <p className="mt-1 text-xs text-rose-700">This action cannot be undone.</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={Boolean(deletingRequestId)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRequest}
                disabled={Boolean(deletingRequestId)}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deletingRequestId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RequestsManagement
