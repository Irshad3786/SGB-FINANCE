import React from 'react'
import { useState } from 'react'

function BuySell() {
  const [role, setRole] = useState('seller')
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
    referralPhone: ''
  })

  const [files, setFiles] = useState({
    aadharFront: null,
    aadharBack: null,
    profile: null
  })

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
    // send form + files
    console.log('submit', { role, ...form, files })
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-8">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-[#E0FCED] rounded-2xl p-6 sm:p-8 shadow-lg"
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
          <label className="text-xs font-medium text-gray-600">full name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            placeholder="Enter full name"
            className="w-full h-9 px-3 rounded-full bg-white/80 text-sm outline-none"
          />

          <label className="text-xs font-medium text-gray-600">phone no</label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="Enter phone no"
            className="w-full h-9 px-3 rounded-full bg-white/80 text-sm outline-none"
          />

          <label className="text-xs font-medium text-gray-600">aadhar no</label>
          <input
            name="aadhar"
            value={form.aadhar}
            onChange={onChange}
            placeholder="Enter aadhar no"
            className="w-full h-9 px-3 rounded-full bg-white/80 text-sm outline-none"
          />

          <label className="text-xs font-medium text-gray-600">vehicle no</label>
          <input
            name="vehicleNo"
            value={form.vehicleNo}
            onChange={onChange}
            placeholder="Enter vehicle no"
            className="w-full h-9 px-3 rounded-full bg-white/80 text-sm outline-none"
          />

          <label className="text-xs font-medium text-gray-600">chassis no</label>
          <input
            name="chassisNo"
            value={form.chassisNo}
            onChange={onChange}
            placeholder="Enter chassis no"
            className="w-full h-9 px-3 rounded-full bg-white/80 text-sm outline-none"
          />

          <label className="text-xs font-medium text-gray-600">sale amount</label>
          <input
            name="saleAmount"
            value={form.saleAmount}
            onChange={onChange}
            placeholder="Enter sale amount"
            className="w-full h-9 px-3 rounded-full bg-white/80 text-sm outline-none"
          />

          <label className="text-xs font-medium text-gray-600">date of birth</label>
          <input
            name="dob"
            value={form.dob}
            onChange={onChange}
            type="date"
            className="w-full h-9 px-3 rounded-full bg-white/80 text-sm outline-none"
          />

          <label className="text-xs font-medium text-gray-600">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="Enter address"
            className="w-full px-3 py-2 rounded-md bg-white/80 text-sm outline-none h-20"
          />

          {/* Uploads: Aadhar Front, Aadhar Back, Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Aadhar (Front)</label>
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
              <label className="text-xs font-medium text-gray-600">Aadhar (Back)</label>
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
              <label className="text-xs font-medium text-gray-600">Profile Photo</label>
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

          <label className="text-xs font-medium text-gray-600">Referal Name</label>
          <input
            name="referralName"
            value={form.referralName}
            onChange={onChange}
            placeholder="Enter referal name"
            className="w-full h-9 px-3 rounded-full bg-white/80 text-sm outline-none"
          />

          <label className="text-xs font-medium text-gray-600">Referral Phone No</label>
          <input
            name="referralPhone"
            value={form.referralPhone}
            onChange={onChange}
            placeholder="Enter referral phone"
            className="w-full h-9 px-3 rounded-full bg-white/80 text-sm outline-none"
          />
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