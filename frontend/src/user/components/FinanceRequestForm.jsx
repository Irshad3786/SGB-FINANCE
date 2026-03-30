import React, { useEffect, useState } from 'react'
import { useToast } from '../../components/ToastProvider'

function FinanceRequestForm({ vehicleNumber, chassisNumber }) {
  const { showToast } = useToast()
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  
  const [formData, setFormData] = useState({
    name: userData?.username || '',
    email: userData?.email || '',
    phoneNumber: userData?.phoneNumber || '',
    vehicleNumber: vehicleNumber || userData?.vehicleNumber || '',
    chassisNumber: chassisNumber || userData?.chassisNumber || '',
    vehicleName: userData?.vehicleName || '',
    vehicleManufactureYear: userData?.vehicleManufactureYear || '',
    requestedAmount: '',
    purpose: 'refinance',
    comments: '',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [myRequests, setMyRequests] = useState([])
  const [isRequestsPanelOpen, setIsRequestsPanelOpen] = useState(false)
  const hasExistingRequest = myRequests.length > 0

  const getStoredRequests = () => {
    try {
      const requests = JSON.parse(localStorage.getItem('financeRequests') || '[]')
      return Array.isArray(requests) ? requests : []
    } catch {
      return []
    }
  }

  const loadMyRequests = () => {
    const allRequests = getStoredRequests()
    const currentEmail = String(userData?.email || '').toLowerCase()
    const currentPhone = String(userData?.phoneNumber || '')

    const filteredRequests = allRequests
      .filter((request) => {
        const requestEmail = String(request?.email || '').toLowerCase()
        const requestPhone = String(request?.phoneNumber || '')

        return (
          (currentEmail && requestEmail === currentEmail) ||
          (currentPhone && requestPhone === currentPhone)
        )
      })
      .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())

    setMyRequests(filteredRequests)
  }

  useEffect(() => {
    loadMyRequests()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (hasExistingRequest) {
      showToast({
        type: 'warning',
        title: 'Request Already Exists',
        message: 'You have already submitted a finance request. Multiple requests are not allowed.',
      })
      return
    }

    // Validation
    if (!formData.name || !formData.email || !formData.phoneNumber || 
        !formData.vehicleNumber || !formData.chassisNumber || !formData.requestedAmount) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
      })
      return
    }

    if (Number(formData.requestedAmount) <= 0) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a valid amount',
      })
      return
    }

    setLoading(true)

    try {
      // Store the request in localStorage for now
      // In a real app, this would be sent to backend
      const request = {
        id: Date.now(),
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }

      const existingRequests = JSON.parse(localStorage.getItem('financeRequests') || '[]')
      existingRequests.push(request)
      localStorage.setItem('financeRequests', JSON.stringify(existingRequests))
      loadMyRequests()

      setSubmitted(true)
      showToast({
        type: 'success',
        title: 'Request Submitted',
        message: 'Finance request submitted successfully! We will contact you soon.',
      })
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          name: userData?.username || '',
          email: userData?.email || '',
          phoneNumber: userData?.phoneNumber || '',
          vehicleNumber: vehicleNumber || userData?.vehicleNumber || '',
          chassisNumber: chassisNumber || userData?.chassisNumber || '',
          vehicleName: userData?.vehicleName || '',
          vehicleManufactureYear: userData?.vehicleManufactureYear || '',
          requestedAmount: '',
          purpose: 'refinance',
          comments: '',
        })
      }, 3000)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Submission Failed',
        message: error?.response?.data?.message || 'Failed to submit request. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatRequestDate = (value) => {
    if (!value) return '-'
    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return '-'

    return parsedDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const renderMyRequestsSection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-xl font-bold text-gray-900">My Requests</h3>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
          {myRequests.length} request{myRequests.length === 1 ? '' : 's'}
        </span>
      </div>

      {myRequests.length === 0 ? (
        <p className="text-gray-600">No finance requests submitted yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Vehicle No</th>
                <th className="px-4 py-3 text-left font-semibold">Requested Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Purpose</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((request) => (
                <tr key={request?.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 text-gray-700">{formatRequestDate(request?.createdAt)}</td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">{request?.vehicleNumber || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">₹ {Number(request?.requestedAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-700 capitalize">{request?.purpose || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 capitalize">
                      {request?.status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderRequestsPanel = () => {
    if (!isRequestsPanelOpen) return null

    return (
      <div className="fixed inset-0 z-50">
        <button
          type="button"
          aria-label="Close requests panel"
          onClick={() => setIsRequestsPanelOpen(false)}
          className="absolute inset-0 bg-black/40"
        />

        <div className="absolute top-0 right-0 h-full w-full sm:w-[92%] md:w-[78%] lg:w-[62%] xl:w-[52%] bg-gray-50 p-4 sm:p-6 overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">My Requests</h2>
            <button
              type="button"
              onClick={() => setIsRequestsPanelOpen(false)}
              className="h-9 w-9 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          {renderMyRequestsSection()}
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsRequestsPanelOpen(true)}
            className="bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg hover:bg-black transition-colors"
          >
            View My Requests
          </button>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-4">
            <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
              <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your finance request. Our team will review your details and contact you within 24-48 hours.
          </p>
          <p className="text-sm text-gray-500">
            Confirmation has been sent to <span className="font-semibold">{formData.email}</span>
          </p>
        </div>
        {renderRequestsPanel()}
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Finance Record Found</h2>
            <p className="text-gray-600">
              We couldn't find any existing finance record for the vehicle details provided.
              However, you can request finance for this vehicle below.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsRequestsPanelOpen(true)}
            className="self-start bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg hover:bg-black transition-colors"
          >
            View My Requests
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {hasExistingRequest && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            You have already submitted one finance request. Multiple requests are not allowed.
          </div>
        )}

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#40FF00] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#40FF00] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#40FF00] transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Vehicle Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vehicle Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="E.g., KA-01-AB-1234"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#40FF00] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chassis Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="chassisNumber"
                value={formData.chassisNumber}
                onChange={handleChange}
                placeholder="E.g., ABC123XYZ456"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#40FF00] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vehicle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicleName"
                value={formData.vehicleName}
                onChange={handleChange}
                placeholder="E.g., Hero Splendor Plus"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#40FF00] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Manufacturing Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="vehicleManufactureYear"
                value={formData.vehicleManufactureYear}
                onChange={handleChange}
                placeholder="E.g., 2020"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#40FF00] transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Finance Request Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Finance Request Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requested Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="requestedAmount"
                value={formData.requestedAmount}
                onChange={handleChange}
                placeholder="E.g., 50000"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#40FF00] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purpose <span className="text-red-500">*</span>
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#40FF00] transition-colors"
              >
                <option value="buy">Purchase</option>
                <option value="refinance">Refinance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Comments
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Tell us about your vehicle condition, any damage, or special requirements..."
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#40FF00] transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || hasExistingRequest}
          className="w-full bg-gradient-to-r from-[#B0FF1C] to-[#40FF00] hover:from-[#a8ff00] hover:to-[#38e600] disabled:opacity-50 text-black font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          {hasExistingRequest ? 'Request Already Submitted' : loading ? 'Submitting...' : 'Submit Finance Request'}
        </button>

        {/* Terms & Conditions */}
        <p className="text-xs text-center text-gray-600">
          By submitting this form, you agree to our terms and conditions. 
          We will contact you within 24-48 hours.
        </p>
      </form>

      {renderRequestsPanel()}
    </div>
  )
}

export default FinanceRequestForm
