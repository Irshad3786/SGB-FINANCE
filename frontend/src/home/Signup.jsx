import React, { useState } from 'react'
import axios from 'axios'
import Logo from './components/Logo'
import Footer from './components/Footer'

function Signup() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicleNo: '',
    chassis: '',
    password: '',
    confirmPassword: ''
  })

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    
    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    // Send data to backend
    axios.post(`${import.meta.env.VITE_BACKEND_APP_API_URL}/api/auth/signup`, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      vehicleNo: form.vehicleNo,
      chassis: form.chassis,
      password: form.password
    })
    .then(response => {
      console.log('Signup successful:', response.data)
      alert('Account created successfully!')
      // Reset form
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        vehicleNo: '',
        chassis: '',
        password: '',
        confirmPassword: ''
      })
    })
    .catch(error => {
      console.error('Signup error:', error.response?.data || error.message)
      alert('Error: ' + (error.response?.data?.message || 'Failed to create account'))
    })
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#14493b] mb-6">Create Account</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* First Name */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">First Name</label>

                <div className="relative">
                  {/* user icon inside input (left) */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="block">
                      <path fill="#a6a6a6" fillRule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clipRule="evenodd"/>
                    </svg>
                  </span>

                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    className="pl-10 px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] w-full"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Last Name</label>

                <div className="relative">
                  {/* user icon inside input (left) */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="block">
                      <path fill="#a6a6a6" fillRule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clipRule="evenodd"/>
                    </svg>
                  </span>

                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    className="pl-10 px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] w-full"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Email</label>

                <div className="relative">
                  {/* email icon inside input (left) */}
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
              </div>

              {/* Phone */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Phone No</label>

                <div className="relative">
                  {/* phone icon inside input (left) */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="block">
                      <path fill="#a6a6a6" fillRule="evenodd" d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z" clipRule="evenodd"/>
                      <path fill="#a6a6a6" d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862" opacity="0.6"/>
                    </svg>
                  </span>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="pl-10 w-full px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="Phone No"
                  />
                </div>
              </div>

              {/* Vehicle No (icon added) */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Vehicle No</label>

                <div className="relative">
                  {/* vehicle icon inside input (left) */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="22" viewBox="0 0 17 24" className="block">
                      <path fill="#a6a6a6" d="M8.632 15.526a2.11 2.11 0 0 0-2.106 2.105v4.305a2.106 2.106 0 0 0 4.212 0v-.043v.002v-4.263a2.11 2.11 0 0 0-2.104-2.106z"/>
                      <path fill="#a6a6a6" d="M16.263 2.631H12.21C11.719 1.094 10.303 0 8.631 0S5.544 1.094 5.06 2.604l-.007.027h-4a1.053 1.053 0 0 0 0 2.106h4.053c.268.899.85 1.635 1.615 2.096l.016.009c-2.871.867-4.929 3.48-4.947 6.577v5.528a1.753 1.753 0 0 0 1.736 1.737h1.422v-3a3.737 3.737 0 1 1 7.474 0v3h1.421a1.75 1.75 0 0 0 1.738-1.737v-5.474a6.855 6.855 0 0 0-4.899-6.567l-.048-.012a3.65 3.65 0 0 0 1.625-2.08l.007-.026h4.053a1.056 1.056 0 0 0 1.053-1.053a1.15 1.15 0 0 0-1.104-1.105h-.002zM8.631 5.84a2.106 2.106 0 1 1 2.106-2.106l.001.06c0 1.13-.916 2.046-2.046 2.046l-.063-.001h.003z"/>
                    </svg>
                  </span>

                  <input
                    name="vehicleNo"
                    value={form.vehicleNo}
                    onChange={onChange}
                    className="pl-10 w-full px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="Vehicle No"
                  />
                </div>
              </div>

              {/* Chassis */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Enter Chassis</label>

                <div className="relative">
                  {/* chassis icon inside input (left) */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="block">
                      <path fill="#a6a6a6" fillRule="evenodd" d="M3.172 5.172C2 6.343 2 8.229 2 12s0 5.657 1.172 6.828S6.229 20 10 20h4c3.771 0 5.657 0 6.828-1.172S22 15.771 22 12s0-5.657-1.172-6.828S17.771 4 14 4h-4C6.229 4 4.343 4 3.172 5.172M8 13a1 1 0 1 0 0-2a1 1 0 0 0 0 2m5-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clipRule="evenodd"/>
                    </svg>
                  </span>

                  <input
                    name="chassis"
                    value={form.chassis}
                    onChange={onChange}
                    className="pl-10 w-full px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="Chassis"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Enter password</label>

                <div className="relative">
                  {/* lock icon inside input (left) */}
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
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col relative">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Enter Confirm Password</label>

                <div className="relative">
                  {/* lock icon inside input (left) */}
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
              </div>

              {/* Submit - centered on mobile, right-aligned on md+ */}
              <div className="md:col-span-2 mt-4 flex justify-center md:justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black font-bold px-6 py-2 rounded-full border-2 border-black"
                >
                  submit
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

export default Signup