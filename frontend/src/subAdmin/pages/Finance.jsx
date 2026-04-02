import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/axios'
import { useToast } from '../../components/ToastProvider'

const defaultPagination = {
  page: 1,
  limit: 9,
  totalRecords: 0,
  totalPages: 1,
  hasPrev: false,
  hasNext: false,
}

const toInr = (value) => Number(value || 0).toLocaleString('en-IN')

const formatBalance = (value) => {
  const amount = Number(value || 0)
  if (amount < 0) {
    return `(${toInr(Math.abs(amount))})`
  }
  return toInr(amount)
}

const getBalanceClass = (balance) => {
  const amount = Number(balance || 0)
  if (amount < 0) return 'text-green-600'
  if (amount > 0) return 'text-red-600'
  return 'text-black'
}

function Finance() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [financeData, setFinanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(defaultPagination)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ from: '', to: '', status: 'all' })
  const [modalData, setModalData] = useState(null)
  const [openingStatementId, setOpeningStatementId] = useState('')

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 400)

    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    const fetchFinanceList = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/api/subadmin/management/finance', {
          params: {
            search: debouncedSearch,
            page,
            limit: 9,
            status: filters.status,
            from: filters.from,
            to: filters.to,
          },
        })

        setFinanceData(response?.data?.data || [])
        setPagination(response?.data?.pagination || defaultPagination)
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Error',
          message: error?.response?.data?.message || 'Failed to fetch finance data',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFinanceList()
  }, [showToast, debouncedSearch, page, filters.status, filters.from, filters.to])

  const handleViewStatement = async (buyerId) => {
    try {
      setOpeningStatementId(buyerId)
      const response = await apiClient.get(`/api/subadmin/management/finance/${buyerId}`)
      setModalData(response?.data?.data || null)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to fetch finance statement',
      })
    } finally {
      setOpeningStatementId('')
    }
  }

  const getStatementRows = (emiSchedule = [], paymentEntries = []) => {
    let runningBalance = 0
    const entries = Array.isArray(paymentEntries) ? paymentEntries : []

    const rows = emiSchedule.map((schedule, idx) => {
      const paymentEntry = entries[idx] || null
      const paidAmt = Number(paymentEntry?.amount ?? 0)
      const paidDate = paymentEntry?.paidDate || '-'
      const receiptNo = paymentEntry?.bookNo && paymentEntry?.pageNo
        ? `${paymentEntry.bookNo}/${paymentEntry.pageNo}`
        : '-'

      const instAmount = Number(schedule?.emi || 0)
      runningBalance += instAmount - paidAmt

      return {
        instNo: Number(schedule?.sno || idx + 1),
        instDate: schedule?.emiDate || '-',
        instAmount,
        paidDate,
        paidAmt,
        balance: runningBalance,
        receiptNo,
      }
    })

    const extraEntries = entries.slice(emiSchedule.length)
    extraEntries.forEach((entry, index) => {
      const paidAmt = Number(entry?.amount || 0)
      const receiptNo = entry?.bookNo && entry?.pageNo
        ? `${entry.bookNo}/${entry.pageNo}`
        : '-'
      runningBalance -= paidAmt

      rows.push({
        instNo: emiSchedule.length + index + 1,
        instDate: '',
        instAmount: '',
        paidDate: entry?.paidDate || '-',
        paidAmt,
        balance: runningBalance,
        receiptNo,
      })
    })

    return rows
  }

  const statementRows = modalData
    ? getStatementRows(modalData.emiSchedule, modalData.paymentEntries)
    : []
  const statementTotalPaid = statementRows.reduce((sum, row) => sum + Number(row?.paidAmt || 0), 0)
  const statementBalance = statementRows.length > 0
    ? Number(statementRows[statementRows.length - 1]?.balance || 0)
    : 0
  const statementPending = Math.max(statementBalance, 0)

  return (
    <div className="p-6">
      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none;}
        .no-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}
      `}</style>

      {/* Top Buttons */}
      <div className="flex items-center gap-4 mb-8">
        {/* All Users Button (active on Finance) */}
        <button onClick={() => navigate('/subadmin/finance')} disabled className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-semibold text-gray-900 shadow-lg cursor-default opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#000" d="M21.987 18.73a2 2 0 0 1-.34.85a1.9 1.9 0 0 1-1.56.8h-1.651a.74.74 0 0 1-.6-.31a.76.76 0 0 1-.11-.67c.37-1.18.29-2.51-3.061-4.64a.77.77 0 0 1-.32-.85a.76.76 0 0 1 .72-.54a7.61 7.61 0 0 1 6.792 4.39a2 2 0 0 1 .13.97M19.486 7.7a4.43 4.43 0 0 1-4.421 4.42a.76.76 0 0 1-.65-1.13a6.16 6.16 0 0 0 0-6.53a.75.75 0 0 1 .61-1.18a4.3 4.3 0 0 1 3.13 1.34a4.46 4.46 0 0 1 1.291 3.12z"/>
            <path fill="#000" d="M16.675 18.7a2.65 2.65 0 0 1-1.26 2.48c-.418.257-.9.392-1.39.39H4.652a2.63 2.63 0 0 1-1.39-.39A2.62 2.62 0 0 1 2.01 18.7a2.6 2.6 0 0 1 .5-1.35a8.8 8.8 0 0 1 6.812-3.51a8.78 8.78 0 0 1 6.842 3.5a2.7 2.7 0 0 1 .51 1.36M14.245 7.32a4.92 4.92 0 0 1-4.902 4.91a4.903 4.903 0 0 1-4.797-5.858a4.9 4.9 0 0 1 6.678-3.57a4.9 4.9 0 0 1 3.03 4.518z"/>
          </svg>
          <span>Users</span>
        </button>

        {/* Collection Button (inactive on Finance) */}
        <button onClick={() => navigate('/subadmin/collection')} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white border-2 border-gray-300 font-semibold text-gray-800 shadow hover:shadow-md transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="w-5 h-5">
            <path fill="#000" d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1"/>
          </svg>
          <span>Collection</span>
        </button>
      </div>

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
          <label htmlFor="finance-search" className="sr-only">Search finance</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#a6a6a6" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"/>
               </svg>
            </div>
            <input
              id="finance-search"
              type="search"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search finance..."
              className="w-full pl-10 pr-3 py-3 rounded-3xl border border-transparent bg-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a] shadow-[1px_2px_9px_-4px_rgba(0,_0,_0,_0.7)]"
            />
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-2 mb-4 md:mt-0 w-full md:w-fit bg-[#f0f0fa] rounded-lg p-3 shadow flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16"><path fill="#a6a6a6" d="M5.75 7.5a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m1.5.75A.75.75 0 0 1 8 7.5h2.25a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75M5.75 9.5a.75.75 0 0 0 0 1.5H8a.75.75 0 0 0 0-1.5z"/><path fill="#a6a6a6" fillRule="evenodd" d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1M3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1z" clipRule="evenodd"/></svg>
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[12px] text-gray-500">Date range</label>
              <input type="date" value={filters.from} onChange={(e)=> { setFilters(f=>({...f, from: e.target.value})); setPage(1) }} className="text-xs border rounded px-2 py-1" />
              <span className="text-gray-400">—</span>
              <input type="date" value={filters.to} onChange={(e)=> { setFilters(f=>({...f, to: e.target.value})); setPage(1) }} className="text-xs border rounded px-2 py-1" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M15 16.69V13h1.5v2.82l2.44 1.41l-.75 1.3zM19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.58-1.58c.14.19.3.36.47.53A7.001 7.001 0 0 0 21 11.1V2zM11.1 11c-.6.57-1.07 1.25-1.43 2H6v-2zm-2.03 4c-.07.33-.07.66-.07 1s0 .67.07 1H6v-2zM18 9H6V7h12zm2.85 7c0 .64-.12 1.27-.35 1.86c-.26.58-.62 1.14-1.07 1.57c-.43.45-.99.81-1.57 1.07c-.59.23-1.22.35-1.86.35c-2.68 0-4.85-2.17-4.85-4.85c0-1.29.51-2.5 1.42-3.43c.93-.91 2.14-1.42 3.43-1.42c2.67 0 4.85 2.17 4.85 4.85"/></svg>
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[12px] text-gray-500">Status</label>
              <select value={filters.status} onChange={(e)=> { setFilters(f=>({...f, status: e.target.value})); setPage(1) }} className="text-xs border rounded px-2 py-1">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="ml-auto">
            <button onClick={() => setShowFilters(false)} className="px-3 py-1 text-xs bg-white rounded">Close</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-4 md:p-6 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left rounded-lg">
                <th className="py-3 px-3 text-base font-semibold rounded-tl-lg">s no</th>
                <th className="py-3 px-3 text-base font-semibold">name</th>
                <th className="py-3 px-3 text-base font-semibold">vehicle no</th>
                <th className="py-3 px-3 text-base font-semibold">phone no</th>
                <th className="py-3 px-3 text-base font-semibold">finance amount</th>
                <th className="py-3 px-3 text-base font-semibold">emi date</th>
                <th className="py-3 px-3 text-base font-semibold">emi</th>
                <th className="py-3 px-3 text-base font-semibold rounded-tr-lg">action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-6 px-3 text-center text-sm text-gray-500">Loading finance data...</td>
                </tr>
              ) : financeData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 px-3 text-center text-sm text-gray-500">No finance records found</td>
                </tr>
              ) : financeData.map((f, index) => (
                <tr key={f.id} className="border-b last:border-b-0">
                  <td className="py-3 px-3 text-xs">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td className="py-3 px-3 text-xs">{f.seller}</td>
                  <td className="py-3 px-3 text-xs">{f.vehicle}</td>
                  <td className="py-3 px-3 text-xs">{f.phoneNo}</td>
                  <td className="py-3 px-3 text-xs">{f.financeAmount ? `₹ ${toInr(f.financeAmount)}` : '-'}</td>
                  <td className="py-3 px-3 text-xs">{f.emiDate || '-'}</td>
                  <td className="py-3 px-3 text-xs">{f.emi ? `₹ ${toInr(f.emi)}` : '-'}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewStatement(f.id)} disabled={openingStatementId === f.id} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50" title="View Finance Statement">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="currentColor"/><path fill="currentColor" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg>
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
          {loading ? (
            <div className="text-sm text-gray-500 text-center py-3">Loading finance data...</div>
          ) : financeData.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-3">No finance records found</div>
          ) : financeData.map((f, index) => (
            <div key={f.id} className="bg-white rounded-lg shadow p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold">{(pagination.page - 1) * pagination.limit + index + 1}. {f.seller}</div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div><span className="text-[10px] text-gray-400">Vehicle</span><div className="font-medium">{f.vehicle}</div></div>
                <div><span className="text-[10px] text-gray-400">Phone</span><div className="font-medium">{f.phoneNo}</div></div>
                <div><span className="text-[10px] text-gray-400">Finance Amount</span><div className="font-medium">{f.financeAmount ? `₹ ${toInr(f.financeAmount)}` : '-'}</div></div>
                <div><span className="text-[10px] text-gray-400">EMI</span><div className="font-medium">{f.emi ? `₹ ${toInr(f.emi)}` : '-'}</div></div>
                <div className="col-span-2"><span className="text-[10px] text-gray-400">EMI Date</span><div className="font-medium">{f.emiDate || '-'}</div></div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button onClick={() => handleViewStatement(f.id)} disabled={openingStatementId === f.id} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50" title="View Finance Statement"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="currentColor"/><path fill="currentColor" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg></button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-end items-center gap-3">
          <button
            disabled={!pagination.hasPrev || loading}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded-full bg-gray-100 text-xs disabled:opacity-50"
          >
            previous
          </button>
          <div className="text-xs">{pagination.page} / {pagination.totalPages}</div>
          <button
            disabled={!pagination.hasNext || loading}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 rounded-full bg-gray-100 text-xs disabled:opacity-50"
          >
            next
          </button>
        </div>
      </div>

      
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative w-[95%] md:w-4/5 lg:w-3/4 bg-white rounded-3xl p-8 shadow-2xl no-scrollbar max-h-[90vh] overflow-auto">
            {/* Close button */}
            <button
              onClick={() => setModalData(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Finance Statement</h2>
            <div className="text-center text-sm text-gray-500 mb-8">Agreement No : {modalData.agreementNo}</div>

            {/* Header with Images on Right */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Left: Party Details with Image - Bordered Box */}
              <div className="border-2 border-gray-300 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">Party Details</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="font-semibold text-gray-900">{modalData.seller}</div>
                      <div className="text-gray-600">Occupation : {modalData.occupation || '-'}</div>
                      <div className="text-gray-600">Age : {modalData.age}</div>
                      <div className="text-gray-600">Phone No: {modalData.phoneNo}</div>
                      <div className="text-gray-600">Address: {modalData.address}</div>
                    </div>
                  </div>
                  {/* Party Image - Right side */}
                  <div className="shrink-0">
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-3 flex flex-col items-center">
                      {modalData.partyPhoto ? (
                        <img src={modalData.partyPhoto} alt="Party" className="w-28 h-28 rounded-lg object-cover mb-2" />
                      ) : (
                        <div className="w-28 h-28 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-xs text-gray-500 text-center">Party<br/>Img</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-600 font-semibold">Party</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Guarantor Details with Image - Bordered Box */}
              <div className="border-2 border-gray-300 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">Guarantor Details</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="font-semibold text-gray-900">{modalData.guarantorName || '-'}</div>
                      <div className="text-gray-600">Occupation : {modalData.guarantorOccupation || '-'}</div>
                      <div className="text-gray-600">Age : {modalData.guarantorAge || '-'}</div>
                      <div className="text-gray-600">Phone No: {modalData.guarantorPhoneNo || '-'}</div>
                      <div className="text-gray-600">Address: {modalData.guarantorAddress || '-'}</div>
                    </div>
                  </div>
                  {/* Guarantor Image - Right side */}
                  <div className="shrink-0">
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-3 flex flex-col items-center">
                      {modalData.guarantorPhoto ? (
                        <img src={modalData.guarantorPhoto} alt="Guarantor" className="w-28 h-28 rounded-lg object-cover mb-2" />
                      ) : (
                        <div className="w-28 h-28 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-xs text-gray-500 text-center">Guarantor<br/>Img</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-600 font-semibold">Guarantor</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-blue-300">Vehicle Details</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">VEHICLE NO</div>
                  <div className="text-lg font-bold text-gray-900">{modalData.vehicle}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">VEHICLE NAME</div>
                  <div className="text-lg font-bold text-gray-900">{modalData.vehicleName}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">CHASSIS NO</div>
                  <div className="text-sm font-bold text-gray-900">{modalData.chassisNo}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">MODEL</div>
                  <div className="text-lg font-bold text-gray-900">{modalData.vehicleModel}</div>
                </div>
              </div>
            </div>

            {/* Finance Details */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-purple-300">Finance Details</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">VEHICLE PRICE</div>
                  <div className="text-lg font-bold text-gray-900">₹ {toInr(modalData.vehiclePrice)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">FINANCE AMOUNT</div>
                  <div className="text-lg font-bold text-gray-900">₹ {toInr(modalData.financeAmount)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500 font-semibold mb-2">CHARGES & INTEREST</div>
                  <div className="text-lg font-bold text-gray-900">₹ {toInr(modalData.charges)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-purple-300">
                  <div className="text-xs text-gray-500 font-semibold mb-2">TOTAL AMOUNT</div>
                  <div className="text-lg font-bold text-purple-900">₹ {toInr(modalData.totalAmount)}</div>
                </div>
              </div>
            </div>

            {/* EMI Schedule */}
            {modalData.emiSchedule && modalData.emiSchedule.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-300">EMI Schedule : ₹ {toInr(modalData.emi)} x {modalData.months || modalData.emiSchedule.length} months</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-left font-semibold">INST.NO</th>
                        <th className="px-4 py-3 text-left font-semibold">INST.DATE</th>
                        <th className="px-4 py-3 text-left font-semibold">INST.AMOUNT</th>
                        <th className="px-4 py-3 text-left font-semibold">PAID DATE</th>
                        <th className="px-4 py-3 text-left font-semibold">PAID AMT.</th>
                        <th className="px-4 py-3 text-left font-semibold">BALANCE</th>
                        <th className="px-4 py-3 text-left font-semibold">RECEIPT NO.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statementRows.map((schedule, idx) => (
                        <tr key={`${schedule.instNo}-${idx}`} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-3 font-semibold text-gray-900">{schedule.instNo}</td>
                          <td className="px-4 py-3 text-gray-700">{schedule.instDate}</td>
                          <td className="px-4 py-3 text-gray-700">{schedule.instAmount === '' ? '' : `₹ ${toInr(schedule.instAmount)}`}</td>
                          <td className="px-4 py-3 text-gray-700">{schedule.paidDate}</td>
                          <td className="px-4 py-3 text-gray-700">₹ {toInr(schedule.paidAmt)}</td>
                          <td className={`px-4 py-3 font-semibold ${getBalanceClass(schedule.balance)}`}>
                            {formatBalance(schedule.balance)}
                          </td>
                          <td className="px-4 py-3 text-gray-700">{schedule.receiptNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gray-100 rounded-xl p-6 flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-1">TOTAL PAID</div>
                <div className="text-2xl font-bold text-green-600">₹ {toInr(statementTotalPaid)}</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-1">PENDING AMOUNT</div>
                <div className="text-2xl font-bold text-red-600">₹ {toInr(statementPending)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Finance