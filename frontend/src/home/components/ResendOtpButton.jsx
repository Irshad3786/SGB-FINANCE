import React from 'react'

function ResendOtpButton({ isDisabled, isLoading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`font-semibold transition ${
        isDisabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-[#0e6b53] hover:text-[#0e6b53] hover:underline active:scale-95'
      }`}
    >
      {isLoading ? 'Sending...' : 'Resend OTP'}
    </button>
  )
}

export default ResendOtpButton
