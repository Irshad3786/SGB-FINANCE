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

const typePillClass = {
  finance: 'bg-lime-100 text-lime-800',
  contact: 'bg-sky-100 text-sky-800',
  support: 'bg-indigo-100 text-indigo-800',
  application: 'bg-orange-100 text-orange-800',
  documentation: 'bg-cyan-100 text-cyan-800',
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
      documentation: 0,
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
            documentation: 0,
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
    <div className="px-4 md:px-6 py-4 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Requests Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track finance, contact, support and other incoming requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 bg-white border shadow-sm">
          <p className="text-xs uppercase font-semibold text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</p>
        </div>
        <div className="rounded-2xl p-4 bg-white border shadow-sm">
          <p className="text-xs uppercase font-semibold text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
        </div>
        <div className="rounded-2xl p-4 bg-white border shadow-sm">
          <p className="text-xs uppercase font-semibold text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{approvedCount}</p>
        </div>
        <div className="rounded-2xl p-4 bg-white border shadow-sm">
          <p className="text-xs uppercase font-semibold text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{rejectedCount}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm p-4 md:p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'finance', label: 'Finance' },
            { key: 'contact', label: 'Contact' },
            { key: 'support', label: 'Support' },
            { key: 'application', label: 'Application' },
            { key: 'documentation', label: 'Documentation' },
            { key: 'ticket', label: 'Ticket' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveType(tab.key)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeType === tab.key
                  ? 'bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#9EEA88]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9EEA88]"
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

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gray-100 items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#6b7280" d="M5 3a2 2 0 0 0-2 2v14.5A1.5 1.5 0 0 0 4.5 21H19a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 15.172 3zm9 1.5V8h3.5zM7 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zm0 4a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zm0 4a1 1 0 1 1 0-2h7a1 1 0 1 1 0 2"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No requests found</h3>
            <p className="text-sm text-gray-500 mt-1">Try changing search or filter, or wait for new requests.</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:grid grid-cols-12 gap-3 px-5 py-3 border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Requester</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">Request Type</div>
              <div className="col-span-2">Purpose</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-1">Status</div>
            </div>

            <div className="divide-y">
              {requests.map((item) => (
                <div key={item.id} className="px-4 md:px-5 py-4 hover:bg-gray-50/70 transition-colors">
                  <div className="hidden lg:grid grid-cols-12 gap-3 items-start text-sm">
                    <div className="col-span-2 text-gray-700">{formatDateTime(item.createdAt)}</div>
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
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusPillClass[item.status] || 'bg-gray-200 text-gray-800'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {getDetailItems(item).length > 0 && (
                    <div className="hidden lg:block mt-3 rounded-lg bg-gray-50 border border-gray-200 p-3">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Request Details</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                        {getDetailItems(item).map((detail, idx) => (
                          <div key={`${item.id}-detail-${idx}`} className="text-xs text-gray-700 break-words whitespace-pre-wrap overflow-hidden">
                            <span className="font-semibold text-gray-900">{detail.label}:</span>{' '}
                            <span className="break-all">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="lg:hidden space-y-2 text-sm">
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
                    {getDetailItems(item).length > 0 && (
                      <div className="rounded-lg bg-gray-50 border border-gray-200 p-2 space-y-1">
                        <p className="text-xs font-semibold text-gray-700">Request Details</p>
                        {getDetailItems(item).map((detail, idx) => (
                          <p key={`${item.id}-mobile-detail-${idx}`} className="text-xs text-gray-700 break-words whitespace-pre-wrap overflow-hidden">
                            <span className="font-semibold text-gray-900">{detail.label}:</span>{' '}
                            <span className="break-all">{detail.value}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-4 md:px-5 py-3 border-t bg-gray-50">
              <p className="text-xs text-gray-600">
                Page {pagination.page || 1} of {pagination.totalPages || 1}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RequestsManagement
