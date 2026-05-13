import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import UserNavbar from './components/UserNavbar'
import axiosInstance from '../api/axios'

function UserDashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [financeData, setFinanceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [otpInput, setOtpInput] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpMessage, setOtpMessage] = useState('')
  const [otpError, setOtpError] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const autoOtpSentRef = useRef({})

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/user/me')
        const profile = response?.data?.data || response?.data || null
        if (!profile) {
          setUserData(null)
          setLoading(false)
          return
        }

        setUserData(profile)
        setShowEmailVerification(!profile.isEmailVerified)
        fetchFinanceData(profile)
      } catch (error) {
        console.error('Failed to load user profile:', error)
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // Auto send OTP when email verification modal is shown
  useEffect(() => {
    const email = userData?.email?.toLowerCase()
    if (!showEmailVerification || !email || sendingOtp) return

    if (autoOtpSentRef.current[email]) return
    autoOtpSentRef.current[email] = true

    // Privacy: no OTP metadata stored in web storage.
    setOtpError('')

    console.log('Auto-sending OTP to:', email)
    sendOtp(true)
  }, [showEmailVerification, userData?.email, sendingOtp])

  useEffect(() => {
    if (!showEmailVerification) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showEmailVerification])

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

  const sendOtp = async (isAuto = false) => {
    try {
      setSendingOtp(true)
      setOtpError('')
      if (!isAuto) {
        setOtpMessage('')
      }

      console.log('📧 Sending OTP to:', userData?.email)

      const response = await axiosInstance.post('/api/user/send-otp', {
        email: userData?.email
      })

      console.log('✅ OTP Response:', response.data)

      if (response.data.success) {
        setOtpMessage('✅ OTP sent successfully to your email. Please check your inbox.')
        setOtpInput('')
        console.log('✅ OTP sent to:', userData?.email)
      } else {
        setOtpError(response.data.message || 'Failed to send OTP')
        console.error('❌ OTP Error:', response.data.message)
      }
    } catch (error) {
      console.error('❌ Error sending OTP:', error)
      console.error('❌ Error details:', error.response?.data)
      
      const errorMsg = error.response?.data?.message || error.message || 'Error sending OTP'

      if (error.response?.status === 429 && /wait before requesting a new OTP/i.test(errorMsg)) {
        setOtpError('')
        setOtpMessage('✅ OTP already sent recently. Please check your inbox and spam folder.')
        return
      }

      setOtpError(errorMsg)
    } finally {
      setSendingOtp(false)
    }
  }

  const verifyOtp = async () => {
    try {
      if (!otpInput.trim()) {
        setOtpError('Please enter the OTP')
        return
      }

      setOtpLoading(true)
      setOtpError('')
      setOtpMessage('')

      console.log('🔐 [Verify OTP] Attempting to verify OTP:', otpInput)

      const response = await axiosInstance.post('/api/user/verify-otp', {
        email: userData?.email,
        otp: otpInput
      })

      console.log('✅ [Verify OTP] Response:', response.data)

      if (response.data.success) {
        // Update user data with email verification status
        const updatedUserData = {
          ...userData,
          ...response.data.data, // Include all updated user data from backend
          isEmailVerified: true
        }
        
        console.log('📋 [Verify OTP] Updated userData:', updatedUserData)
        
        setUserData(updatedUserData)
        console.log('✅ [Verify OTP] Updated in memory:', updatedUserData)

        setOtpMessage('Email verified successfully!')
        console.log('✅ [Verify OTP] Email verification successful')
        
        setTimeout(() => {
          console.log('🔄 [Verify OTP] Hiding modal and updating state')
          setShowEmailVerification(false)
          setOtpInput('')
          setOtpMessage('')
        }, 1500)
      } else {
        const errorMsg = response.data.message || 'Failed to verify OTP'
        setOtpError(errorMsg)
        console.error('❌ [Verify OTP] Verification failed:', errorMsg)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error verifying OTP'
      setOtpError(errorMsg)
      console.error('❌ [Verify OTP] Error:', error)
      console.error('❌ [Verify OTP] Error details:', error.response?.data)
    } finally {
      setOtpLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {userData && <UserNavbar userData={userData} />}
      
      {/* Email Verification Modal */}
      {showEmailVerification && !userData?.isEmailVerified && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
              <p className="text-gray-600 text-sm">{userData?.email}</p>
            </div>

            {/* Sending Status */}
            {sendingOtp && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-sm flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending OTP...
              </div>
            )}

            {otpMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                {otpMessage}
              </div>
            )}

            {otpError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                ❌ {otpError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest font-mono border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:bg-gray-100"
                  disabled={otpLoading || sendingOtp}
                />
                <p className="text-xs text-gray-500 mt-1">6-digit code sent to your email</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={verifyOtp}
                  disabled={otpLoading || otpInput.length !== 6 || sendingOtp}
                  className="flex-1 bg-gradient-to-r from-[#65B741] to-[#40FF00] hover:from-[#5aa330] hover:to-[#36d900] disabled:from-gray-400 disabled:to-gray-300 text-black font-bold py-3 px-4 rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  {otpLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : 'Verify OTP'}
                </button>
                <button
                  onClick={sendOtp}
                  disabled={sendingOtp}
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingOtp ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : 'Resend OTP'}
                </button>
              </div>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              ⏱️ OTP is valid for 10 minutes
            </p>
          </div>
        </div>
      )}
      
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