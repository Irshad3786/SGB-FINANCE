import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../../components/ToastProvider'
import apiClient from '../../api/axios'

const statusPillClass = {
  pending: 'bg-amber-100 text-amber-800',
  open: 'bg-violet-100 text-violet-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
  resolved: 'bg-blue-100 text-blue-800',
}

function FinanceRequestForm({ vehicleNumber, chassisNumber, userData }) {
  const { showToast } = useToast()
  // Privacy: user auth isn't persisted in web storage.
  // We'll optimistically try the authenticated endpoint and fallback on 401.
  const hasAuthSession = true

  const [resolvedUserData, setResolvedUserData] = useState(userData || null)

  useEffect(() => {
    if (userData) {
      setResolvedUserData(userData)
    }
  }, [userData])

  useEffect(() => {
    let isActive = true

    const loadProfile = async () => {
      if (resolvedUserData) return
      try {
        const response = await apiClient.get('/api/user/me')
        const profile = response?.data?.data || response?.data || null
        if (isActive) setResolvedUserData(profile)
      } catch {
        // ignore, user might not be authenticated
      }
    }

    loadProfile()
    return () => {
      isActive = false
    }
  }, [resolvedUserData])

  const profile = resolvedUserData || {}
  const resolvedPhoneNumber = profile?.phoneNumber || profile?.phone || ''
  
  const [formData, setFormData] = useState({
    name: profile?.username || '',
    email: profile?.email || '',
    phoneNumber: resolvedPhoneNumber || '',
    vehicleNumber: vehicleNumber || profile?.vehicleNumber || '',
    chassisNumber: chassisNumber || profile?.chassisNumber || '',
    vehicleName: profile?.vehicleName || '',
    vehicleManufactureYear: profile?.vehicleManufactureYear || '',
    amount: '',
    purpose: 'refinance',
    comments: '',
  })

  // When profile arrives async, prefill missing fields without overwriting user edits.
  useEffect(() => {
    if (!resolvedUserData) return

    setFormData((prev) => ({
      ...prev,
      name: prev.name || profile?.username || '',
      email: prev.email || profile?.email || '',
      phoneNumber: prev.phoneNumber || resolvedPhoneNumber || '',
      vehicleNumber: prev.vehicleNumber || vehicleNumber || profile?.vehicleNumber || '',
      chassisNumber: prev.chassisNumber || chassisNumber || profile?.chassisNumber || '',
      vehicleName: prev.vehicleName || profile?.vehicleName || '',
      vehicleManufactureYear: prev.vehicleManufactureYear || profile?.vehicleManufactureYear || '',
    }))
  }, [resolvedUserData, profile?.username, profile?.email, resolvedPhoneNumber, profile?.vehicleNumber, profile?.chassisNumber, profile?.vehicleName, profile?.vehicleManufactureYear, vehicleNumber, chassisNumber])

  const myPublicIdentifiers = useMemo(() => {
    const email = formData.email || profile?.email || ''
    const phoneNumber = formData.phoneNumber || resolvedPhoneNumber || ''
    const vehicleNumberValue = formData.vehicleNumber || profile?.vehicleNumber || vehicleNumber || ''
    const chassisNumberValue = formData.chassisNumber || profile?.chassisNumber || chassisNumber || ''

    return {
      email,
      phoneNumber,
      vehicleNumber: vehicleNumberValue,
      chassisNumber: chassisNumberValue,
      hasAny: Boolean(email || phoneNumber || vehicleNumberValue || chassisNumberValue),
    }
  }, [formData.email, formData.phoneNumber, formData.vehicleNumber, formData.chassisNumber, profile?.email, resolvedPhoneNumber, profile?.vehicleNumber, profile?.chassisNumber, vehicleNumber, chassisNumber])

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [myRequests, setMyRequests] = useState([])
  const [isRequestsPanelOpen, setIsRequestsPanelOpen] = useState(false)
  const hasExistingRequest = myRequests.length > 0
  const latestRequest = myRequests[0] || null

  const normalizeRequestList = (requests = []) => {
    const seen = new Set()
    return requests.filter((request) => {
      const key = request?.id || request?.applicationNo
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const loadMyRequests = useCallback(async () => {
    try {
      // Prevent 400: backend requires at least one identifier.
      if (!myPublicIdentifiers.hasAny) {
        setMyRequests([])
        return
      }

      const publicParams = {
        type: 'finance',
        page: 1,
        limit: 20,
        email: myPublicIdentifiers.email,
        phoneNumber: myPublicIdentifiers.phoneNumber,
        vehicleNumber: myPublicIdentifiers.vehicleNumber,
        chassisNumber: myPublicIdentifiers.chassisNumber,
      }

      const publicResponse = await apiClient.get('/api/user/requests/my-public', { params: publicParams })
      const publicRequests = Array.isArray(publicResponse?.data?.data) ? publicResponse.data.data : []

      if (!hasAuthSession) {
        setMyRequests(normalizeRequestList(publicRequests))
        return
      }

      const authResponse = await apiClient.get('/api/user/requests/my', {
        params: {
          type: 'finance',
          page: 1,
          limit: 20,
        },
      })

      const authRequests = Array.isArray(authResponse?.data?.data) ? authResponse.data.data : []
      setMyRequests(normalizeRequestList([...authRequests, ...publicRequests]))
    } catch (error) {
      if (error?.response?.status === 401) {
        setMyRequests([])
        return
      }

      if (error?.response?.status === 400 && !hasAuthSession) {
        setMyRequests([])
        return
      }

      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to load your requests',
      })
    }
  }, [
    showToast,
    hasAuthSession,
    myPublicIdentifiers,
  ])

  useEffect(() => {
    loadMyRequests()
  }, [loadMyRequests])

  useEffect(() => {
    if (isRequestsPanelOpen) {
      loadMyRequests()
    }
  }, [isRequestsPanelOpen, loadMyRequests])

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
        !formData.vehicleNumber || !formData.chassisNumber || !formData.amount) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
      })
      return
    }

    if (Number(formData.amount) <= 0) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a valid amount',
      })
      return
    }

    setLoading(true)

    try {
      await apiClient.post('/api/user/requests/finance', {
        ...formData,
        requestedAmount: formData.amount,
      })
      await loadMyRequests()

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
          name: profile?.username || '',
          email: profile?.email || '',
          phoneNumber: resolvedPhoneNumber || '',
          vehicleNumber: vehicleNumber || profile?.vehicleNumber || '',
          chassisNumber: chassisNumber || profile?.chassisNumber || '',
          vehicleName: profile?.vehicleName || '',
          vehicleManufactureYear: profile?.vehicleManufactureYear || '',
          amount: '',
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
    if (!value) return { date: '-', time: '' }
    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return { date: '-', time: '' }

    return {
      date: parsedDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: parsedDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    }
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
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">Application No</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">Vehicle No</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">Requested Amount</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">Purpose</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {myRequests.map((request) => {
                const dateParts = formatRequestDate(request?.createdAt)

                return (
                <tr key={request?.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wide text-emerald-900">
                      {request?.applicationNo || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <p className="font-semibold text-slate-900 whitespace-nowrap">{dateParts.date}</p>
                    {dateParts.time ? (
                      <p className="mt-1 inline-flex w-fit rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {dateParts.time}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-semibold uppercase tracking-wide text-slate-900">{request?.vehicleNumber || '-'}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">₹ {Number(request?.requestedAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-700 capitalize">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {request?.purpose || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusPillClass[request?.status] || statusPillClass.pending}`}>
                      {request?.status || 'pending'}
                    </span>
                  </td>
                </tr>
                )
              })}
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

  const renderLatestRequestStatus = () => {
    if (!latestRequest) return null

    return (
      <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">My Req Status</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-sm font-bold text-emerald-900 shadow-sm">
                {latestRequest?.applicationNo || '-'}
              </span>
              <span className="text-sm text-emerald-900">
                {latestRequest?.vehicleNumber || '-'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusPillClass[latestRequest?.status] || statusPillClass.pending}`}>
              {latestRequest?.status || 'pending'}
            </span>
            <button
              type="button"
              onClick={() => setIsRequestsPanelOpen(true)}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              View All
            </button>
          </div>
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
      {renderLatestRequestStatus()}

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
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
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
