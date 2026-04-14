import React, { useEffect, useMemo, useState } from 'react'

function DistrictLocationModal({ isOpen, onClose, districtLocation, onSave }) {
  const [form, setForm] = useState({
    district: '',
    mandalsText: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const existingMandals = useMemo(() => {
    return form.mandalsText
      .split(/[\n,]/g)
      .map((item) => item.trim())
      .filter(Boolean)
  }, [form.mandalsText])

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const originalOverflow = document.body.style.overflow

    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (districtLocation) {
      setForm({
        district: districtLocation.district || '',
        mandalsText: Array.isArray(districtLocation.mandals)
          ? districtLocation.mandals.join('\n')
          : '',
      })
      setErrors({})
      return
    }

    if (isOpen) {
      setForm({
        district: '',
        mandalsText: '',
      })
      setErrors({})
    }
  }, [districtLocation, isOpen])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.district.trim()) {
      newErrors.district = 'District name is required'
    }

    if (existingMandals.length === 0) {
      newErrors.mandalsText = 'Please add at least one mandal'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await onSave({
        ...districtLocation,
        district: form.district.trim(),
        mandals: existingMandals,
      })
      setErrors({})
      onClose()
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error?.response?.data?.message || 'Failed to save district location',
      }))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="sticky top-0 bg-gradient-to-b from-[#eafef2] to-white px-6 md:px-8 py-4 md:py-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#14493b]">{districtLocation?._id ? 'Edit District' : 'Add District'}</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>

        <div className="px-6 md:px-8 py-6 md:py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.submit && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium">
                {errors.submit}
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-xs font-extrabold text-[#0e6b53] mb-2">District Name</label>
              <input
                name="district"
                type="text"
                value={form.district}
                onChange={onChange}
                className="px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                placeholder="Enter district name"
              />
              {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-extrabold text-[#0e6b53] mb-2">Mandals</label>
              <textarea
                name="mandalsText"
                value={form.mandalsText}
                onChange={onChange}
                rows={10}
                className="px-4 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#bff86a] resize-y"
                placeholder="Add one mandal per line or separate by commas"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {existingMandals.slice(0, 6).map((mandal) => (
                  <span key={mandal} className="px-2 py-1 rounded-full bg-[#eafef2] text-[#0e6b53] text-xs font-semibold">
                    {mandal}
                  </span>
                ))}
                {existingMandals.length > 6 && (
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                    +{existingMandals.length - 6} more
                  </span>
                )}
              </div>
              {errors.mandalsText && <p className="text-red-500 text-xs mt-1">{errors.mandalsText}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-gray-900 font-semibold shadow hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save District'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DistrictLocationModal