import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Logo from './components/Logo'
import Footer from './components/Footer'

function CreateAccountAdmin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    phoneNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretCode: ''
  })

  const [errors, setErrors] = useState({})

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!form.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required'
    } else if (!/^[0-9]{10,}$/.test(form.phoneNo.replace(/\D/g, ''))) {
      newErrors.phoneNo = 'Please enter a valid phone number'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!form.secretCode.trim()) {
      newErrors.secretCode = 'Secret code is required'
    }

    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_APP_API_URL}/api/admin/registerAdmin`, {
          name: form.name,
          phone: form.phoneNo,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          secretCode: form.secretCode
        })
        console.log('Admin account created:', response.data)
        const otpToken = response.data.token
        navigate('/admin-createaccount-otp', { state: { otpToken } })
      } catch (error) {
        console.error('Admin registration error:', error.response?.data || error.message)
        setErrors({ submit: error.response?.data?.message || 'Failed to create admin account' })
      }
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center py-10 px-6 md:px-10">
        <div className="max-w-5xl w-full">
          <div className="bg-[#eafef2] md:rounded-3xl rounded-lg p-6 md:p-10 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-[#14493b] mb-6">Create Admin Account</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Name */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Name</label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="block">
                      <path fill="#a6a6a6" fillRule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clipRule="evenodd"/>
                    </svg>
                  </span>

                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="pl-10 px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] w-full"
                    placeholder="Full Name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Phone No */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Phone No</label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="block">
                      <path fill="#a6a6a6" fillRule="evenodd" d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z" clipRule="evenodd"/>
                      <path fill="#a6a6a6" d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862" opacity="0.6"/>
                    </svg>
                  </span>

                  <input
                    name="phoneNo"
                    value={form.phoneNo}
                    onChange={onChange}
                    className="pl-10 px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] w-full"
                    placeholder="Phone No"
                  />
                </div>
                {errors.phoneNo && <p className="text-red-500 text-xs mt-1">{errors.phoneNo}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Email</label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="block">
                      <path fill="#a6a6a6" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m-.4 4.25l-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25a.85.85 0 1 1 .9-1.44L12 11l6.7-4.19a.85.85 0 1 1 .9 1.44"/>
                    </svg>
                  </span>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className="pl-10 w-full px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="Email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Enter Password</label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="block">
                      <path fill="#a6a6a6" fillRule="evenodd" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"/>
                    </svg>
                  </span>

                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    className="pl-10 w-full px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="Password"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Confirm Password</label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="block">
                      <path fill="#a6a6a6" fillRule="evenodd" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"/>
                    </svg>
                  </span>

                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={onChange}
                    className="pl-10 w-full px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="Confirm Password"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Secret Code */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Secret Code</label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="block">
                      <path fill="#a6a6a6" fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd"/>
                    </svg>
                  </span>

                  <input
                    name="secretCode"
                    type="password"
                    value={form.secretCode}
                    onChange={onChange}
                    className="pl-10 w-full px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="Secret Code"
                  />
                </div>
                {errors.secretCode && <p className="text-red-500 text-xs mt-1">{errors.secretCode}</p>}
              </div>

              {/* Submit - centered on mobile, right-aligned on md+ */}
              <div className="md:col-span-2 mt-4 flex justify-center md:justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black font-bold px-6 py-2 rounded-full border-2 border-black"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CreateAccountAdmin
