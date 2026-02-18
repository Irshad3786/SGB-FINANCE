import React, { useState } from 'react'

function EmailVerificationModal({ userEmail, onClose, onSuccess }) {
  const [step, setStep] = useState('sending') // 'sending' | 'entering'
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSendOtp = async () => {
    setLoading(true)
    setError('')
    try {
      // API call will be done later
      setStep('entering')
      setSuccessMessage('OTP sent to your email')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')
    try {
      // API call will be done later
      setSuccessMessage('Email verified successfully!')
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 animate-in fade-in scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {step === 'sending' ? 'Verify Email' : 'Enter OTP'}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {step === 'sending'
            ? 'We will send a verification code to your email'
            : `We sent a code to ${userEmail}`}
        </p>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
            ✓ {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
            ✕ {error}
          </div>
        )}

        {/* Content */}
        {step === 'sending' ? (
          <>
            {/* Email Display */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Verification code will be sent to</p>
              <p className="font-semibold text-gray-900 break-all">{userEmail}</p>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black font-bold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            {/* OTP Input Fields */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code</p>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 md:w-14 md:h-16 rounded-lg border-2 border-gray-300 text-center font-bold text-xl focus:border-[#40FF00] focus:outline-none focus:ring-2 focus:ring-[#40FF00] focus:ring-opacity-20 transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-3 bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black font-bold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed mb-3"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            {/* Resend Option */}
            <button
              onClick={() => {
                setStep('sending')
                setOtp(['', '', '', '', '', ''])
                setError('')
              }}
              className="w-full py-2 text-gray-600 font-medium text-sm hover:text-gray-900 transition-colors"
            >
              Didn't receive code? Send again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default EmailVerificationModal
