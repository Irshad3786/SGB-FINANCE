import React from 'react'
import { useState } from 'react'

function BuySell() {
  const [role, setRole] = useState('seller')
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    aadhar: '',
    vehicleNo: '',
    chassisNo: '',
    saleAmount: '',
    dob: '',
    address: '',
    referralName: '',
    referralPhone: '',
    password: ''
  })

  const [files, setFiles] = useState({
    aadharFront: null,
    aadharBack: null,
    profile: null
  })

  const inputBase = 'w-full pl-10 px-3 py-2 rounded-xl border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] pr-10 text-sm'

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function onFileChange(e, key) {
    const file = e.target.files[0] || null
    setFiles(prev => ({ ...prev, [key]: file }))
  }

  function onSubmit(e) {
    e.preventDefault()
    console.log('submit', { role, ...form, files })
  }

  // unified label class (same as first input label)
  const labelClass = "text-sm text-[#27563C] font-semibold"

  return (
    <div className="min-h-screen flex items-start justify-center py-8 ">
      <form
        onSubmit={onSubmit}
        className="w-[100%]  max-w-lg bg-[#E0FCED] rounded-2xl p-6  sm:p-8 shadow-lg"
      >
        <h2 className="text-center text-2xl font-bold text-[#27563C] mb-6">Add User Details</h2>

        {/* role toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white rounded-full p-1 shadow-md flex space-x-2">
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                role === 'seller'
                  ? 'bg-gradient-to-b from-[#bfff3a] to-[#40ff00] text-black shadow'
                  : 'bg-white text-gray-700'
              }`}
            >
              Seller
            </button>

            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                role === 'buyer'
                  ? 'bg-gradient-to-b from-[#bfff3a] to-[#40ff00] text-black shadow'
                  : 'bg-white text-gray-700'
              }`}
            >
              Buyer
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className={labelClass}>full name</label>
          <div className="relative">
            <input
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              placeholder="Enter full name"
              className={inputBase}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {/* user icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM4 18v-.5A4.5 4.5 0 0 1 8.5 13h7A4.5 4.5 0 0 1 20 17.5V18" />
              </svg>
            </div>
          </div>

          <label className={labelClass}>phone no</label>
          <div className="relative">
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="Enter phone no"
              className={inputBase}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 5h2l.4 2M7 7h10l1 5-1 5H7l-1-5L7 7z" />
              </svg>
            </div>
          </div>

          <label className={labelClass}>aadhar no</label>
          <div className="relative">
            <input
              name="aadhar"
              value={form.aadhar}
              onChange={onChange}
              placeholder="Enter aadhar no"
              className={inputBase}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
              </svg>
            </div>
          </div>

          <label className={labelClass}>vehicle no</label>
          <input
            name="vehicleNo"
            value={form.vehicleNo}
            onChange={onChange}
            placeholder="Enter vehicle no"
            className={inputBase}
          />

          <label className={labelClass}>chassis no</label>
          <input
            name="chassisNo"
            value={form.chassisNo}
            onChange={onChange}
            placeholder="Enter chassis no"
            className={inputBase}
          />

          <label className={labelClass}>sale amount</label>
          <input
            name="saleAmount"
            value={form.saleAmount}
            onChange={onChange}
            placeholder="Enter sale amount"
            className={inputBase}
          />

          <label className={labelClass}>date of birth</label>
          <input
            name="dob"
            value={form.dob}
            onChange={onChange}
            type="date"
            className={inputBase + ' py-2'} // keep padding for date picker
          />

          <label className={labelClass}>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="Enter address"
            className="w-full px-3 py-2 rounded-md bg-white/90 text-sm outline-none h-20 border border-transparent shadow-inner focus:ring-2 focus:ring-[#bff86a]"
          />

          {/* Uploads: Aadhar Front, Aadhar Back, Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Aadhar (Front)</label>
              <label className="mt-1 flex items-center justify-between h-10 px-3 bg-white rounded-full border border-dashed text-sm cursor-pointer">
                <span className="text-gray-500 truncate">
                  {files.aadharFront ? files.aadharFront.name : 'Upload aadhar front'}
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => onFileChange(e, 'aadharFront')}
                />
              </label>
            </div>

            <div>
              <label className={labelClass}>Aadhar (Back)</label>
              <label className="mt-1 flex items-center justify-between h-10 px-3 bg-white rounded-full border border-dashed text-sm cursor-pointer">
                <span className="text-gray-500 truncate">
                  {files.aadharBack ? files.aadharBack.name : 'Upload aadhar back'}
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => onFileChange(e, 'aadharBack')}
                />
              </label>
            </div>

            <div>
              <label className={labelClass}>Profile Photo</label>
              <label className="mt-1 flex items-center justify-between h-10 px-3 bg-white rounded-full border border-dashed text-sm cursor-pointer">
                <span className="text-gray-500 truncate">
                  {files.profile ? files.profile.name : 'Upload profile'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFileChange(e, 'profile')}
                />
              </label>
            </div>
          </div>

          <label className={labelClass}>Referal Name</label>
          <input
            name="referralName"
            value={form.referralName}
            onChange={onChange}
            placeholder="Enter referal name"
            className={inputBase}
          />

          <label className={labelClass}>Referral Phone No</label>
          <input
            name="referralPhone"
            value={form.referralPhone}
            onChange={onChange}
            placeholder="Enter referral phone"
            className={inputBase}
          />

          {/* Password field with same styling and show/hide */}
          <label className={labelClass}>Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={onChange}
              className={inputBase}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 p-1"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.99 9.99 0 012.512-6.358M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" />
              </svg>
            </div>
          </div>

        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-gradient-to-b from-[#bfff3a] to-[#40ff00] font-semibold shadow"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default BuySell