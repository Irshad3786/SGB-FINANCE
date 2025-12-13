import React from 'react'

function WhatsAppConfirmModal({ isOpen, onClose, onConfirm, userName }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md bg-white rounded-2xl p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
        >
          ✕
        </button>

        {/* WhatsApp Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
              <path fill="#25D366" d="M8 0a8 8 0 1 1-4.075 14.886L.658 15.974a.5.5 0 0 1-.632-.632l1.089-3.266A8 8 0 0 1 8 0M5.214 4.004a.7.7 0 0 0-.526.266C4.508 4.481 4 4.995 4 6.037c0 1.044.705 2.054.804 2.196c.098.138 1.388 2.28 3.363 3.2q.55.255 1.12.446c.472.16.902.139 1.242.085c.379-.06 1.164-.513 1.329-1.01c.163-.493.163-.918.113-1.007c-.049-.088-.18-.142-.378-.25c-.196-.105-1.165-.618-1.345-.687c-.18-.073-.312-.106-.443.105c-.132.213-.507.691-.623.832c-.113.139-.23.159-.425.053c-.198-.105-.831-.33-1.584-1.054c-.585-.561-.98-1.258-1.094-1.469c-.116-.213-.013-.326.085-.433c.09-.094.198-.246.296-.371c.097-.122.132-.21.198-.353c.064-.141.031-.266-.018-.371s-.443-1.152-.607-1.577c-.16-.413-.323-.355-.443-.363c-.114-.005-.245-.005-.376-.005"/>
            </svg>
          </div>
        </div>

        {/* Title and Message */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Send WhatsApp Message</h3>
        <p className="text-center text-gray-600 mb-6">
          Do you want to send a message to <span className="font-semibold text-gray-800">{userName}</span>?
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            No
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 px-4 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
          >
            Yes, Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppConfirmModal
