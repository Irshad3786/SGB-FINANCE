import React from 'react'
import PrintInvoice from './PrintInvoice'

function InvoicePreviewModal({ invoice, invoiceRef, onClose, onPrint }) {
  if (!invoice) return null

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 flex flex-col">
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-4 md:p-8">
          <PrintInvoice ref={invoiceRef} invoice={invoice} />
        </div>
      </div>

      <div className="bg-white border-t p-4">
        <div className="max-w-5xl mx-auto flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="px-5 py-2 rounded-lg bg-gradient-to-b from-[#bfff3a] to-[#40ff00] text-black font-semibold shadow"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoicePreviewModal
