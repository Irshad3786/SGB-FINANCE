import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../home/components/Logo'
import Footer from '../home/components/Footer'
import ChangePasswordModal from './components/ChangePasswordModal'
import LogoutConfirmModal from './components/LogoutConfirmModal'
import { setAuthToken, setRefreshToken } from '../api/axios'

function Admin() {
  const navigate = useNavigate()
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const [form, setForm] = useState({
    email: '',
    phoneNo: '',
    password: '',
    confirmPassword: '',
    roleName: '',
    status: 'active',
    roleAccess: {
      dashboard: { enabled: false, edit: false, view: false },
      vehicleStock: { enabled: false, edit: false, view: false },
      users: { enabled: false, edit: false, view: false },
      addEntry: { enabled: false, edit: false, view: false },
      finance: { enabled: false, edit: false, view: false },
      pendingPayments: { enabled: false, edit: false, view: false }
    }
  })

  const roleNames = [
    { value: 'financer', label: 'Financer' },
    { value: 'data_entry', label: 'Data Entry' },
    { value: 'collection_agent', label: 'Collection Agent' }
  ]

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const roles = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14">
          <path fill="#0e6b53" fillRule="evenodd" d="M1.375 1.375v5.75h3.75v-5.75zM.125 1.25C.125.629.629.125 1.25.125h4c.621 0 1.125.504 1.125 1.125v6c0 .621-.504 1.125-1.125 1.125h-4A1.125 1.125 0 0 1 .125 7.25zM8.75.125c-.621 0-1.125.504-1.125 1.125v2.01c0 .621.504 1.125 1.125 1.125h4c.621 0 1.125-.504 1.125-1.125V1.25c0-.621-.504-1.125-1.125-1.125zm.125 6.75v5.75h3.75v-5.75zm-1.25-.125c0-.621.504-1.125 1.125-1.125h4c.621 0 1.125.504 1.125 1.125v6c0 .621-.504 1.125-1.125 1.125h-4a1.125 1.125 0 0 1-1.125-1.125zM1.25 9.615c-.621 0-1.125.504-1.125 1.125v2.01c0 .621.504 1.125 1.125 1.125h4c.621 0 1.125-.504 1.125-1.125v-2.01c0-.621-.504-1.125-1.125-1.125z" clipRule="evenodd"/>
        </svg>
      ) 
    },
    { 
      id: 'vehicleStock', 
      label: 'Vehicle Stock', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="#0e6b53" d="M4 8.923h16V5.385q0-.231-.192-.423t-.423-.193H4.615q-.23 0-.423.192T4 5.384zm0 5.154h16V9.923H4zm.615 5.154h14.77q.23 0 .423-.193t.192-.423v-3.538H4v3.539q0 .23.192.423t.423.192M5.77 7.654V6.039h1.615v1.615zm0 5.154v-1.616h1.615v1.616zm0 5.154v-1.616h1.615v1.616z"/>
        </svg>
      ) 
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="#0e6b53" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7"/>
        </svg>
      ) 
    },
    { 
      id: 'addEntry', 
      label: 'Add Entry', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="#0e6b53" fillRule="evenodd" d="M7.345 4.017a42.3 42.3 0 0 1 9.31 0c1.713.192 3.095 1.541 3.296 3.26a40.7 40.7 0 0 1 0 9.446c-.201 1.719-1.583 3.068-3.296 3.26a42.3 42.3 0 0 1-9.31 0c-1.713-.192-3.095-1.541-3.296-3.26a40.7 40.7 0 0 1 0-9.445a3.734 3.734 0 0 1 3.295-3.26M12 7.007a.75.75 0 0 1 .75.75v3.493h3.493a.75.75 0 1 1 0 1.5H12.75v3.493a.75.75 0 0 1-1.5 0V12.75H7.757a.75.75 0 0 1 0-1.5h3.493V7.757a.75.75 0 0 1 .75-.75" clipRule="evenodd"/>
        </svg>
      ) 
    },
    { 
      id: 'finance', 
      label: 'Finance', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="none" stroke="#0e6b53" strokeWidth="2" d="M16 16c0-1.105-3.134-2-7-2s-7 .895-7 2s3.134 2 7 2s7-.895 7-2ZM2 16v4.937C2 22.077 5.134 23 9 23s7-.924 7-2.063V16M9 5c-4.418 0-8 .895-8 2s3.582 2 8 2M1 7v5c0 1.013 3.582 2 8 2M23 4c0-1.105-3.1-2-6.923-2s-6.923.895-6.923 2s3.1 2 6.923 2S23 5.105 23 4Zm-7 12c3.824 0 7-.987 7-2V4M9.154 4v10.166M9 9c0 1.013 3.253 2 7.077 2S23 10.013 23 9"/>
        </svg>
      ) 
    },
    { 
      id: 'pendingPayments', 
      label: 'Pending Payments', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path fill="#0e6b53" d="M22.26 3.35A1 1 0 0 0 21.5 3h-9a1 1 0 0 0-.75.34a1 1 0 0 0-.24.79l1 7.5a1 1 0 1 0 2-.26l-.81-6.09a.22.22 0 0 1 .06-.19a.25.25 0 0 1 .17-.09H20a.22.22 0 0 1 .19.09a.24.24 0 0 1 .06.2l-1.09 6.57a1 1 0 1 0 2 .33l1.34-8a1 1 0 0 0-.24-.84"/>
          <path fill="#0e6b53" d="M19 14h-6a.23.23 0 0 1-.22-.14L11.82 12a.5.5 0 0 0-.39-.28a.51.51 0 0 0-.45.18L9.1 14.21a.9.9 0 0 1-.59.28h-1A.5.5 0 0 0 7 15v6a.48.48 0 0 0 .2.4c2.3 1.73 4.08 2.6 5.3 2.6h5.55A1.7 1.7 0 0 0 20 22.66a56 56 0 0 0 1-7.16c0-.75-.69-1.5-2-1.5m-14.17-.5H1.75a.25.25 0 0 0-.25.25v9a.25.25 0 0 0 .25.25h3.08a.6.6 0 0 0 .67-.59v-8.32a.6.6 0 0 0-.67-.59M15.5 9a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M10 11a1 1 0 0 0 1-1.16L9.73 2.29a.28.28 0 0 1 0-.2A.25.25 0 0 1 10 2h8a1 1 0 0 0 0-2H8.5a1 1 0 0 0-1 1.16l1.5 9a1 1 0 0 0 1 .84"/>
        </svg>
      ) 
    }
  ]

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function handleRoleChange(roleId) {
    setForm(prev => ({
      ...prev,
      roleAccess: {
        ...prev.roleAccess,
        [roleId]: {
          ...prev.roleAccess[roleId],
          enabled: !prev.roleAccess[roleId].enabled,
          // Reset edit and view when disabling
          edit: !prev.roleAccess[roleId].enabled ? false : prev.roleAccess[roleId].edit,
          view: !prev.roleAccess[roleId].enabled ? false : prev.roleAccess[roleId].view
        }
      }
    }))
  }

  function handlePermissionChange(roleId, permission) {
    setForm(prev => ({
      ...prev,
      roleAccess: {
        ...prev.roleAccess,
        [roleId]: {
          ...prev.roleAccess[roleId],
          [permission]: !prev.roleAccess[roleId][permission]
        }
      }
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!form.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required'
    } else if (!/^[0-9]{10,}$/.test(form.phoneNo.replace(/\D/g, ''))) {
      newErrors.phoneNo = 'Please enter a valid phone number'
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!form.roleName) {
      newErrors.roleName = 'Please select a role name'
    }

    const hasSelectedRole = Object.values(form.roleAccess).some(val => val.enabled)
    if (!hasSelectedRole) {
      newErrors.roleAccess = 'Please select at least one role'
    }

    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      console.log('Sub-admin created:', form)
      setSubmitted(true)
      setForm({
        email: '',
        phoneNo: '',
        password: '',
        confirmPassword: '',
        roleName: '',
        status: 'active',
        roleAccess: {
          dashboard: { enabled: false, edit: false, view: false },
          vehicleStock: { enabled: false, edit: false, view: false },
          users: { enabled: false, edit: false, view: false },
          addEntry: { enabled: false, edit: false, view: false },
          finance: { enabled: false, edit: false, view: false },
          pendingPayments: { enabled: false, edit: false, view: false }
        }
      })
      setTimeout(() => setSubmitted(false), 3000)
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-4 md:px-10 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <Logo />
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => setIsChangePasswordOpen(true)}
              className="flex items-center gap-0 md:gap-2 px-2 md:px-4 py-2 rounded-full border-2 border-[#0e6b53] text-[#0e6b53] font-semibold hover:bg-[#eafef2] hover:shadow-md transition-all"
              title="Change Password"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#0e6b53" fillRule="evenodd" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"/>
              </svg>
              <span className="hidden md:inline">Change Password</span>
            </button>
            <button 
              onClick={() => setIsLogoutConfirmOpen(true)}
              className="flex items-center gap-0 md:gap-2 px-2 md:px-4 py-2 rounded-full border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 hover:shadow-md transition-all"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5 21q-.825 0-1.412-.587Q3 19.825 3 19V5q0-.825.588-1.412Q4.175 3 5 3h7v2H5v14h7v2Zm11-4l-1.4-1.4L16.2 12l-1.6-1.6L16 9l4 4Z"/>
              </svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center py-10 px-6 md:px-10">
        <div className="max-w-4xl w-full">
          <div className="bg-[#eafef2] rounded-3xl p-6 md:p-10 shadow-sm">
          <h2 className="text-3xl md:text-4xl font-bold text-[#14493b] mb-2">Add Sub-Admin</h2>
          <p className="text-[#0e6b53] mb-6">Create a new sub-admin account with specific role access</p>

          {submitted && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold">
              Sub-admin account created successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email and Phone No Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Email */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
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

              {/* Phone No */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Phone No</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#a6a6a6" fillRule="evenodd" d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z" clipRule="evenodd"/>
                      <path fill="#a6a6a6" d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862" opacity="0.6"/>
                    </svg>
                  </span>
                  <input
                    name="phoneNo"
                    value={form.phoneNo}
                    onChange={onChange}
                    className="pl-10 w-full px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                    placeholder="Phone No"
                  />
                </div>
                {errors.phoneNo && <p className="text-red-500 text-xs mt-1">{errors.phoneNo}</p>}
              </div>
            </div>

            {/* Role Name and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Role Name Dropdown */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Role Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#a6a6a6" d="M12 12.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7m0 2C7.66 14.5 4 16.36 4 18.5V20h16v-1.5c0-2.14-3.66-4-8-4"/>
                    </svg>
                  </span>
                  <select
                    name="roleName"
                    value={form.roleName}
                    onChange={onChange}
                    className="pl-10 w-full px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] appearance-none cursor-pointer"
                  >
                    <option value="">Select Role Name</option>
                    {roleNames.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                      <path fill="#a6a6a6" d="M7 10l5 5l5-5z"/>
                    </svg>
                  </span>
                </div>
                {errors.roleName && <p className="text-red-500 text-xs mt-1">{errors.roleName}</p>}
              </div>

              {/* Status Toggle */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Status</label>
                <div className="flex gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={form.status === 'active'}
                      onChange={onChange}
                      className="w-4 h-4 text-[#40FF00] focus:ring-[#bff86a]"
                    />
                    <span className={`font-semibold ${form.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={form.status === 'inactive'}
                      onChange={onChange}
                      className="w-4 h-4 text-red-500 focus:ring-red-300"
                    />
                    <span className={`font-semibold ${form.status === 'inactive' ? 'text-red-600' : 'text-gray-600'}`}>
                      Inactive
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Password and Confirm Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Password */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Enter Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
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
              <div className="flex flex-col">
                <label className="text-xs font-extrabold text-[#0e6b53] mb-1">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
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
            </div>

            {/* Role Access Section */}
            <div className="mt-8">
              <label className="text-sm font-extrabold text-[#0e6b53] mb-3 block">Role Access</label>
              <p className="text-xs text-gray-600 mb-4">Select which sections this sub-admin can access</p>
              
              <div className="grid grid-cols-1 gap-4">
                {roles.map(role => (
                  <div key={role.id} className="space-y-2">
                    <div
                      onClick={() => handleRoleChange(role.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        form.roleAccess[role.id].enabled
                          ? 'border-[#40FF00] bg-gradient-to-b from-[#B0FF1C]/20 to-[#40FF00]/20 shadow-md'
                          : 'border-gray-200 bg-white/50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          form.roleAccess[role.id].enabled ? 'bg-white' : 'bg-gray-100'
                        }`}>
                          {role.icon}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${
                            form.roleAccess[role.id].enabled ? 'text-[#0e6b53]' : 'text-gray-700'
                          }`}>
                            {role.label}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          form.roleAccess[role.id].enabled
                            ? 'border-[#40FF00] bg-[#40FF00]'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {form.roleAccess[role.id].enabled && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                              <path fill="white" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"/>
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Permissions Options - Show when role is enabled */}
                    {form.roleAccess[role.id].enabled && (
                      <div className="ml-12 flex gap-4 pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.roleAccess[role.id].edit}
                            onChange={() => handlePermissionChange(role.id, 'edit')}
                            className="w-4 h-4 text-[#40FF00] rounded focus:ring-[#bff86a] border-gray-300"
                          />
                          <span className="text-sm font-medium text-[#0e6b53]">Edit</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.roleAccess[role.id].view}
                            onChange={() => handlePermissionChange(role.id, 'view')}
                            className="w-4 h-4 text-[#40FF00] rounded focus:ring-[#bff86a] border-gray-300"
                          />
                          <span className="text-sm font-medium text-[#0e6b53]">View</span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {errors.roleAccess && <p className="text-red-500 text-xs mt-2">{errors.roleAccess}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center md:justify-end pt-4">
              <button
                type="submit"
                className="bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black font-bold px-8 py-2.5 rounded-full border-2 border-black hover:shadow-lg transition-shadow"
              >
                Create Sub-Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>

    <ChangePasswordModal 
      isOpen={isChangePasswordOpen}
      onClose={() => setIsChangePasswordOpen(false)}
    />

    <LogoutConfirmModal 
      isOpen={isLogoutConfirmOpen}
      onClose={() => setIsLogoutConfirmOpen(false)}
      onConfirm={() => {
        // Clear auth tokens
        setAuthToken(null)
        setRefreshToken(null)
        setIsLogoutConfirmOpen(false)
        // Redirect to login
        navigate('/admin-login')
      }}
    />

    <Footer />
  </div>
  )
}

export default Admin
