import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import EditUserModal from '../components/EditUserModal'
import InvoicePreviewModal from '../components/InvoicePreviewModal'
import apiClient from '../../api/axios'
import { useToast } from '../../components/ToastProvider'

const getTodayInputDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDisplayDate = (value) => {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-IN')
}

function Users () {
  const PAGE_SIZE = 10
  const { showToast } = useToast()
  const [modalUser, setModalUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editOpen, setEditOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ from: '', to: getTodayInputDate(), status: 'all' })
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [deleteUserId, setDeleteUserId] = useState(null)
  const [page, setPage] = useState(1)
  const [showInvoicePreview, setShowInvoicePreview] = useState(false)
  const [invoice, setInvoice] = useState(null)
  const [invoiceMode, setInvoiceMode] = useState(null)
  const printInvoiceRef = useRef(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalRecords: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const isInitialLoadRef = useRef(true)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput)
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [searchInput])

  const fetchUsers = useCallback(async (targetPage) => {
    try {
      if (isInitialLoadRef.current) {
        setLoading(true)
      }
      setError(null)
      const params = {
        page: targetPage,
        limit: PAGE_SIZE,
        status: filters.status,
      }

      const trimmedSearch = search.trim()
      if (trimmedSearch) {
        params.search = trimmedSearch
      }

      if (filters.from && filters.to) {
        params.from = filters.from
        params.to = filters.to
      }

      const response = await apiClient.get('/api/subadmin/management/users', {
        params,
      })
      if (response.data?.success && response.data?.data) {
        const responsePagination = response.data?.pagination || {}
        const responseData = Array.isArray(response.data?.data) ? response.data.data : []
        const limit = PAGE_SIZE
        const serverTotalRecords = Number(responsePagination.totalRecords) > 0
          ? Number(responsePagination.totalRecords)
          : Number(response.data?.total) || responseData.length

        const isUnpaginatedPayload = responseData.length > limit

        const totalRecords = isUnpaginatedPayload ? responseData.length : serverTotalRecords
        const totalPages = Math.max(1, Math.ceil(totalRecords / limit))
        const currentPage = Math.min(Math.max(1, targetPage), totalPages)
        const startIndex = (currentPage - 1) * limit
        const pageData = isUnpaginatedPayload
          ? responseData.slice(startIndex, startIndex + limit)
          : responseData

        setUsers(pageData)
        setPagination({
          page: currentPage,
          limit,
          totalRecords,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        })

        setPage(prevPage => (prevPage === currentPage ? prevPage : currentPage))
      } else {
        setError('Failed to fetch users')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.response?.data?.message || 'Failed to fetch user data')
    } finally {
      if (isInitialLoadRef.current) {
        setLoading(false)
        isInitialLoadRef.current = false
      }
    }
  }, [filters.from, filters.to, filters.status, search])

  const handleFilterChange = (key, value) => {
    setPage(1)
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleCloseFilters = () => {
    setPage(1)
    setFilters(prev => ({ ...prev, from: '', to: getTodayInputDate() }))
    setShowFilters(false)
  }

  // Fetch user data from API
  useEffect(() => {
    fetchUsers(page)
  }, [page, fetchUsers])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setModalUser(null)
    }
    if (modalUser) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalUser])

  async function handleSave(updated) {
    if (!updated || !updated.id || !modalUser) return

    const {
      sellerProfile,
      sellerAadhaarFront,
      sellerAadhaarBack,
      buyerProfile,
      buyerAadhaarFront,
      buyerAadhaarBack,
      ...editablePayload
    } = updated

    const payload = {
      ...editablePayload,
      sellerId: modalUser.sellerId || null,
      buyerId: modalUser.buyerId || null,
    }

    try {
      setError(null)
      const response = await apiClient.put('/api/subadmin/management/users', payload)
      setEditOpen(false)

      const mergedModalUser = {
        ...modalUser,
        ...editablePayload,
        vehicle: editablePayload.vehicleNumber ?? modalUser.vehicle,
      }
      setModalUser(mergedModalUser)

      await fetchUsers(page)
      showToast({
        type: 'success',
        title: 'Saved',
        message: response?.data?.message || 'User details updated successfully',
      })
    } catch (err) {
      console.error('Error updating user:', err)
      setError(err.response?.data?.message || 'Failed to update user data')
    }
  }

  async function handleDelete() {
    if (!deleteUserId) return

    const selectedUser =
      users.find((u) => u.id === deleteUserId) ||
      (modalUser?.id === deleteUserId ? modalUser : null)

    if (!selectedUser) {
      setDeleteUserId(null)
      return
    }

    try {
      setError(null)
      const payload = {
        sellerId: selectedUser.sellerId || null,
        buyerId: selectedUser.buyerId || null,
      }

      const response = await apiClient.delete('/api/subadmin/management/users', {
        data: payload,
      })

      await fetchUsers(page)
      setDeleteUserId(null)
      setModalUser(null)

      showToast({
        type: 'success',
        title: 'Deleted',
        message: response?.data?.message || 'User deleted permanently',
      })
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err.response?.data?.message || 'Failed to delete user data')
      showToast({
        type: 'error',
        title: 'Error',
        message: err.response?.data?.message || 'Failed to delete user data',
      })
    }
  }

  // Invoice functions
  const buildSellerInvoice = () => {
    // Map from different possible field names (sowoco from model, sellerSoWoCo from form, etc.)
    const soWoCo = modalUser.sellerSoWoCo || modalUser.sowoco || modalUser.soWoCo || ''
    const district = modalUser.sellerDistrict || modalUser.sellerData?.district || modalUser.district || ''
    const mandal = modalUser.sellerMandal || modalUser.sellerData?.mandal || modalUser.mandal || ''
    
    const invoiceData = {
      mode: 'seller',
      typeLabel: 'Seller',
      invoiceNo: `INV-${modalUser.id}`,
      date: new Date().toISOString().split('T')[0],
      fullName: modalUser.seller || '',
      soWoCo: soWoCo,
      phone: modalUser.sellerPhone || modalUser.phoneNo || '',
      aadhaar: modalUser.sellerAadhaar || modalUser.aadharNo || '',
      address: modalUser.sellerAddress || modalUser.fullAddress || '',
      district: district,
      mandal: mandal,
      vehicleNo: modalUser.vehicle || '',
      vehicleName: modalUser.vehicleName || '',
      regNo: modalUser.regNo || '',
      model: modalUser.model || '',
      chassisNo: modalUser.chassis || modalUser.chassisNo || '',
      saleAmount: modalUser.soldAmount || 0,
    }
    setInvoice(invoiceData)
    setInvoiceMode('seller')
    setShowInvoicePreview(true)
  }

  const buildBuyerInvoice = () => {
    // Map from different possible field names (sowoco from model, buyerSoWoCo from form, etc.)
    const soWoCo = modalUser.buyerSoWoCo || modalUser.sowoco || modalUser.soWoCo || ''
    const district = modalUser.buyerDistrict || modalUser.buyerData?.district || modalUser.district || ''
    const mandal = modalUser.buyerMandal || modalUser.buyerData?.mandal || modalUser.mandal || ''
    
    const invoiceData = {
      mode: 'buyer',
      typeLabel: 'Buyer',
      invoiceNo: `INV-${modalUser.id}`,
      date: new Date().toISOString().split('T')[0],
      fullName: modalUser.buyerName || modalUser.name || '',
      soWoCo: soWoCo,
      phone: modalUser.buyerPhone || modalUser.phoneNo || '',
      aadhaar: modalUser.buyerAadhaar || modalUser.aadharNo || '',
      address: modalUser.buyerAddress || modalUser.fullAddress || '',
      district: district,
      mandal: mandal,
      vehicleNo: modalUser.vehicle || modalUser.vehicleNumber || '',
      vehicleName: modalUser.vehicleName || '',
      regNo: modalUser.regNo || '',
      model: modalUser.model || '',
      chassisNo: modalUser.chassis || modalUser.chassisNo || '',
      saleAmount: modalUser.buyAmount || modalUser.soldamount || 0,
      agreementNo: modalUser.agreementNo || '',
      financeAmount: modalUser.financeAmount || null,
      emiAmount: modalUser.emiAmount || null,
      emiMonths: modalUser.emiMonths || null,
      emiDate: formatDisplayDate(modalUser.emiDate),
      pendingAmount: modalUser.pendingAmount || null,
      pendingDate: modalUser.pendingDate || '',
    }
    setInvoice(invoiceData)
    setInvoiceMode('buyer')
    setShowInvoicePreview(true)
  }

  const printInvoice = useReactToPrint({
    contentRef: printInvoiceRef,
    documentTitle: `Invoice-${invoice?.invoiceNo || 'N/A'}`,
  })

  const handleInvoicePreviewClose = () => {
    setShowInvoicePreview(false)
    setInvoice(null)
    setInvoiceMode(null)
  }

  return (
    <div className="p-6">
      {/* hide scrollbar but keep scrolling */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none;}
        .no-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}
      `}</style>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full mb-3"></div>
            <p className="text-gray-600">Loading user data...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm"><strong>Error:</strong> {error}</p>
        </div>
      )}

      {/* Main content (only show if not loading) */}
      {!loading && (
        <>
      <div className="md:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(s => !s)} aria-expanded={showFilters} className="flex items-center gap-2 px-4 py-2 border font-semibold rounded-lg shadow hover:shadow-md transition-shadow bg-white text-base">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#a6a6a6" fillRule="evenodd" d="M5 3h14L8.816 13.184a2.7 2.7 0 0 0-.778-1.086c-.228-.198-.547-.377-1.183-.736l-2.913-1.64c-.949-.533-1.423-.8-1.682-1.23C2 8.061 2 7.541 2 6.503v-.69c0-1.326 0-1.99.44-2.402C2.878 3 3.585 3 5 3" clipRule="evenodd"/>
              <path fill="#a6a6a6" d="M22 6.504v-.69c0-1.326 0-1.99-.44-2.402C21.122 3 20.415 3 19 3L8.815 13.184q.075.193.121.403c.064.285.064.619.064 1.286v2.67c0 .909 0 1.364.252 1.718c.252.355.7.53 1.594.88c1.879.734 2.818 1.101 3.486.683S15 19.452 15 17.542v-2.67c0-.666 0-1 .063-1.285a2.68 2.68 0 0 1 .9-1.49c.227-.197.545-.376 1.182-.735l2.913-1.64c.948-.533 1.423-.8 1.682-1.23c.26-.43.26-.95.26-1.988" opacity="0.5"/>
            </svg>
            select filter
          </button>
        </div>

        

        <div className="w-full max-w-sm py-4">
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#a6a6a6" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"/>
              </svg>
            </div>

            <input
              id="user-search"
              type="search"
              name="search"
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => {
                setPage(1)
                setSearchInput(e.target.value)
              }}
              className="w-full pl-10 pr-3 py-3 rounded-3xl border border-transparent bg-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a] shadow-[1px_2px_9px_-4px_rgba(0,_0,_0,_0.7)]"
            />
          </div>
        </div>


        
      </div>


      {/* Filter panel (visible after clicking select filter) */}
        {showFilters && (
          <div className="mt-2 mb-4 md:mt-0  w-full md:w-fit bg-[#f0f0fa] rounded-lg p-3 shadow flex flex-col md:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16"><path fill="#a6a6a6" d="M5.75 7.5a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m1.5.75A.75.75 0 0 1 8 7.5h2.25a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75M5.75 9.5a.75.75 0 0 0 0 1.5H8a.75.75 0 0 0 0-1.5z"/><path fill="#a6a6a6" fill-rule="evenodd" d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1M3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1z" clip-rule="evenodd"/></svg>              </span>
              <div className="flex items-center gap-2">
                <label className="text-[12px] text-gray-500">Date range</label>
                <input type="date" value={filters.from} onChange={(e)=> handleFilterChange('from', e.target.value)} className="text-xs border rounded px-2 py-1" />
                <span className="text-gray-400">—</span>
                <input type="date" value={filters.to} onChange={(e)=> handleFilterChange('to', e.target.value)} className="text-xs border rounded px-2 py-1" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-700">
              <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M15 16.69V13h1.5v2.82l2.44 1.41l-.75 1.3zM19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.58-1.58c.14.19.3.36.47.53A7.001 7.001 0 0 0 21 11.1V2zM11.1 11c-.6.57-1.07 1.25-1.43 2H6v-2zm-2.03 4c-.07.33-.07.66-.07 1s0 .67.07 1H6v-2zM18 9H6V7h12zm2.85 7c0 .64-.12 1.27-.35 1.86c-.26.58-.62 1.14-1.07 1.57c-.43.45-.99.81-1.57 1.07c-.59.23-1.22.35-1.86.35c-2.68 0-4.85-2.17-4.85-4.85c0-1.29.51-2.5 1.42-3.43c.93-.91 2.14-1.42 3.43-1.42c2.67 0 4.85 2.17 4.85 4.85"/></svg>              </span>
              <div className="flex items-center gap-2">
                <label className="text-[12px] text-gray-500">Status</label>
                <select value={filters.status} onChange={(e)=> handleFilterChange('status', e.target.value)} className="text-xs border rounded px-2 py-1">
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="buyer pending">Buyer Pending</option>
                  <option value="seller pending">Seller Pending</option>
                </select>
              </div>
            </div>

            <div className="ml-auto">
              <button onClick={handleCloseFilters} className="px-3 py-1 text-xs bg-white  rounded">Close</button>
            </div>
          </div>
        )}

      <div className="bg-white rounded-2xl shadow p-4 md:p-6 overflow-hidden ">
        {/* Desktop table */}
        <div className="hidden md:block ">
          <table className="w-full table-auto border-collapse ">
            <thead>
              <tr className="bg-gray-100 text-left ">
                <th className="py-3 px-3 text-sm font-semibold text-gray-600 rounded-tl-lg">S NO</th>
                <th className="py-3 px-3 text-sm font-semibold text-gray-600">SELLER NAME</th>
                <th className="py-3 px-3 text-sm font-semibold text-gray-600">BUYER NAME</th>
                <th className="py-3 px-3 text-sm font-semibold text-gray-600">VEHICLE NO</th>
                <th className="py-3 px-3 text-sm font-semibold text-gray-600">SOLD AMOUNT</th>
                <th className="py-3 px-3 text-sm font-semibold text-gray-600">BUY AMOUNT</th>
                <th className="py-3 px-3 text-sm font-semibold text-gray-600">DATE</th>
                <th className="py-3 px-3 text-sm font-semibold text-gray-600">STATUS</th>
                <th className="py-3 px-3 text-sm font-semibold text-gray-600 rounded-tr-lg">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-b-0">
                  <td className="py-3 px-3 text-xs">{u.id}</td>
                  <td className="py-3 px-3 text-xs">{u.seller}</td>
                  <td className="py-3 px-3 text-xs">{u.buyerName || '-'}</td>
                  <td className="py-3 px-3 text-xs">{u.vehicle}</td>
                  <td className="py-3 px-3 text-xs">{u.soldAmount}</td>
                  <td className="py-3 px-3 text-xs">{u.buyAmount || '-'}</td>
                  <td className="py-3 px-3 text-xs">{u.date}</td>
                  <td className="py-3 px-3">
                    {u.status === 'completed' ? (
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span className="capitalize text-xs">completed</span>
                      </span>
                    ) : u.status === 'seller pending' ? (
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#90b5e2" d="m21.41 11.41l-8.83-8.83c-.37-.37-.88-.58-1.41-.58H4c-1.1 0-2 .9-2 2v7.17c0 .53.21 1.04.59 1.41l8.83 8.83c.78.78 2.05.78 2.83 0l7.17-7.17c.78-.78.78-2.04-.01-2.83M6.5 8C5.67 8 5 7.33 5 6.5S5.67 5 6.5 5S8 5.67 8 6.5S7.33 8 6.5 8"/></svg>
                        <span className="capitalize text-xs">seller pending</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="#92400e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></g></svg>
                        <span className="capitalize text-xs">buyer pending</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModalUser(u)} className="p-2 text-gray-700" title="view">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#a6a6a6"/><path fill="#a6a6a6" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg>
                      </button>
                      <button onClick={() => setDeleteUserId(u.id)} className="p-2 text-red-600 hover:text-red-800" title="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="block md:hidden space-y-3">
          {users.map(u => (
            <div key={u.id} className="bg-white rounded-lg shadow p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold">{u.id}. {u.seller}</div>
                </div>
                <div className="flex items-center gap-2">
                  {u.status === 'completed' ? (
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="capitalize text-xs">completed</span>
                    </span>
                  ) : u.status === 'seller pending' ? (
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#90b5e2" d="m21.41 11.41l-8.83-8.83c-.37-.37-.88-.58-1.41-.58H4c-1.1 0-2 .9-2 2v7.17c0 .53.21 1.04.59 1.41l8.83 8.83c.78.78 2.05.78 2.83 0l7.17-7.17c.78-.78.78-2.04-.01-2.83M6.5 8C5.67 8 5 7.33 5 6.5S5.67 5 6.5 5S8 5.67 8 6.5S7.33 8 6.5 8"/></svg>
                      <span className="capitalize text-xs">seller pending</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20"height="20" viewBox="0 0 24 24"><g fill="none" stroke="#92400e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></g></svg>
                      <span className="capitalize text-xs">buyer pending</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div><span className="text-[10px] text-gray-400">Buyer</span><div className="font-medium">{u.buyerName || '-'}</div></div>
                <div><span className="text-[10px] text-gray-400">Vehicle</span><div className="font-medium">{u.vehicle}</div></div>
                <div><span className="text-[10px] text-gray-400">Sold Amount</span><div className="font-medium">{u.soldAmount}</div></div>
                <div><span className="text-[10px] text-gray-400">Buy Amount</span><div className="font-medium">{u.buyAmount || '-'}</div></div>
                <div className="col-span-2"><span className="text-[10px] text-gray-400">Date</span><div className="font-medium">{u.date}</div></div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button onClick={() => setModalUser(u)} className="p-2 text-gray-700" title="view"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#a6a6a6"/><path fill="#a6a6a6" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg></button>
                <button onClick={() => setDeleteUserId(u.id)} className="p-2 text-red-600 hover:text-red-800" title="delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* Pagination / footer */}
        <div className="mt-4 flex justify-end items-center gap-3">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={!pagination.hasPrevPage || loading}
            className="px-3 py-1 rounded-full bg-gray-100 text-xs disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path fill="#a6a6a6" d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z"/>
            </svg>
            previous
          </button>
          <div className="text-xs">{pagination.page} / {pagination.totalPages}</div>
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={!pagination.hasNextPage || loading}
            className="px-3 py-1 rounded-full bg-gray-100 text-xs disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
          >
            next
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path fill="#a6a6a6" d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay: disable closing view when editOpen is true */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              if (!editOpen) setModalUser(null)
            }}
          />

          {/* main view: apply visual disabled state when editOpen */}
          <div
            className={
              "relative w-[95%] md:w-3/4 lg:w-2/3 bg-white rounded-2xl p-6 shadow-2xl no-scrollbar max-h-[90vh] overflow-auto " +
              (editOpen ? "pointer-events-none opacity-60 select-none" : "")
            }
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold mb-4">User Details</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditOpen(true)
                  }}
                  className="px-3 py-1 rounded bg-yellow-50 text-sm inline-flex items-center gap-2"
                  aria-label="Edit user"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                    <g className="edit-outline">
                      <g fill="currentColor" fillRule="evenodd" className="Vector" clipRule="evenodd">
                        <path d="M2 6.857A4.857 4.857 0 0 1 6.857 2H12a1 1 0 1 1 0 2H6.857A2.857 2.857 0 0 0 4 6.857v10.286A2.857 2.857 0 0 0 6.857 20h10.286A2.857 2.857 0 0 0 20 17.143V12a1 1 0 1 1 2 0v5.143A4.857 4.857 0 0 1 17.143 22H6.857A4.857 4.857 0 0 1 2 17.143z"/>
                        <path d="m15.137 13.219l-2.205 1.33l-1.033-1.713l2.205-1.33l.003-.002a1.2 1.2 0 0 0 .232-.182l5.01-5.036a3 3 0 0 0 .145-.157c.331-.386.821-1.15.228-1.746c-.501-.504-1.219-.028-1.684.381a6 6 0 0 0-.36.345l-.034.034l-4.94 4.965a1.2 1.2 0 0 0-.27.41l-.824 2.073a.2.2 0 0 0 .29.245l1.032 1.713c-1.805 1.088-3.96-.74-3.18-2.698l.825-2.072a3.2 3.2 0 0 1 .71-1.081l4.939-4.966l.029-.029c.147-.15.641-.656 1.24-1.02c.327-.197.849-.458 1.494-.508c.74-.059 1.53.174 2.15.797a2.9 2.9 0 0 1 .845 1.75a3.15 3.15 0 0 1-.23 1.517c-.29.717-.774 1.244-.987 1.457l-5.01 5.036q-.28.281-.62.487m4.453-7.126s-.004.003-.013.006z"/>
                      </g>
                    </g>
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (!editOpen) setModalUser(null)
                  }}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Small CSS to hide scrollbars but keep touch scrolling */}
            <style>{`.no-scrollbar::-webkit-scrollbar{display:none;} .no-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}`}</style>

            {/* Vehicle details at top */}
            <div className="mb-4">
              <div className="w-full bg-[#edeefe] rounded-xl p-4 shadow">
                <h5 className="text-sm font-semibold mb-2">Vehicle Details</h5>
                <div className="text-sm text-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div><span className="text-[12px] text-gray-400">Vehicle Name</span><div className="font-medium">{modalUser.vehicleName || '-'}</div></div>
                  <div><span className="text-[12px] text-gray-400">Vehicle No</span><div className="font-medium">{modalUser.vehicle || '-'}</div></div>
                  <div><span className="text-[12px] text-gray-400">Chassis No</span><div className="font-medium">{modalUser.chassis || '-'}</div></div>
                  <div><span className="text-[12px] text-gray-400">Model</span><div className="font-medium">{modalUser.model || '-'}</div></div>
                </div>
              </div>
            </div>

            <div className="bg-[#E8FCF0] rounded-xl p-6 relative">
              {/* vertical divider between seller and buyer on md+ */}
              <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-300" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-center font-semibold mb-4">Seller</h4>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 bg-gray-200 rounded-lg flex items-center justify-center">IMG</div>
                    <button
                      onClick={buildSellerInvoice}
                      className="w-full px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="12" y1="19" x2="12" y2="12"/>
                        <line x1="9" y1="16" x2="15" y2="16"/>
                      </svg>
                      View Invoice
                    </button>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Customer Details</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div><strong>Name:</strong> {modalUser.seller || '-'}</div>
                        <div><strong>S/O C/O W/O:</strong> {modalUser.sowoco || modalUser.sellerSoWoCo || modalUser.soWoCo || '-'}</div>
                        <div><strong>Occupation:</strong> {modalUser.sellerOccupation || '-'}</div>
                        <div><strong>DOB:</strong> {formatDisplayDate(modalUser.sellerDob)}</div>
                        <div><strong>Phone:</strong> {modalUser.sellerPhone || '-'}</div>
                        <div className="flex items-center gap-2"><strong>Aadhar No:</strong> <span>{modalUser.sellerAadhaar || '-'}</span> <span className="ml-2 text-xs bg-yellow-100 px-2 py-0.5 rounded">view</span></div>
                        <div><strong>Address:</strong> <div className="text-xs text-gray-600">{modalUser.sellerAddress || '-'}</div></div>
                        <div><strong>Buy Amount:</strong> {modalUser.soldAmount}</div>
                      </div>
                    </div>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Reference</h5>
                      <div className="text-sm text-gray-700">Name: {modalUser.sellerReferenceName || '—'}<br/>Phone: {modalUser.sellerReferencePhone || '—'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-center font-semibold mb-4">Buyer</h4>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 bg-gray-200 rounded-lg flex items-center justify-center">IMG</div>
                    <button
                      onClick={buildBuyerInvoice}
                      className="w-full px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="12" y1="19" x2="12" y2="12"/>
                        <line x1="9" y1="16" x2="15" y2="16"/>
                      </svg>
                      View Invoice
                    </button>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Customer Details</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div><strong>Name:</strong> {modalUser.buyerName || '-'}</div>
                        <div><strong>S/O C/O W/O:</strong> {modalUser.buyerSoWoCo || modalUser.sowoco || modalUser.soWoCo || '-'}</div>
                        <div><strong>Occupation:</strong> {modalUser.buyerOccupation || '-'}</div>
                        <div><strong>DOB:</strong> {formatDisplayDate(modalUser.buyerDob)}</div>
                        <div><strong>Phone:</strong> {modalUser.buyerPhone || '-'}</div>
                        <div className="flex items-center gap-2"><strong>Aadhar No:</strong> <span>{modalUser.buyerAadhaar || '-'}</span> <span className="ml-2 text-xs bg-yellow-100 px-2 py-0.5 rounded">view</span></div>
                        <div><strong>Address:</strong> <div className="text-xs text-gray-600">{modalUser.buyerAddress || '-'}</div></div>
                        <div><strong>Sold Amount:</strong> {modalUser.buyAmount || '-'}</div>
                        {/* vehicle details shown above in Vehicle Details */}
                      </div>
                    </div>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Finance Details</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div><strong>Finance Amount:</strong> {modalUser.financeAmount || '-'}</div>
                        <div><strong>EMI Amount:</strong> {modalUser.emiAmount || '-'}</div>
                        <div><strong>EMI Months:</strong> {modalUser.emiMonths ?? '-'}</div>
                        <div><strong>EMI Date:</strong> {formatDisplayDate(modalUser.emiDate)}</div>
                      </div>
                    </div>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Reference</h5>
                      <div className="text-sm text-gray-700">Name: {modalUser.buyerReferenceName || '—'}<br/>Phone: {modalUser.buyerReferencePhone || '—'}</div>
                    </div>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Guarantor Details</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div><strong>Name:</strong> {modalUser.guarantorName || '-'}</div>
                        <div><strong>Phone:</strong> {modalUser.guarantorPhone || '-'}</div>
                        <div className="flex items-center gap-2"><strong>Aadhar No:</strong> <span>{modalUser.guarantorAadhaar || '-'}</span> <span className="ml-2 text-xs bg-yellow-100 px-2 py-0.5 rounded">view</span></div>
                        <div><strong>Address:</strong> <div className="text-xs text-gray-600">{modalUser.guarantorAddress || '-'}</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal (separate component) */}
      {editOpen && modalUser && (
        <div className="fixed inset-0 z-[9999] pointer-events-auto">
          {/* overlay (dim) */}
          <div className="absolute inset-0 bg-black/40" />

          {/* scroll wrapper: top-aligned, no visible scrollbar, allows natural scrolling */}
          <div className="absolute inset-0 flex items-start justify-center overflow-auto no-scrollbar py-8">
            <EditUserModal
              user={modalUser}
              onSave={handleSave}
              onClose={() => setEditOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteUserId(null)} />
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl w-[90%] max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-red-600">
                  <path fill="currentColor" d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m0 2c-4.4 0-8 3.6-8 8s3.6 8 8 8s8-3.6 8-8s-3.6-8-8-8m3.5 4L12 11.5L8.5 8L7 9.5L10.5 13L7 16.5L8.5 18l3.5-3.5l3.5 3.5l1.5-1.5l-3.5-3.5l3.5-3.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Deleting this user will permanently remove both <strong>seller and buyer</strong> records associated with this transaction.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {showInvoicePreview && invoice && (
        <InvoicePreviewModal
          invoice={invoice}
          invoiceRef={printInvoiceRef}
          onClose={handleInvoicePreviewClose}
          onPrint={printInvoice}
        />
      )}
        </>
      )}

    </div>
  )
}

export default Users