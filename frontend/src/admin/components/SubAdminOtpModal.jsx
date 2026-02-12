import React, { useState, useEffect } from 'react'
import apiClient from '../../api/axios'
import OtpInput from '../../home/components/OtpInput'
import OtpTimer from '../../home/components/OtpTimer'

function SubAdminOtpModal({ isOpen, onClose, otpToken, email, onSuccess }) {
  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showResend, setShowResend] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setOtp('')
      setError('')
      setSuccess('')
      setTimeLeft(300)
      setShowResend(false)
      return
    }

    if (timeLeft <= 0) {
      setShowResend(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, timeLeft])

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP')
      return
    }

    setIsVerifying(true)
    setError('')
    
    try {
      const response = await apiClient.post(
        '/api/subadmin/verifySubAdminOtp',
        { otp, token: otpToken }
      )

      if (response.data.success) {
        setSuccess('Sub-Admin verified successfully!')
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.')
      console.error('OTP verification error:', err)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    setIsVerifying(true)
    setError('')

    try {
      const response = await apiClient.post(
        '/api/subadmin/resendOtp',
        { token: otpToken }
      )

      if (response.data.success) {
        setSuccess('New OTP sent to your email!')
        setTimeLeft(300)
        setShowResend(false)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.')
      console.error('Resend OTP error:', err)
    } finally {
      setIsVerifying(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0e6b53]">Verify OTP</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isVerifying}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleVerifyOtp} className="px-6 py-6 space-y-6">
          {/* Email Display */}
          <div>
            <p className="text-sm text-gray-600 mb-2">OTP sent to:</p>
            <p className="text-center font-semibold text-gray-800">{email}</p>
          </div>

          {/* OTP Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
              Enter 6-digit OTP
            </label>
            <OtpInput value={otp} onChange={setOtp} length={6} />
          </div>

          {/* Timer */}
          {!showResend ? (
            <OtpTimer timeLeft={timeLeft} />
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isVerifying}
              className="w-full py-2 px-4 rounded-lg bg-[#40FF00] text-[#0e6b53] font-semibold hover:bg-[#30dd00] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isVerifying ? 'Sending...' : 'Resend OTP'}
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full py-3 px-4 rounded-lg bg-[#0e6b53] text-white font-semibold hover:bg-[#0d5a45] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SubAdminOtpModal
