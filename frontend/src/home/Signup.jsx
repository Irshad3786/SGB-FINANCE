import React, { useState } from 'react'
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
    // minimal handling for now
    console.log('Signup submit', form)
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
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  className="px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="First Name"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  className="px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="Last Name"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  className="px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="Email"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">PHONE NO</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="Phone No"
                />
              </div>

              {/* Vehicle No */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Vehicle No</label>
                <input
                  name="vehicleNo"
                  value={form.vehicleNo}
                  onChange={onChange}
                  className="px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="Vehicle No"
                />
              </div>

              {/* Chassis */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Enter Chassis</label>
                <input
                  name="chassis"
                  value={form.chassis}
                  onChange={onChange}
                  className="px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="Chassis"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Enter password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  className="px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="Password"
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Enter Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={onChange}
                  className="px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                  placeholder="Confirm Password"
                />
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