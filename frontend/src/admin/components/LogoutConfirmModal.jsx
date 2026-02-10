import React from 'react'

function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path fill="#ef4444" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2v2m0-4h-2V7h2v6z"/>
            </svg>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#14493b] mb-2">Logout</h2>
        <p className="text-center text-gray-600 mb-6">Are you sure you want to logout?</p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-full border-2 border-[#0e6b53] text-[#0e6b53] font-semibold hover:bg-[#eafef2] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-b from-red-500 to-red-600 text-white font-bold px-4 py-2.5 rounded-full border-2 border-red-700 hover:shadow-lg transition-shadow"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutConfirmModal
