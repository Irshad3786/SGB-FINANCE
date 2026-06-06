import React from 'react'

function BuyerConfirmModal({ isOpen, onClose, onConfirm, existingData }) {
  if (!isOpen || !existingData) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-500 transition-colors"
        >
          ✕
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-200 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>

        {/* Title & Warning */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">Vehicle Already Registered</h3>
        <p className="text-center text-xs sm:text-sm text-gray-600 mb-5">
          This vehicle or chassis number is already associated with an existing buyer record.
        </p>

        {/* Existing Data Card */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-4 mb-5">
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Existing Buyer Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-xs sm:text-sm">
            <div>
              <span className="text-gray-500 block text-[10px] sm:text-xs">Buyer Name</span>
              <span className="font-semibold text-gray-800">{existingData.name || '—'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] sm:text-xs">Agreement No</span>
              <span className="font-semibold text-gray-800 uppercase">{existingData.agreementNo || '—'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] sm:text-xs">Vehicle Name</span>
              <span className="font-semibold text-gray-800">{existingData.vehicleName || '—'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] sm:text-xs">Vehicle No</span>
              <span className="font-semibold text-gray-800 uppercase">{existingData.vehicleNumber || '—'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-500 block text-[10px] sm:text-xs">Chassis Number</span>
              <span className="font-semibold text-gray-800 uppercase tracking-wider break-all">{existingData.chassisNo || '—'}</span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-5 text-xs text-red-800 leading-relaxed">
          <span className="font-bold block mb-1">⚠️ CRITICAL WARNING:</span>
          Proceeding will <span className="font-bold">permanently DELETE</span> the existing buyer record and all their agreement data from the database. A new buyer record with a brand-new agreement will be created for this vehicle.
        </div>

        <p className="text-center font-medium text-gray-800 text-xs sm:text-sm mb-5">
          Are you sure you want to delete the old buyer and create this new entry?
        </p>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-xs sm:text-sm"
          >
            No, Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md transition-colors text-xs sm:text-sm"
          >
            Yes, Delete & Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default BuyerConfirmModal
