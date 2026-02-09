import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Logo from './components/Logo'
import Footer from './components/Footer'
import Loader from '../components/Loader'

function AdminForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_API_URL}/api/admin/forgot-Admin-Password`,
        {
          email: email
        }
      )

      console.log('Password reset email sent:', response.data)
      setSuccess('Password reset link has been sent to your email. Please check your inbox.')
      setEmail('')
      
      setTimeout(() => {
        navigate('/admin-signin')
      }, 3000)
      
    } catch (err) {
      console.error('Forgot password error:', err)
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {loading && <Loader message="Sending reset email..." />}
      <header className="px-6 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start py-10 px-6 md:px-10">
        {/* Forgot Password card */}
        <div className="w-full max-w-md">
          <div className="bg-[#eafef2] rounded-3xl p-8 md:p-10 shadow-[-1px_3px_3px_0px_rgba(0,_0,_0,_0.1)]">
            <h2 className="text-3xl font-bold text-center text-[#14493b] mb-2">Forgot Password</h2>
            <p className="text-center text-[#0e6b53] text-sm mb-6">Enter your email to receive a password reset link</p>

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
              {/* Email Field */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#0e6b53] mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#a6a6a6" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black font-bold px-6 py-2 rounded-full border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 transition"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>

              {/* Back to Sign In */}
              <div className="text-center mt-6">
                <p className="text-[#0e6b53] text-sm">
                  Remember your password?{' '}
                  <a href="/admin-signin" className="text-blue-600 font-medium hover:underline">
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

export default AdminForgotPassword