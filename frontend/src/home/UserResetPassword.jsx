import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Logo from './components/Logo'
import Footer from './components/Footer'
import Loader from '../components/Loader'

function UserResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function toggleShowPassword(field) {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.password || !form.confirmPassword) {
      setError('All fields are required')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(form.password)) {
      setError('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!token) {
      setError('Invalid reset link. Please request a new one.')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_API_URL}/api/user/reset-User-Password/${token}`,
        {
          password: form.password,
          confirmPassword: form.confirmPassword
        }
      )

      setSuccess(response.data?.message || 'Password reset successfully. Redirecting to login...')
      setForm({ password: '', confirmPassword: '' })

      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {loading && <Loader message="Resetting password..." />}
      <header className="px-6 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start py-10 px-6 md:px-10">
        <div className="w-full max-w-md">
          <div className="bg-[#eafef2] rounded-3xl p-8 md:p-10 shadow-[-1px_3px_3px_0px_rgba(0,_0,_0,_0.1)]">
            <h2 className="text-3xl font-bold text-center text-[#14493b] mb-2">Reset Password</h2>
            <p className="text-center text-[#0e6b53] text-sm mb-6">Enter your new password to reset your account</p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#0e6b53] mb-1">New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#a6a6a6" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"/>
                    </svg>
                  </span>
                  <input
                    name="password"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={form.password}
                    onChange={onChange}
                    className="w-full pl-10 px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] pr-10"
                    placeholder="Enter new password (min 8 chars)"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('new')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-7 w-7 text-gray-500"
                    aria-label="Toggle password visibility"
                  >
                    {showPasswords.new ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M4.707 3.293a1 1 0 0 0-1.414 1.414l2.424 2.424c-1.43 1.076-2.678 2.554-3.611 4.422a1 1 0 0 0 0 .894C4.264 16.764 8.096 19 12 19c1.555 0 3.1-.355 4.53-1.055l2.763 2.762a1 1 0 0 0 1.414-1.414zm10.307 13.135c-.98.383-2 .572-3.014.572c-2.969 0-6.002-1.62-7.87-5c.817-1.479 1.858-2.62 3.018-3.437l2.144 2.144a3 3 0 0 0 4.001 4.001zm3.538-2.532c.483-.556.926-1.187 1.318-1.896c-1.868-3.38-4.9-5-7.87-5q-.168 0-.336.007L9.879 5.223A10.2 10.2 0 0 1 12 5c3.903 0 7.736 2.236 9.894 6.553a1 1 0 0 1 0 .894a13 13 0 0 1-1.925 2.865z"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#0e6b53] mb-1">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#a6a6a6" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"/>
                    </svg>
                  </span>
                  <input
                    name="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={onChange}
                    className="w-full pl-10 px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('confirm')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-7 w-7 text-gray-500"
                    aria-label="Toggle password visibility"
                  >
                    {showPasswords.confirm ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M4.707 3.293a1 1 0 0 0-1.414 1.414l2.424 2.424c-1.43 1.076-2.678 2.554-3.611 4.422a1 1 0 0 0 0 .894C4.264 16.764 8.096 19 12 19c1.555 0 3.1-.355 4.53-1.055l2.763 2.762a1 1 0 0 0 1.414-1.414zm10.307 13.135c-.98.383-2 .572-3.014.572c-2.969 0-6.002-1.62-7.87-5c.817-1.479 1.858-2.62 3.018-3.437l2.144 2.144a3 3 0 0 0 4.001 4.001zm3.538-2.532c.483-.556.926-1.187 1.318-1.896c-1.868-3.38-4.9-5-7.87-5q-.168 0-.336.007L9.879 5.223A10.2 10.2 0 0 1 12 5c3.903 0 7.736 2.236 9.894 6.553a1 1 0 0 1 0 .894a13 13 0 0 1-1.925 2.865z"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black font-bold px-6 py-2 rounded-full border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 transition"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-[#0e6b53] text-sm">
                  Remember your password?{' '}
                  <a href="/login" className="text-blue-600 font-medium hover:underline">
                    Sign In
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default UserResetPassword
