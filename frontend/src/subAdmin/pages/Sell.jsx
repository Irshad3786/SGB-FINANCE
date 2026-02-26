import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RefinanceForm from '../components/RefinanceForm'
import { apDistricts, apMandals } from '../constants/apLocations'
import apiClient from '../../api/axios'
import { useToast } from '../../components/ToastProvider'

function Sell() {
  const [role, setRole] = useState('seller')
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    soWoCo: '',
    phone: '',
    alternatePhone: '',
    aadhaar: '',
    vehicleName: '',
    model: '',
    vehicleNo: '',
    chassisNo: '',
    saleAmount: '',
    dob: '',
    district: '',
    customDistrict: '',
    mandal: '',
    customMandal: '',
    street: '',
    address: '',
    referralName: '',
    referralPhone: '',
    
  })

  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    profile: null
  })

  const [showRefinance, setShowRefinance] = useState(false)

  const inputBase = 'w-full pl-10 px-3 py-2 rounded-xl border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] pr-4 text-sm'
  const { showToast } = useToast()

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function onDistrictChange(e) {
    const value = e.target.value
    setForm(prev => ({
      ...prev,
      district: value,
      mandal: '',
      customMandal: '',
      customDistrict: value === 'Other' ? prev.customDistrict : ''
    }))
  }

  function onMandalChange(e) {
    const value = e.target.value
    setForm(prev => ({
      ...prev,
      mandal: value,
      customMandal: value === 'Other' ? prev.customMandal : ''
    }))
  }

  function onFileChange(e, key) {
    const file = e.target.files[0] || null
    setFiles(prev => ({ ...prev, [key]: file }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    try {
      const payload = {
        role,
        ...form,
      }

      const response = await apiClient.post('/api/subadmin/management/save-seller', payload)
      console.log('seller saved:', response.data)
      showToast({
        type: 'success',
        title: 'Success',
        message: response.data?.message || 'Seller saved successfully'
      })
    } catch (error) {
      console.error('seller save error:', error?.response?.data || error.message)
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to save seller'
      })
    }
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
              onClick={() => {
                setRole('seller')
                navigate('/subadmin/sell')
              }}
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
              onClick={() => {
                setRole('buyer')
                navigate('/subadmin/buy')
              }
              }
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

        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={() => setShowRefinance((s) => !s)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow transition-all ${
              showRefinance
                ? 'bg-gradient-to-b from-[#bfff3a] to-[#40ff00] text-black'
                : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-white border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="#a6a6a6" d="M0 10.5v-1A4.5 4.5 0 0 1 4.5 5h7.586l-2-2L11.5 1.586L15.914 6L11.5 10.414L10.086 9l2-2H4.5a2.5 2.5 0 0 0 0 5H12v2H4.5a4.5 4.5 0 0 1-4.388-3.5z"/>
              </svg>
            </span>
            Refinance
          </button>
        </div>

        {showRefinance ? (
          <div className="mb-6">
            <RefinanceForm inputBase={inputBase} labelClass={labelClass} />
          </div>
        ) : (
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18"/></svg>
              </div>
            </div>

            <label className={labelClass}>s/o w/o c/o</label>
            <div className="relative">
              <input
                name="soWoCo"
                value={form.soWoCo}
                onChange={onChange}
                placeholder="Enter s/o w/o c/o"
                className={inputBase}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path fill="#a6a6a6" d="M3 14s-1 0-1-1s1-4 6-4s6 3 6 4s-1 1-1 1zm5-6a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/>
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
              <div className="absolute left-3 top-5 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" fillRule="evenodd" d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z" clipRule="evenodd"/><path fill="#a6a6a6" d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862" opacity="0.6"/></svg>
              </div>
            </div>

            <label className={labelClass}>alternate phone no</label>
            <div className="relative">
              <input
                name="alternatePhone"
                value={form.alternatePhone}
                onChange={onChange}
                placeholder="Enter alternate phone no"
                className={inputBase}
              />
              <div className="absolute left-3 top-5 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" fillRule="evenodd" d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z" clipRule="evenodd"/><path fill="#a6a6a6" d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862" opacity="0.6"/></svg>
              </div>
            </div>

            <label className={labelClass}>aadhaar no</label>
            <div className="relative">
              <input
                name="aadhaar"
                value={form.aadhaar}
                onChange={onChange}
                placeholder="Enter aadhaar no"
                className={inputBase}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32"><path fill="#a6a6a6" d="M5 6C3.355 6 2 7.355 2 9v14c0 1.645 1.355 3 3 3h22c1.645 0 3-1.355 3-3V9c0-1.645-1.355-3-3-3zm0 2h22c.566 0 1 .434 1 1v14c0 .566-.434 1-1 1H5c-.566 0-1-.434-1-1V9c0-.566.434-1 1-1m6 2c-2.2 0-4 1.8-4 4c0 1.113.477 2.117 1.219 2.844A5.04 5.04 0 0 0 6 21h2c0-1.668 1.332-3 3-3s3 1.332 3 3h2a5.04 5.04 0 0 0-2.219-4.156C14.523 16.117 15 15.114 15 14c0-2.2-1.8-4-4-4m7 1v2h8v-2zm-7 1c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m7 3v2h8v-2zm0 4v2h5v-2z"/></svg>
              </div>
            </div>
            <div className='relative'>
              <label className={labelClass}>vehicle no</label>
              <input
                name="vehicleNo"
                value={form.vehicleNo}
                onChange={onChange}
                placeholder="Enter vehicle no"
                className={inputBase}
              />
              <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="22" viewBox="0 0 17 24"><path fill="#a6a6a6" d="M8.632 15.526a2.11 2.11 0 0 0-2.106 2.105v4.305a2.106 2.106 0 0 0 4.212 0v-.043v.002v-4.263a2.11 2.11 0 0 0-2.104-2.106z"/><path fill="#a6a6a6" d="M16.263 2.631H12.21C11.719 1.094 10.303 0 8.631 0S5.544 1.094 5.06 2.604l-.007.027h-4a1.053 1.053 0 0 0 0 2.106h4.053c.268.899.85 1.635 1.615 2.096l.016.009c-2.871.867-4.929 3.48-4.947 6.577v5.528a1.753 1.753 0 0 0 1.736 1.737h1.422v-3a3.737 3.737 0 1 1 7.474 0v3h1.421a1.75 1.75 0 0 0 1.738-1.737v-5.474a6.855 6.855 0 0 0-4.899-6.567l-.048-.012a3.65 3.65 0 0 0 1.625-2.08l.007-.026h4.053a1.056 1.056 0 0 0 1.053-1.053a1.15 1.15 0 0 0-1.104-1.105h-.002zM8.631 5.84a2.106 2.106 0 1 1 2.106-2.106l.001.06c0 1.13-.916 2.046-2.046 2.046l-.063-.001h.003z"/></svg>
              </div>
            </div>
            <div className='relative'>
              <label className={labelClass}>vehicle name</label>
              <input
                name="vehicleName"
                value={form.vehicleName}
                onChange={onChange}
                placeholder="Enter vehicle name"
                className={inputBase}
              />
              <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M10.7 11H8.95h3.75zM5 19q-2.075 0-3.537-1.463T0 14t1.463-3.537T5 9h11.6l-2-2H12q-.425 0-.712-.288T11 6t.288-.712T12 5h2.575q.4 0 .763.15t.637.425L19.45 9.05q1.95.15 3.25 1.575T24 14q0 2.075-1.463 3.538T19 19t-3.537-1.463T14 14q0-.45.063-.888t.237-.862l-2.45 2.45q-.15.15-.337.225t-.388.075H9.9q-.35 1.75-1.725 2.875T5 19m14-2q1.25 0 2.125-.875T22 14t-.875-2.125T19 11t-2.125.875T16 14t.875 2.125T19 17M5 17q.95 0 1.713-.55T7.8 15H6q-.425 0-.712-.288T5 14t.288-.712T6 13h1.8q-.325-.9-1.088-1.45T5 11q-1.25 0-2.125.875T2 14t.875 2.125T5 17m4.95-4h.75l2-2H8.95q.375.425.625.925T9.95 13"/></svg>
              </div>
            </div>
            <div className='relative'>
              <label className={labelClass}>model</label>
              <input
                name="model"
                value={form.model}
                onChange={onChange}
                placeholder="Enter model"
                className={inputBase}
              />
              <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 640 640"><path fill="#a6a6a6" d="M224 64c17.7 0 32 14.3 32 32v32h128V96c0-17.7 14.3-32 32-32s32 14.3 32 32v32h32c35.3 0 64 28.7 64 64v288c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64h32V96c0-17.7 14.3-32 32-32m0 256c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32z"/></svg>
              </div>
            </div>
            
            <div className='relative'>
              <label className={labelClass}>chassis no</label>
              <input
                name="chassisNo"
                value={form.chassisNo}
                onChange={onChange}
                placeholder="Enter chassis no"
                className={inputBase}
              />

              <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12.75 3a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0z"/><path fill="#a6a6a6" fillRule="evenodd" d="M22.75 12.057c0 1.837 0 3.293-.153 4.432c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.837 0-3.293 0-4.432-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.926q.001-.575.008-1.096c.014-.975.05-1.81.145-2.523c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c.716-.096 1.558-.132 2.541-.145l.697-.005a1 1 0 0 1 1.001.999V5a2.25 2.25 0 0 0 4.5 0v-.75c0-.552.448-1 1-.998c1.29.006 2.359.033 3.239.151c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433zM8 9.75a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zm0 3.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z" clipRule="evenodd"/></svg>
              </div>
             </div>
            
            <div className='relative'>
            <label className={labelClass}>sale amount</label>
            <input
              name="saleAmount"
              value={form.saleAmount}
              onChange={onChange}
              placeholder="Enter sale amount"
              className={inputBase}
            />
            <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="m21.4 14.25l-7.15 7.15q-.3.3-.675.45t-.75.15t-.75-.15t-.675-.45l-8.825-8.825q-.275-.275-.425-.637T2 11.175V4q0-.825.588-1.412T4 2h7.175q.4 0 .775.163t.65.437l8.8 8.825q.3.3.438.675t.137.75t-.137.738t-.438.662M6.5 8q.625 0 1.063-.437T8 6.5t-.437-1.062T6.5 5t-1.062.438T5 6.5t.438 1.063T6.5 8"/></svg>
              </div>
            </div>
            <div className='relative'>
            <label className={labelClass}>date of birth</label>
            <input
              name="dob"
              value={form.dob}
              onChange={onChange}
              type="date"
              className={inputBase + ' py-2'} // keep padding for date picker
            />

            <div className="absolute left-3 top-11 -translate-y-1/2 text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M6.94 2c.416 0 .753.324.753.724v1.46c.668-.012 1.417-.012 2.26-.012h4.015c.842 0 1.591 0 2.259.013v-1.46c0-.4.337-.725.753-.725s.753.324.753.724V4.25c1.445.111 2.394.384 3.09 1.055c.698.67.982 1.582 1.097 2.972L22 9H2v-.724c.116-1.39.4-2.302 1.097-2.972s1.645-.944 3.09-1.055V2.724c0-.4.337-.724.753-.724"/><path fill="#a6a6a6" d="M22 14v-2c0-.839-.004-2.335-.017-3H2.01c-.013.665-.01 2.161-.01 3v2c0 3.771 0 5.657 1.172 6.828S6.228 22 10 22h4c3.77 0 5.656 0 6.828-1.172S22 17.772 22 14" opacity="0.5"/><path fill="#a6a6a6" d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0"/></svg>
              </div>
            </div>
            <label className={labelClass}>District</label>
            <div className="relative">
              <input
                name="district"
                value={form.district}
                onChange={onDistrictChange}
                list="district-options-sell"
                placeholder="Select district"
                className={inputBase}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
              </div>
            </div>
            {form.district === 'Other' && (
              <div className="relative">
                <input
                  name="customDistrict"
                  value={form.customDistrict}
                  onChange={onChange}
                  placeholder="Enter district"
                  className={inputBase}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none"><path fill="#a6a6a6" d="M12 2a6 6 0 0 0-6 6c0 5 6 14 6 14s6-9 6-14a6 6 0 0 0-6-6m0 8a2 2 0 1 1 0-4a2 2 0 0 1 0 4"/></svg>
                </div>
              </div>
            )}
            <datalist id="district-options-sell">
              {apDistricts.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>

            <label className={labelClass}>Mandal</label>
            <div className="relative">
              <input
                name="mandal"
                value={form.mandal}
                onChange={onMandalChange}
                list="mandal-options-sell"
                placeholder="Select mandal"
                className={inputBase}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
              </div>
            </div>
            {form.mandal === 'Other' && (
              <div className="relative">
                <input
                  name="customMandal"
                  value={form.customMandal}
                  onChange={onChange}
                  placeholder="Enter mandal"
                  className={inputBase}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
                </div>
              </div>
            )}
            <datalist id="mandal-options-sell">
              {apMandals.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>

            <label className={labelClass}>Street / Locality</label>
            <div className="relative">
              <input
                name="street"
                value={form.street}
                onChange={onChange}
                placeholder="Enter street or locality"
                className={inputBase}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
              </div>
            </div>

            <label className={labelClass}>Full Address</label>
            <div className="relative">
              <textarea
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Enter address"
                className="w-full pl-10 pr-3 py-2 rounded-md bg-white/90 text-sm outline-none h-20 border border-transparent shadow-inner focus:ring-2 focus:ring-[#bff86a]"
              />
              <div className="absolute left-3 top-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <g fill="none">
                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                    <path fill="#a6a6a6" d="M20 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-3 12H7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2m-7-8H8a2 2 0 0 0-1.995 1.85L6 9v2a2 2 0 0 0 1.85 1.995L8 13h2a2 2 0 0 0 1.995-1.85L12 11V9a2 2 0 0 0-1.85-1.995zm7 4h-3a1 1 0 0 0-.117 1.993L14 13h3a1 1 0 0 0 .117-1.993zm-7-2v2H8V9zm7-2h-3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Uploads: Aadhaar Front, Aadhaar Back, Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Aadhaar (Front)</label>
                <label className="mt-1 flex items-center gap-3 h-10 px-3 bg-white rounded-full border border-dashed text-sm cursor-pointer">
                  {/* animated upload svg */}
                  <span className="flex items-center justify-center w-7 h-7">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                      <g fill="none" stroke="#a6a6a6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path fill="#a6a6a6" fillOpacity="0" strokeDasharray="20" strokeDashoffset="20" d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5">
                          <animate attributeName="d" begin="0.5s" dur="1.5s" repeatCount="indefinite" values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"/>
                          <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1"/>
                          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0"/>
                        </path>
                        <path strokeDasharray="14" strokeDashoffset="14" d="M6 19h12">
                          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0"/>
                        </path>
                      </g>
                    </svg>
                  </span>

                  <span className="text-gray-500 truncate flex-1">
                    {files.aadhaarFront ? files.aadhaarFront.name : 'Upload aadhaar front'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => onFileChange(e, 'aadhaarFront')}
                  />
                </label>
              </div>

              <div>
                <label className={labelClass}>Aadhaar (Back)</label>
                <label className="mt-1 flex items-center gap-3 h-10 px-3 bg-white rounded-full border border-dashed text-sm cursor-pointer">
                  <span className="flex items-center justify-center w-7 h-7">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                      <g fill="none" stroke="#a6a6a6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path fill="#a6a6a6" fillOpacity="0" strokeDasharray="20" strokeDashoffset="20" d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5">
                          <animate attributeName="d" begin="0.5s" dur="1.5s" repeatCount="indefinite" values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"/>
                          <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1"/>
                          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0"/>
                        </path>
                        <path strokeDasharray="14" strokeDashoffset="14" d="M6 19h12">
                          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0"/>
                        </path>
                      </g>
                    </svg>
                  </span>

                  <span className="text-gray-500 truncate flex-1">
                    {files.aadhaarBack ? files.aadhaarBack.name : 'Upload aadhaar back'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => onFileChange(e, 'aadhaarBack')}
                  />
                </label>
              </div>

              <div>
                <label className={labelClass}>Profile Photo</label>
                <label className="mt-1 flex items-center gap-3 h-10 px-3 bg-white rounded-full border border-dashed text-sm cursor-pointer">
                  <span className="flex items-center justify-center w-7 h-7">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                      <g fill="none" stroke="#a6a6a6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path fill="#a6a6a6" fillOpacity="0" strokeDasharray="20" strokeDashoffset="20" d="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5">
                          <animate attributeName="d" begin="0.5s" dur="1.5s" repeatCount="indefinite" values="M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5;M12 15h2v-3h2.5l-4.5 -4.5M12 15h-2v-3h-2.5l4.5 -4.5;M12 15h2v-6h2.5l-4.5 -4.5M12 15h-2v-6h-2.5l4.5 -4.5"/>
                          <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1"/>
                          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0"/>
                        </path>
                        <path strokeDasharray="14" strokeDashoffset="14" d="M6 19h12">
                          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0"/>
                        </path>
                      </g>
                    </svg>
                  </span>

                  <span className="text-gray-500 truncate flex-1">
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
            <div className="relative">
              <input
                name="referralName"
                value={form.referralName}
                onChange={onChange}
                placeholder="Enter referal name"
                className={inputBase}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 12 12" className="w-6 h-6" fill="none">
                  <path fill="#a6a6a6" d="M6 1a2 2 0 1 0 0 4a2 2 0 0 0 0-4m2.5 5h-5A1.5 1.5 0 0 0 2 7.5c0 1.116.459 2.01 1.212 2.615C3.953 10.71 4.947 11 6 11s2.047-.29 2.788-.885C9.54 9.51 10 8.616 10 7.5A1.5 1.5 0 0 0 8.5 6"/>
                </svg>
              </div>
            </div>

            <label className={labelClass}>Referral Phone No</label>
            <div className="relative">
              <input
                name="referralPhone"
                value={form.referralPhone}
                onChange={onChange}
                placeholder="Enter referral phone"
                className={inputBase}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path fill="#a6a6a6" fillRule="evenodd" d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z" clipRule="evenodd"/>
                  <path fill="#a6a6a6" d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862" opacity="0.6"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {!showRefinance && (
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-gradient-to-b from-[#bfff3a] to-[#40ff00] font-semibold shadow"
            >
              Submit
            </button>
          </div>
        )}
      </form>

    </div>
  )
}

export default Sell