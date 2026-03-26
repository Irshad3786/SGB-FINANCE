import React, { useEffect, useState } from 'react'
import apiClient from '../../api/axios'

function ChangePasswordModal({ isOpen, onClose }) {
  const [passwords, setPasswords] = useState({
    presentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!passwords.presentPassword.trim()) {
      newErrors.presentPassword = 'Present password is required'
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
      if (!passwordRegex.test(passwords.newPassword)) {
        newErrors.newPassword = 'Use 8+ chars with upper, lower, number, and special'
      }
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password'
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (passwords.presentPassword === passwords.newPassword) {
      newErrors.newPassword = 'New password must be different from present password'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        await apiClient.post('/api/admin/change-admin-password', {
          currentPassword: passwords.presentPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword
        })
        setSubmitted(true)
        setPasswords({
          presentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          setSubmitted(false)
          onClose()
        }, 2000)
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to change password'
        setServerError(message)
      } finally {
        setLoading(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#14493b]">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#0e6b53] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>

        {submitted && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold text-sm">
            Password changed successfully!
          </div>
        )}

        {serverError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-semibold text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Present Password */}
          <div className="flex flex-col">
            <label className="text-xs font-extrabold text-[#0e6b53] mb-2">Present Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#a6a6a6" fillRule="evenodd" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"/>
                </svg>
              </span>
              <input
                name="presentPassword"
                type="password"
                value={passwords.presentPassword}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2.5 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                placeholder="Enter present password"
              />
            </div>
            {errors.presentPassword && <p className="text-red-500 text-xs mt-1">{errors.presentPassword}</p>}
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="text-xs font-extrabold text-[#0e6b53] mb-2">New Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#a6a6a6" fillRule="evenodd" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"/>
                </svg>
              </span>
              <input
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2.5 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                placeholder="Enter new password"
              />
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="text-xs font-extrabold text-[#0e6b53] mb-2">Confirm Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#a6a6a6" fillRule="evenodd" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"/>
                </svg>
              </span>
              <input
                name="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2.5 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                placeholder="Confirm new password"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-full border-2 border-[#0e6b53] text-[#0e6b53] font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black font-bold px-4 py-2.5 rounded-full border-2 border-black hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
