import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EmailVerificationModal from './EmailVerificationModal'
import Logo from '../../home/components/Logo'
import { setAuthToken } from '../../api/axios'

function UserNavbar({ userData }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // Clear httpOnly refresh cookie on backend so /user can't auto-login after logout.
      await fetch(`${import.meta.env.VITE_BACKEND_APP_API_URL}/api/user/logOutUser`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
    } catch {
      // Ignore network errors; still clear local in-memory token.
    } finally {
      setAuthToken(null, null)
      navigate('/login')
    }
  }

  return (
    <>
      <nav className="w-full bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Right Section - Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Avatar */}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#B0FF1C] to-[#40FF00] flex items-center justify-center text-black font-bold">
                  {userData?.username?.[0]?.toUpperCase() || 'U'}
                </div>

                {/* User Info (Hidden on mobile) */}
                <div className="hidden md:flex flex-col items-start">
                  <p className="text-sm font-semibold text-gray-900">{userData?.username || 'User'}</p>
                  <p className="text-xs text-gray-500">{userData?.email || 'user@example.com'}</p>
                </div>

                {/* Dropdown Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className={`text-gray-600 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
                >
                  <path fill="#666" d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    onClick={() => setShowProfileMenu(false)}
                    className="fixed inset-0 bg-black/30 z-40 md:hidden"
                  />

                  <div className="fixed left-2 right-2 top-16 bottom-2 md:absolute md:left-auto md:right-0 md:top-14 md:bottom-auto md:w-96 md:max-h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden scrollbar-hide bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 animate-in fade-in slide-in-from-top-2 z-50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      onClick={() => setShowProfileMenu(false)}
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>

                    {/* User Info Card */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B0FF1C] to-[#40FF00] flex items-center justify-center text-black font-bold text-lg">
                        {userData?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{userData?.username || 'User Name'}</p>
                        <p className="text-sm text-gray-600">{userData?.email || 'user@example.com'}</p>
                      </div>
                    </div>

                    {/* Email Verification Status */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">Email Status</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            userData?.isEmailVerified
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {userData?.isEmailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                      {!userData?.isEmailVerified && (
                        <button
                          onClick={() => {
                            setShowVerificationModal(true)
                            setShowProfileMenu(false)
                          }}
                          className="w-full mt-3 px-4 py-2 bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black font-semibold rounded-lg hover:shadow-md transition-shadow text-sm"
                        >
                          Verify Email
                        </button>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#999">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z" />
                        </svg>
                        <span className="text-sm text-gray-600">{userData?.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#999">
                          <path d="M6.62 10.79a15.9 15.9 0 006.59 6.59l2.2-2.2a1 1 0 011.03-.24c1.12.37 2.33.57 3.56.57a1 1 0 011 1V20a1 1 0 01-1 1C10.3 21 3 13.7 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.23.2 2.44.57 3.56a1 1 0 01-.24 1.03z" />
                        </svg>
                        <span className="text-sm text-gray-600">{userData?.phoneNumber || 'No phone'}</span>
                      </div>
                    </div>
                  </div>

                    {/* Vehicle Details Section */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Vehicle Details
                    </h3>

                    <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Vehicle Number</label>
                        <div className="px-3 py-2 bg-white rounded border border-gray-200 text-sm text-gray-900 font-mono">
                          {userData?.vehicleNumber || 'Not provided'}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Chassis Number</label>
                        <div className="px-3 py-2 bg-white rounded border border-gray-200 text-sm text-gray-900 font-mono">
                          {userData?.chassisNumber || 'Not provided'}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Vehicle Name</label>
                        <div className="px-3 py-2 bg-white rounded border border-gray-200 text-sm text-gray-900">
                          {userData?.vehicleName || userData?.vehicleModel || 'Not provided'}
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Action Buttons */}
                    <div className="mb-6 pb-6 border-b border-gray-200 space-y-3">
                    <button
                      onClick={() => {
                        navigate('/user/finance')
                        setShowProfileMenu(false)
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-[#B0FF1C] to-[#40FF00] text-black font-semibold rounded-lg hover:shadow-md transition-shadow text-sm flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                      View Finance Statement
                    </button>
                  </div>

                    {/* Logout Button */}
                    <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                    </svg>
                    Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <EmailVerificationModal
          userEmail={userData?.email}
          initialStep="entering"
          onClose={() => setShowVerificationModal(false)}
          onSuccess={() => {
            setShowVerificationModal(false)
            setShowProfileMenu(false)
          }}
        />
      )}
    </>
  )
}

export default UserNavbar
