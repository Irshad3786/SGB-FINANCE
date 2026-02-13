import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import apiClient, { setAuthToken, setRefreshToken } from '../api/axios'
import Logo from './components/Logo'
import Footer from './components/Footer'
import OtpInput from './components/OtpInput'
import OtpTimer from './components/OtpTimer'
import ResendOtpButton from './components/ResendOtpButton'
import Loader from '../components/Loader'

function AdminOtpLogin() {
  const location = useLocation()
  const navigate = useNavigate()
  const otpToken = location.state?.otpToken

  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [timerExpired, setTimerExpired] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const handleSubmit = async (e) => {
   
    
    e.preventDefault()
    setErrors('')

    if (otp.length !== 6) {
      setErrors('Please enter all 6 digits')
      return
    }

    setLoading(true)

    try {
      const response = await apiClient.post('/api/admin/verifyAdmin', {
        otp: otp,
        token: otpToken,
      })
      const accessToken = response.data?.accessToken
      const refreshToken = response.data?.refreshToken
      if (accessToken) {
        setAuthToken(accessToken, 'admin');
        localStorage.setItem('userType', 'admin');
      }
      if (refreshToken) {
        setRefreshToken(refreshToken)
      }
      console.log('OTP verified:', response.data)
      setSubmitted(true)
      setOtp('')
      
      setTimeout(() => {
        setLoading(false)
        navigate('/admin')
      }, 2000)
    } catch (error) {
      console.error('OTP verification error:', error.response?.data || error.message)
      setErrors(error.response?.data?.message || 'Invalid OTP. Please try again.')
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!otpToken) {
      setErrors('Session expired. Please login again.')
      return
    }

    setResendLoading(true)
    try {
      await apiClient.post('/api/admin/resendOtp', { token: otpToken })
      setTimerExpired(false)
      setOtp('')
      setErrors('')
      console.log('OTP resent successfully')
    } catch (error) {
      console.error('Resend OTP error:', error.response?.data || error.message)
      setErrors('Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  const handleTimerExpire = () => {
    setTimerExpired(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {loading && <Loader message="Verifying OTP..." />}
      <header className="px-6 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center py-10 px-6 md:px-10">
        <div className="max-w-2xl w-full">
          <div className="bg-[#eafef2] md:rounded-3xl rounded-lg p-6 md:p-10 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-[#14493b] mb-2">Verify OTP</h2>
            <p className="text-[#0e6b53] mb-8">Enter the 6-digit code sent to your email</p>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold text-center">
                OTP verified successfully!
              </div>
            )}

            {errors && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-semibold text-center">
                {errors}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* OTP Input */}
              <div className="flex flex-col items-center space-y-4">
                <label className="text-xs font-extrabold text-[#0e6b53]">Enter 6-Digit Code</label>
                <OtpInput value={otp} onChange={setOtp} length={6} />
              </div>

              {/* Timer */}
              {!timerExpired && (
                <OtpTimer initialSeconds={60} onExpire={handleTimerExpire} />
              )}

              {timerExpired && (
                <div className="text-center">
                  <p className="text-[#14493b] font-semibold mb-3">Code expired</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col gap-3 items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black font-bold px-8 py-2 rounded-full border-2 border-black hover:shadow-lg active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                {/* Resend OTP Button */}
                <ResendOtpButton
                  isDisabled={!timerExpired}
                  isLoading={resendLoading}
                  onClick={handleResendOtp}
                />
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AdminOtpLogin