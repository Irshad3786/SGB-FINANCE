import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserNavbar from './components/UserNavbar'
import axiosInstance from '../api/axios'

function UserDashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [financeData, setFinanceData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData')
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData)
        setUserData({
          ...parsedData,
          isEmailVerified: false,
          vehicleModel: 'Hero Splendor Plus 2020'
        })
        // Auto-fetch finance data
        fetchFinanceData(parsedData)
      } catch (err) {
        console.error('Failed to parse user data:', err)
        const mockData = {
          username: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '9876543210',
          vehicleNumber: 'KA-01-AB-1234',
          chassisNumber: 'ABC123XYZ456',
          vehicleModel: 'Hero Splendor Plus 2020',
          isEmailVerified: false
        }
        setUserData(mockData)
        fetchFinanceData(mockData)
      }
    } else {
      const mockData = {
        username: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '9876543210',
        vehicleNumber: 'KA-01-AB-1234',
        chassisNumber: 'ABC123XYZ456',
        vehicleModel: 'Hero Splendor Plus 2020',
        isEmailVerified: false
      }
      setUserData(mockData)
      fetchFinanceData(mockData)
    }
  }, [])

  const fetchFinanceData = async (user) => {
    try {
      const response = await axiosInstance.post('/api/user/finance-by-vehicle', {
        vehicleNumber: user?.vehicleNumber,
        chassisNumber: user?.chassisNumber,
      })
      if (response.data.success) {
        setFinanceData(response.data.data)
      }
    } catch {
      console.log('No finance record found')
    } finally {
      setLoading(false)
    }
  }

  const toInr = (value) => Number(value || 0).toLocaleString('en-IN')

  const getStatusColor = (status) => {
    if (status === 'paid') return 'bg-green-100 text-green-800'
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getPendingColor = (amount) => {
    const val = Number(amount || 0)
    if (val === 0) return 'text-green-600'
    if (val < 50000) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {userData && <UserNavbar userData={userData} />}
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-[#B0FF1C] to-[#40FF00] rounded-2xl p-8 shadow-lg">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome, {userData?.username || 'User'}!
              </h1>
              <p className="text-gray-800 text-lg">
                Manage your vehicle finance and view EMI statements
              </p>
            </div>

            {/* Finance Status Section */}
            {financeData ? (
              <div className="space-y-6">
                {/* Finance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Finance Amount Card */}
                  <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm font-medium mb-2">Finance Amount</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">
                      ₹ {toInr(financeData.financeAmount)}
                    </p>
                    <p className="text-xs text-gray-500 mt-3">Approved loan amount</p>
                  </div>

                  {/* Monthly EMI Card */}
                  <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
                    <p className="text-gray-600 text-sm font-medium mb-2">Monthly EMI</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">
                      ₹ {toInr(financeData.emi)}
                    </p>
                    <p className="text-xs text-gray-500 mt-3">EMI amount per month</p>
                  </div>

                  {/* Total Paid Card */}
                  <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm font-medium mb-2">Total Paid</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600">
                      ₹ {toInr(financeData.totalPaid)}
                    </p>
                    <p className="text-xs text-gray-500 mt-3">Amount paid so far</p>
                  </div>

                  {/* Pending Card */}
                  <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500">
                    <p className="text-gray-600 text-sm font-medium mb-2">Pending Amount</p>
                    <p className={`text-2xl md:text-3xl font-bold ${getPendingColor(financeData.totalPending)}`}>
                      ₹ {toInr(financeData.totalPending)}
                    </p>
                    <p className="text-xs text-gray-500 mt-3">Amount remaining</p>
                  </div>
                </div>

                {/* Finance Details Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="#B0FF1C" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                    Finance Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">Agreement Number</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {financeData.agreementNo || 'N/A'}
                        </p>
                      </div>

                      <div className="pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">Vehicle Number</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1 font-mono">
                          {financeData.vehicle || 'N/A'}
                        </p>
                      </div>

                      <div className="pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">Vehicle Name</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {financeData.vehicleName || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">Chassis Number</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1 font-mono">
                          {financeData.chassisNo || 'N/A'}
                        </p>
                      </div>

                      <div className="pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">EMI Start Date</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {financeData.emiDate || 'N/A'}
                        </p>
                      </div>

                      <div className="pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">Finance Status</p>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-1 ${getStatusColor(financeData.status)}`}>
                          {financeData.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Full Statement Button */}
                <button
                  onClick={() => navigate('/user/finance')}
                  className="w-full bg-gradient-to-r from-[#B0FF1C] to-[#40FF00] hover:from-[#a8ff00] hover:to-[#38e600] text-black font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg"
                >
                  View Detailed Finance Statement
                </button>
              </div>
            ) : (
              /* No Finance Record Section */
              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">No Finance Record Found</h2>
                  <p className="text-blue-800 mb-6">
                    We couldn't find any existing finance record for your vehicle.
                    You can request finance using your vehicle details.
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => navigate('/user/finance')}
                      className="bg-white border-2 border-[#40FF00] text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Request Finance
                    </button>
                  </div>
                </div>

                {/* Vehicle Details Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Vehicle Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Vehicle Number</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1 font-mono">
                        {userData?.vehicleNumber || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Chassis Number</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1 font-mono">
                        {userData?.chassisNumber || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Vehicle Name</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {userData?.vehicleName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Manufacturing Year</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {userData?.vehicleManufactureYear || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default UserDashboard