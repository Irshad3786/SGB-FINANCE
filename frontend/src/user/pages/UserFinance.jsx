import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/ToastProvider'
import axiosInstance from '../../api/axios'
import UserNavbar from '../components/UserNavbar'
import FinanceRequestForm from '../components/FinanceRequestForm'

const toInr = (value) => Number(value || 0).toLocaleString('en-IN')

const getBalanceClass = (balance) => {
  const amount = Number(balance || 0)
  if (amount < 0) return 'text-red-600'
  if (amount > 0) return 'text-orange-600'
  return 'text-green-600'
}

function UserFinance() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')

  const [financeData, setFinanceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalData, setModalData] = useState(null)
  const [showStatement, setShowStatement] = useState(false)

  // Auto-fetch finance data on page load
  useEffect(() => {
    fetchFinanceData()
  }, [])

  const fetchFinanceData = async () => {
    if (!userData?.vehicleNumber || !userData?.chassisNumber) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      console.log('Auto-fetching finance for:', { vehicleNumber: userData.vehicleNumber, chassisNumber: userData.chassisNumber })
      
      const response = await axiosInstance.post('/api/user/finance-by-vehicle', {
        vehicleNumber: userData.vehicleNumber,
        chassisNumber: userData.chassisNumber,
      })

      if (response.data.success) {
        setFinanceData(response.data.data)
        console.log('Finance data found:', response.data.data)
      } else {
        setFinanceData(null)
        console.log('No finance record found')
      }
    } catch (error) {
      console.error('Error fetching finance:', error)
      setFinanceData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleViewStatement = () => {
    if (financeData) {
      setModalData(financeData)
      setShowStatement(true)
    }
  }

  const getStatementRows = (emiSchedule = []) => {
    if (!Array.isArray(emiSchedule) || emiSchedule.length === 0) return []
    return emiSchedule.map((schedule) => ({
      sno: Number(schedule?.sno || 0),
      emiDate: schedule?.emiDate || '-',
      emiAmt: Number(schedule?.emi || 0),
      paidAmt: Number(schedule?.paidAmount || 0),
      pendingAmt: Number(schedule?.pendingAmount || 0),
      balance: Number(schedule?.pendingAmount || 0),
      paidDate: schedule?.paidDate || '-',
      bookNo: schedule?.bookNo || '-',
      pageNo: schedule?.pageNo || '-',
    }))
  }

  const statementRows = modalData ? getStatementRows(modalData.emiSchedule) : []
  const statementTotalPaid = statementRows.reduce((sum, row) => sum + Number(row?.paidAmt || 0), 0)
  const statementPending = statementRows.length > 0 ? Math.max(0, Number(statementRows[statementRows.length - 1]?.balance || 0)) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar userData={userData} />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40FF00] mx-auto mb-4"></div>
            <p>Loading your finance details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserNavbar userData={userData} />
      <div className="p-4 md:p-8">
        <style>{`
          .no-scrollbar::-webkit-scrollbar{display:none;}
          .no-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}
        `}</style>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Finance Statement</h1>
            <p className="text-gray-600">View your vehicle finance details and EMI schedule</p>
          </div>

          {/* Finance Data Display or Request Form */}
          {financeData ? (
            // Finance Statement Found
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Finance Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹ {toInr(financeData.financeAmount)}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Monthly EMI</p>
                  <p className="text-2xl font-bold text-gray-900">₹ {toInr(financeData.emi)}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">₹ {toInr(financeData.totalPaid)}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Pending Amount</p>
                  <p className={`text-2xl font-bold ${getBalanceClass(financeData.totalPending)}`}>
                    ₹ {toInr(financeData.totalPending)}
                  </p>
                </div>
              </div>

              {/* Finance Details Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Finance Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">Agreement Number</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{financeData.agreementNo || 'N/A'}</p>
                    </div>

                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">Vehicle Number</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1 font-mono">{financeData.vehicle || 'N/A'}</p>
                    </div>

                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">Vehicle Name</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{financeData.vehicleName || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">Chassis Number</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1 font-mono">{financeData.chassisNo || 'N/A'}</p>
                    </div>

                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">EMI Start Date</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{financeData.emiDate || 'N/A'}</p>
                    </div>

                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">Finance Status</p>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-1 ${
                        financeData.status === 'paid' ? 'bg-green-100 text-green-800' :
                        financeData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {financeData.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Statement Button */}
              <button
                onClick={handleViewStatement}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                View Detailed EMI Schedule
              </button>
            </div>
          ) : (
            // No Finance Found - Show Request Form
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-red-900 mb-2">❌ No Finance Record Found</h2>
                <p className="text-red-800">
                  We couldn't find any finance record matching your vehicle details.
                </p>
              </div>

              {/* Finance Request Form */}
              <FinanceRequestForm 
                vehicleNumber={userData?.vehicleNumber}
                chassisNumber={userData?.chassisNumber}
              />
            </div>
          )}
        </div>
      </div>

      {/* Finance Statement Modal */}
      {showStatement && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#B0FF1C] to-[#40FF00] p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">EMI Schedule</h2>
              <button
                onClick={() => setShowStatement(false)}
                className="text-gray-900 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">AGREEMENT NO.</p>
                  <p className="text-lg font-bold text-gray-900">{modalData.agreementNo || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">VEHICLE NO.</p>
                  <p className="text-lg font-bold text-gray-900">{modalData.vehicle || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">FINANCE AMOUNT</p>
                  <p className="text-lg font-bold text-gray-900">₹ {toInr(modalData.financeAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">TOTAL PENDING</p>
                  <p className={`text-lg font-bold ${getBalanceClass(statementPending)}`}>
                    ₹ {toInr(statementPending)}
                  </p>
                </div>
              </div>

              {/* EMI Schedule Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left font-semibold">S.No</th>
                      <th className="px-4 py-3 text-left font-semibold">EMI Date</th>
                      <th className="px-4 py-3 text-right font-semibold">EMI Amount</th>
                      <th className="px-4 py-3 text-right font-semibold">Paid</th>
                      <th className="px-4 py-3 text-right font-semibold">Pending</th>
                      <th className="px-4 py-3 text-right font-semibold">Balance</th>
                      <th className="px-4 py-3 text-left font-semibold">Paid Date</th>
                      <th className="px-4 py-3 text-left font-semibold">Book/Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statementRows.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{row.sno}</td>
                        <td className="px-4 py-3">{row.emiDate}</td>
                        <td className="px-4 py-3 text-right font-semibold">₹ {toInr(row.emiAmt)}</td>
                        <td className="px-4 py-3 text-right text-green-600 font-semibold">₹ {toInr(row.paidAmt)}</td>
                        <td className="px-4 py-3 text-right text-orange-600 font-semibold">₹ {toInr(row.pendingAmt)}</td>
                        <td className={`px-4 py-3 text-right font-semibold ${getBalanceClass(row.balance)}`}>
                          ₹ {toInr(row.balance)}
                        </td>
                        <td className="px-4 py-3">{row.paidDate}</td>
                        <td className="px-4 py-3">{row.bookNo}/{row.pageNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">₹ {toInr(statementTotalPaid)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Total Pending</p>
                  <p className={`text-2xl font-bold ${getBalanceClass(statementPending)}`}>
                    ₹ {toInr(statementPending)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Total EMIs</p>
                  <p className="text-2xl font-bold text-gray-900">{statementRows.length}</p>
                </div>
              </div>

              <button
                onClick={() => setShowStatement(false)}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserFinance
