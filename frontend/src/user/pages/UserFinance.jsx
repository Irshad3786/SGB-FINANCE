import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axios'
import UserNavbar from '../components/UserNavbar'
import FinanceRequestForm from '../components/FinanceRequestForm'

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

function UserFinance() {
  const navigate = useNavigate()
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')

  const [financeData, setFinanceData] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const getStatementRows = (emiSchedule = []) => {
    if (!Array.isArray(emiSchedule) || emiSchedule.length === 0) return []
    let runningBalance = 0

    return emiSchedule.map((schedule, idx) => {
      const emiAmt = Number(schedule?.emi || 0)
      const paidAmt = Number(schedule?.paidAmount || 0)
      runningBalance += emiAmt - paidAmt

      return {
        sno: Number(schedule?.sno || idx + 1),
        emiDate: schedule?.emiDate || '-',
        emiAmt,
        paidAmt,
        balance: runningBalance,
        paidDate: schedule?.paidDate || '-',
        bookNo: schedule?.bookNo || '-',
        pageNo: schedule?.pageNo || '-',
      }
    })
  }

  const statementRows = financeData ? getStatementRows(financeData.emiSchedule) : []
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
            <button
              onClick={() => navigate('/user')}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {financeData ? 'Finance Statement' : 'Request Finance'}
            </h1>
            <p className="text-gray-600">
              {financeData
                ? 'View your vehicle finance details and EMI schedule'
                : 'Submit your vehicle details to request finance'}
            </p>
          </div>

          {/* Finance Data Display or Request Form */}
          {financeData ? (
            // Direct EMI Statement
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">AGREEMENT NO.</p>
                    <p className="text-lg font-bold text-gray-900">{financeData.agreementNo || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">VEHICLE NO.</p>
                    <p className="text-lg font-bold text-gray-900">{financeData.vehicle || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">TOTAL PENDING</p>
                    <p className={`text-lg font-bold ${getBalanceClass(statementPending)}`}>
                      ₹ {toInr(statementPending)}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left font-semibold">INST.NO</th>
                        <th className="px-4 py-3 text-left font-semibold">INST.DATE</th>
                        <th className="px-4 py-3 text-right font-semibold">INST.AMOUNT</th>
                        <th className="px-4 py-3 text-left font-semibold">PAID DATE</th>
                        <th className="px-4 py-3 text-right font-semibold">PAID AMT.</th>
                        <th className="px-4 py-3 text-right font-semibold">BALANCE</th>
                        <th className="px-4 py-3 text-left font-semibold">RECEIPT NO.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statementRows.map((row, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{row.sno}</td>
                          <td className="px-4 py-3">{row.emiDate}</td>
                          <td className="px-4 py-3 text-right font-semibold">₹ {toInr(row.emiAmt)}</td>
                          <td className="px-4 py-3">{row.paidDate}</td>
                          <td className="px-4 py-3 text-right text-green-600 font-semibold">₹ {toInr(row.paidAmt)}</td>
                          <td className={`px-4 py-3 text-right font-semibold ${getBalanceClass(row.balance)}`}>
                            {formatBalance(row.balance)}
                          </td>
                          <td className="px-4 py-3">{row.bookNo}/{row.pageNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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
              </div>
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

    </div>
  )
}

export default UserFinance
